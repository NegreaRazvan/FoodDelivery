<?php


function handleAddOrder($pdo)
{

    $input = json_decode(file_get_contents('php://input'), true);
    $total_price = trim((int) $input['total_price'] ?? '');
    $name = trim($input['customer_name'] ?? '');
    $email = trim($input['customer_email'] ?? '');
    $address = trim($input['customer_address'] ?? '');



    $stmt = $pdo->prepare("INSERT INTO orders (total_price, customer_name, customer_email, customer_address) VALUES (?, ?, ?, ?)");
    $stmt->execute([$total_price, $name, $email, $address]);

    $stmt = $pdo->prepare("SELECT * FROM orders WHERE id = LAST_INSERT_ID()");
    $stmt->execute();
    $order = $stmt->fetch(\PDO::FETCH_ASSOC);

    http_response_code(200); // OK
    echo json_encode([
        "message" => "Insert successful!",
        "user" => [
            "username" => $name,
            "email" => $email,
            "address" => $address,
        ],
        "order" => [
            "id" => $order['id'],
            "totalPrice" => $order['total_price'],
            "name" => $order['customer_name'],
            "email" => $order['customer_email'],
            "address" => $order['customer_address'],
            "createdAt" => $order['created_at'],
            "updatedAt" => $order['updated_at'],
            "status" => $order['status'],
        ],
    ]);
    exit();

}

function handleGetAllOrders($pdo)
{
    $stmt = $pdo->query("SELECT * FROM orders");
    $orders = $stmt->fetchAll(\PDO::FETCH_ASSOC);

    if (!$orders) {
        http_response_code(404);
        echo json_encode(["error" => "No orders found."]);
        exit();
    }

    http_response_code(200);
    echo json_encode($orders);
    exit();
}


// function handleUpdateOrder($method, $pdo)
// {
//     if ($method !== 'PUT') {
//         http_response_code(405);
//         echo json_encode(["error" => "Requires PUT method."]);
//         exit();
//     }


//     $input = json_decode(file_get_contents('php://input'), true);
//     $total_price = trim((int) $input['total_price'] ?? '');
//     $name = trim($input['customer_name'] ?? '');
//     $email = trim($input['customer_email'] ?? '');
//     $address = trim($input['customer_address'] ?? '');



//     $stmt = $pdo->prepare("INSERT INTO orders (total_price, customer_name, customer_email, customer_address) VALUES (?, ?, ?, ?)");
//     $stmt->execute([$total_price, $name, $email, $address]);

//     http_response_code(200); // OK
//     echo json_encode([
//         "message" => "Insert successful!",
//         "user" => [
//             "username" => $name,
//             "email" => $email,
//             "address" => $address,
//         ],
//     ]);
//     exit();

// }

?>