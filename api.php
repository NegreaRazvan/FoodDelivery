<?php
require_once __DIR__ . '/backend/db_connect.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");


if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}


$requestUri = $_SERVER['REQUEST_URI'];
$method = $_SERVER['REQUEST_METHOD'];

//'/OnlineRestaurant/foods' -> '/foods'
$basePath = '/OnlineRestaurant/';
$path = substr($requestUri, strlen($basePath));

//remove query string if present
$path = strtok($path, '?');

//trim leading/trailing slashes for easier parsing
$path = trim($path, '/');

$pathSegments = explode('/', $path);
$mainRoute = $pathSegments[0];

switch ($mainRoute) {
    case 'foods':
        require_once __DIR__ . '/backend/food_api.php';
        $api_path_segments = array_slice($pathSegments, 1);
        handleFoodApiRequest($method, $api_path_segments, $pdo);
        break;


    default:
        http_response_code(404);
        echo json_encode(['message' => 'Endpoint not found: ' . htmlspecialchars($path)]);
        break;
}
?>