<?php

require_once __DIR__ . '/vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

define('JWT_SECRET_KEY', $_ENV['JWT_SECRET_KEY']);
define('ACCESS_TOKEN_EXPIRATION_SECONDS', (int) $_ENV['ACCESS_TOKEN_EXPIRATION_SECONDS']);
define('REFRESH_TOKEN_EXPIRATION_SECONDS', (int) $_ENV['REFRESH_TOKEN_EXPIRATION_SECONDS']);

$host = 'localhost';
$db = 'online_restaurant_db';
$user = 'root';
$pass = '';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    error_log($e->getMessage());
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed"]);
    exit();
}

?>