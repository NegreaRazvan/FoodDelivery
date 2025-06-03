<?php


function getFoodTags($food_id, $pdo)
{
    $stmt = $pdo->prepare("SELECT tag_name FROM food_tags WHERE food_id = ?");
    $stmt->execute([$food_id]);
    return $stmt->fetchAll(PDO::FETCH_COLUMN);
}


function handleFoodApiRequest($method, $api_path, $pdo, $user_id = null)
{
    switch ($method) {
        case 'GET':
            $foods = [];
            $query = " SELECT DISTINCT f.*, CASE WHEN uf.user_id IS NOT NULL AND uf.user_id = ? THEN TRUE ELSE FALSE END AS is_favorite
                      FROM foods f
                      LEFT JOIN users_favorites uf ON f.id = uf.food_id";
            $params[] = $user_id;

            // Handle search by ID (e.g., /foods/123)
            if (isset($api_path[0]) && is_numeric($api_path[0])) {
                $food_id = (int) $api_path[0];
                $query .= " WHERE f.id = ?";
                $params[] = $food_id;
                $stmt = $pdo->prepare($query);
                $stmt->execute($params);
                $food = $stmt->fetch(PDO::FETCH_ASSOC);

                if ($food) {
                    $food['tags'] = getFoodTags($food['id'], $pdo);
                    $food['is_favorite'] = (bool) $food['is_favorite'];
                    echo json_encode($food);
                } else {
                    http_response_code(404);
                    echo json_encode(['message' => 'Food not found.']);
                }
                break;
            }

            // Handle search by query parameters (e.g., /foods?searchTerm=pizza or /foods?tag=Lunch)
            $hasSearchTerm = isset($_GET['searchTerm']) && !empty($_GET['searchTerm']);
            $hasTag = isset($_GET['tag']) && !empty($_GET['tag']);

            if ($hasSearchTerm || $hasTag) {
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
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

            foreach ($result as $food) {
                $food['tags'] = getFoodTags($food['id'], $pdo);
                $food['is_favorite'] = (bool) $food['is_favorite'];
                $foods[] = $food;
            }

            echo json_encode($foods);
            break;


        default:
            http_response_code(405);
            echo json_encode(['message' => 'Method not allowed.']);
            break;
    }
}

?>