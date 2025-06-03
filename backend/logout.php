<?php

use Firebase\JWT\JWT;
use Firebase\JWT\Key;


function handleLogoutRequest($method, $pdo)
{
    if ($method !== 'POST') {
        http_response_code(405);
        echo json_encode(["error" => "Logout requires POST method."]);
        exit();
    }


    $input = json_decode(file_get_contents('php://input'), true);
    $refresh_token = $input['refresh_token'] ?? '';

    if (empty($refresh_token)) {
        http_response_code(400);
        echo json_encode(["error" => "Refresh token is required for logout."]);
        exit();
    }

    try {

        $decoded_refresh_token = JWT::decode($refresh_token, new Key(JWT_SECRET_KEY, 'HS256'));

        $user_id = $decoded_refresh_token->sub;
        $jti = $decoded_refresh_token->jti;


        $stmt = $pdo->prepare("DELETE FROM refresh_tokens WHERE user_id = ?");
        $stmt->execute([$user_id]);

        http_response_code(200);
        echo json_encode(["message" => "Logged out successfully."]);

    } catch (\Firebase\JWT\ExpiredException $e) {
        http_response_code(200);
        echo json_encode(["message" => "Token already expired, logged out successfully."]);
    } catch (\Firebase\JWT\SignatureInvalidException $e) {
        http_response_code(401);
        echo json_encode(["error" => "Invalid token signature."]);
    } catch (\Exception $e) {
        http_response_code(500);
        error_log("Logout error: " . $e->getMessage());
        echo json_encode(["error" => "An error occurred during logout."]);
    }
    exit();
}