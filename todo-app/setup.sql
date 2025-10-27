-- ToDoアプリケーション用データベースセットアップスクリプト

-- データベースの作成
CREATE DATABASE IF NOT EXISTS todo_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- データベースの使用
USE todo_app;

-- todosテーブルの作成
CREATE TABLE IF NOT EXISTS todos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status ENUM('pending', 'completed') DEFAULT 'pending',
    reminder_date DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- インデックスの作成（パフォーマンス向上）
CREATE INDEX idx_status ON todos(status);
CREATE INDEX idx_reminder_date ON todos(reminder_date);
CREATE INDEX idx_created_at ON todos(created_at);

-- サンプルデータの挿入（開発用）
INSERT INTO todos (title, description, status, reminder_date) VALUES
('サンプルToDo 1', 'これはサンプルのToDoです。', 'pending', NULL),
('サンプルToDo 2', '完了済みのサンプルToDoです。', 'completed', NULL),
('リマインド付きToDo', 'リマインド機能のテスト用ToDoです。', 'pending', DATE_ADD(NOW(), INTERVAL 1 HOUR));

-- テーブル構造の確認
DESCRIBE todos;

-- データの確認
SELECT * FROM todos;
