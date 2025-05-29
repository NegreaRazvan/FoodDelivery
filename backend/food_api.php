<?php

require_once 'db_connect.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost');
#header('Access-Control-Allow-Origin: http://onlinerestaurant.localhost');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

//for the preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];
$request_uri = explode('/', trim($_SERVER['REQUEST_URI'], '/'));

$api_path_index = array_search('foods', $request_uri);
$api_path = ($api_path_index !== false) ? array_slice($request_uri, $api_path_index + 1) : [];

function getFoodTags($food_id, $pdo)
{
    $stmt = $pdo->prepare("SELECT tag_name FROM food_tags WHERE food_id = ?");
    $stmt->execute([$food_id]);
    return $stmt->fetchAll(PDO::FETCH_COLUMN);
}

switch ($method) {
    case 'GET':
        $foods = [];
        $query = "SELECT f.* FROM foods f";
        $params = [];

        //handle search by ID 
        if (isset($api_path[0]) && is_numeric($api_path[0])) {
            $food_id = (int) $api_path[0];
            $query .= " WHERE f.id = ?"; //concatenate
            $params[] = $food_id;
            $stmt = $pdo->prepare($query);
            $stmt->execute($params);
            $food = $stmt->fetch();
            if ($food) {
                $food['tags'] = getFoodTags($food['id'], $pdo);
                echo json_encode($food);
            } else {
                http_response_code(404);
                echo json_encode(['message' => 'Food not found.']);
            }
            break;
        }

        //handle search by search term (/foods?searchTerm=pizza or /food?tag=Lunch)
        $hasSearchTerm = isset($_GET['searchTerm']) && !empty($_GET['searchTerm']);
        $hasTag = isset($_GET['tag']) && !empty($_GET['tag']);

        if ($hasSearchTerm || $hasTag) {
            //for building the query at the end
            $conditions = [];
            $join = "";

            if ($hasSearchTerm) {
                $conditions[] = "f.name LIKE ?";
                $params[] = '%' . $_GET['searchTerm'] . '%';
            }
            if ($hasTag) {
                $join = " JOIN food_tags ft ON f.id = ft.food_id";
                $conditions[] = "ft.tag_name = ?";
                $params[] = $_GET['tag'];
            }

            $query .= $join;
            if (!empty($conditions)) {
                $query .= " WHERE " . implode(' AND ', $conditions);
            }
        }

        $stmt = $pdo->prepare($query);
        $stmt->execute($params);
        $result = $stmt->fetchAll();

        //attach tags to each food item
        foreach ($result as $food) {
            $food['tags'] = getFoodTags($food['id'], $pdo);
            $foods[] = $food;
        }

        echo json_encode($foods);
        break;

    default:
        http_response_code(405);
        echo json_encode(['message' => 'Method not allowed.']);
        break;
}

?>