<?php
/**
 * データベース接続設定ファイル（サンプル）
 * このファイルをコピーして database.php として使用してください
 */

// データベース接続情報
define('DB_HOST', 'localhost');
define('DB_PORT', '3306'); // MySQLのデフォルトポート
define('DB_NAME', 'todo_app');
define('DB_USER', 'root');
define('DB_PASS', 'your_password_here'); // 実際のパスワードに変更してください

// PDO接続オプション
$pdo_options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, // エラー時に例外を投げる
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC, // 連想配列で取得
    PDO::ATTR_EMULATE_PREPARES => false, // プリペアドステートメントを有効化
];

try {
    // データベースに接続
    $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=utf8mb4";
    $pdo = new PDO($dsn, DB_USER, DB_PASS, $pdo_options);
    
    
} catch (PDOException $e) {
    die("データベース接続エラー: " . $e->getMessage());
}
?>
