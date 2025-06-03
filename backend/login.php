<?php

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

function handleLoginRequest($method, $pdo)
{
    if ($method !== 'POST') {
        http_response_code(405);
        echo json_encode(["error" => "Login requires POST method."]);
        exit();
    }


    $input = json_decode(file_get_contents('php://input'), true);
    $query = "SELECT * FROM users WHERE username = ?";
    $username = trim($input['username'] ?? '');
    $password = trim($input['password'] ?? '');

    if (empty($username) || empty($password)) {
        http_response_code(400);
        echo json_encode(["error" => "Both the username and the password are required"]);
        exit();
    }

    $stmt = $pdo->prepare($query);
    $stmt->execute([$username]);
    $user = $stmt->fetch(\PDO::FETCH_ASSOC);

    if (empty($user) || !password_verify($password, $user["password_hash"])) {
        http_response_code(401);
        echo json_encode(["error" => "Invalid username or password"]);
        exit();
    }

    $access_token_payload = [
        'iss' => 'http://localhost/OnlineRestaurant/foods',
        'aud' => 'http://localhost',
        'iat' => time(),
        'exp' => time() + ACCESS_TOKEN_EXPIRATION_SECONDS,
        'sub' => $user['id'],
        'username' => $user['username']
    ];
    $access_token = JWT::encode($access_token_payload, JWT_SECRET_KEY, 'HS256');

    $refresh_token_payload = [
        'iss' => 'http://localhost/OnlineRestaurant/foods',
        'aud' => 'http://localhost',
        'iat' => time(),
        'exp' => time() + REFRESH_TOKEN_EXPIRATION_SECONDS,
        'sub' => $user['id'],
        'jti' => bin2hex(random_bytes(16))
    ];
    $refresh_token = JWT::encode($refresh_token_payload, JWT_SECRET_KEY, 'HS256');

    $refresh_token_hash = password_hash($refresh_token, PASSWORD_BCRYPT);
    $expires_at_datetime = date('Y-m-d H:i:s', $refresh_token_payload['exp']);

    //if there are any left over refresh tokens for this user, delete them

    $stmt = $pdo->prepare("DELETE FROM refresh_tokens WHERE user_id = ?");
    $stmt->execute([$user['id']]);

    $stmt = $pdo->prepare("INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)");
    $stmt->execute([$user['id'], $refresh_token_hash, $expires_at_datetime]);

    http_response_code(200); // OK
    echo json_encode([
        "message" => "Login successful!",
        "user" => [
            "id" => $user['id'],
            "username" => $user['username'],
            "email" => $user['email']
        ],
        "access_token" => $access_token,
        "refresh_token" => $refresh_token,
        "expires_in" => ACCESS_TOKEN_EXPIRATION_SECONDS
    ]);
    exit();

}

?>