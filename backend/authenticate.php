<?php


use Firebase\JWT\JWT;
use Firebase\JWT\Key;


function authenticateToken()
{
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? '';

    if (empty($authHeader)) {
        http_response_code(401);
        echo json_encode(["error" => "Authorization token is missing."]);
        exit();
    }


    list($type, $token) = explode(' ', $authHeader, 2);

    if (strtolower($type) !== 'bearer' || empty($token)) {
        http_response_code(401);
        echo json_encode(["error" => "Invalid Authorization header format. Expected 'Bearer <token>'."]);
        exit();
    }

    try {
        $decoded = JWT::decode($token, new Key(JWT_SECRET_KEY, 'HS256'));

        if ($decoded->exp < time()) {
            http_response_code(401);
            echo json_encode(["error" => "Access token has expired."]);
            exit();
        }

        return (int) $decoded->sub;

    } catch (\Firebase\JWT\ExpiredException $e) {
        http_response_code(401);
        echo json_encode(["error" => "Access token has expired."]);
        exit();
    } catch (\Firebase\JWT\SignatureInvalidException $e) {
        http_response_code(401);
        echo json_encode(["error" => "Invalid token signature."]);
        exit();
    } catch (\Exception $e) {
        http_response_code(401);
        error_log("Token authentication error: " . $e->getMessage());
        echo json_encode(["error" => "Invalid token."]);
        exit();
    }
}