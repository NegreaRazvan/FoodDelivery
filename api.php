<?php
require_once __DIR__ . '/backend/db_connect.php';
require_once __DIR__ . '/backend/authenticate.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");


if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$user_id = null;


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

$protectedRoutes = ['foods', 'favorite'];

//to make sure it's the user is still valid
$headers = getallheaders();
$authHeader = $headers['Authorization'] ?? '';

if (!empty($authHeader)) {
    try {
        $user_id = authenticateToken();
    } catch (Exception $e) {
        error_log("Authentication attempt failed for public route: " . $e->getMessage());
        $user_id = null;
    }
}

switch ($mainRoute) {
    case 'foods':
        require_once __DIR__ . '/backend/food_api.php';
        $api_path_segments = array_slice($pathSegments, 1);
        handleFoodApiRequest($method, $api_path_segments, $pdo, $user_id);
        break;

    case 'login':
        require_once __DIR__ . '/backend/login.php';
        handleLoginRequest($method, $pdo);
        break;

    case 'logout':
        require_once __DIR__ . '/backend/logout.php';
        handleLogoutRequest($method, $pdo);
        break;

    case 'tags':
        require_once __DIR__ . '/backend/food_api.php';
        handleNumberOfTagsRequest($method, $pdo);
        break;

    case 'favorite':
        require_once __DIR__ . '/backend/food_api.php';
        $api_path_segments = array_slice($pathSegments, 1);

        $food_id = $api_path_segments[0] ?? null;
        if (!$user_id) {
            http_response_code(401);
            echo json_encode(['message' => 'Authentication required to manage favorites.']);
            exit();
        }

        if ($method === 'POST') {
            handleFavoriteAFood($method, $pdo, $user_id, (int) $food_id);
        } elseif ($method === 'DELETE') {
            handleUnfavoriteAFood($method, $pdo, $user_id, (int) $food_id);
        } else {
            http_response_code(405); // Method Not Allowed
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;

    case 'orders':
        require_once __DIR__ . '/backend/order.php';
        if ($method === 'POST') {
            handleAddOrder($pdo);
        } elseif ($method === 'PUT') {
            ///
        } elseif ($method === 'GET') {
            handleGetAllOrders($pdo);
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
        }
        break;


    default:
        http_response_code(404);
        echo json_encode(['message' => 'Endpoint not found: ' . htmlspecialchars($path)]);
        break;
}
?>