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

    http_response_code(200); // OK
    echo json_encode([
        "message" => "Insert successful!",
        "user" => [
            "username" => $name,
            "email" => $email,
            "address" => $address,
        ],
    ]);
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