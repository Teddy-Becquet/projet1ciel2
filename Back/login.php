
<?php
session_start();
require_once "../database/config.php"; // Connexion à la BDD

// Vérifie si c'est une requête POST JSON
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data["email"]) || !isset($data["password"])) {
    echo json_encode(["success" => false, "message" => "Données invalides."]);
    exit();
}

$email = trim($data["email"]);
$password = trim($data["password"]);

// Vérifie si l'email existe en BDD
$stmt = $pdo->prepare("SELECT id, username, password FROM users WHERE email = :email");
$stmt->execute(["email" => $email]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if ($user && password_verify($password, $user["password"])) {
    $_SESSION["user_id"] = $user["id"];
    $_SESSION["username"] = $user["username"];
    
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => "Email ou mot de passe incorrect."]);
}
