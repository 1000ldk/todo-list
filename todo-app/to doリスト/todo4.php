<?php
/**
 * ToDoアプリケーション - メインファイル
 * 基本的なCRUD操作（Create, Read, Update, Delete）を実装
 */

// データベース接続設定を読み込み
require_once '../config/database.php';

// エラーメッセージ用の変数
$error_message = '';
$success_message = '';

// POSTリクエストの処理
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';
    
    switch ($action) {
        case 'create':
            // ToDoの作成
            $title = trim($_POST['title'] ?? '');
            $description = trim($_POST['description'] ?? '');
            
            if (!empty($title)) {
                try {
                    $stmt = $pdo->prepare("INSERT INTO todos (title, description) VALUES (?, ?)");
                    $stmt->execute([$title, $description]);
                    $success_message = "ToDoが正常に追加されました！";
                } catch (PDOException $e) {
                    $error_message = "エラーが発生しました: " . $e->getMessage();
                }
            } else {
                $error_message = "タイトルは必須です。";
            }
            break;
            
        case 'update':
            // ToDoの更新
            $id = $_POST['id'] ?? '';
            $title = trim($_POST['title'] ?? '');
            $description = trim($_POST['description'] ?? '');
            
            if (!empty($id) && !empty($title)) {
                try {
                    $stmt = $pdo->prepare("UPDATE todos SET title = ?, description = ? WHERE id = ?");
                    $stmt->execute([$title, $description, $id]);
                    $success_message = "ToDoが正常に更新されました！";
                } catch (PDOException $e) {
                    $error_message = "エラーが発生しました: " . $e->getMessage();
                }
            } else {
                $error_message = "IDとタイトルは必須です。";
            }
            break;
            
        case 'delete':
            // ToDoの削除
            $id = $_POST['id'] ?? '';
            
            if (!empty($id)) {
                try {
                    $stmt = $pdo->prepare("DELETE FROM todos WHERE id = ?");
                    $stmt->execute([$id]);
                    $success_message = "ToDoが正常に削除されました！";
                } catch (PDOException $e) {
                    $error_message = "エラーが発生しました: " . $e->getMessage();
                }
            } else {
                $error_message = "IDが指定されていません。";
            }
            break;
            
        case 'toggle_status':
            // ステータスの切り替え
            $id = $_POST['id'] ?? '';
            
            if (!empty($id)) {
                try {
                    // 現在のステータスを取得
                    $stmt = $pdo->prepare("SELECT status FROM todos WHERE id = ?");
                    $stmt->execute([$id]);
                    $current_status = $stmt->fetchColumn();
                    
                    // ステータスを切り替え
                    $new_status = ($current_status === 'pending') ? 'completed' : 'pending';
                    
                    $stmt = $pdo->prepare("UPDATE todos SET status = ? WHERE id = ?");
                    $stmt->execute([$new_status, $id]);
                    $success_message = "ステータスが更新されました！";
                } catch (PDOException $e) {
                    $error_message = "エラーが発生しました: " . $e->getMessage();
                }
            }
            break;
    }
}

// ToDo一覧を取得
try {
    $stmt = $pdo->query("SELECT * FROM todos ORDER BY created_at DESC");
    $todos = $stmt->fetchAll();
} catch (PDOException $e) {
    $error_message = "ToDoの取得でエラーが発生しました: " . $e->getMessage();
    $todos = [];
}
?>

<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <title>ToDoアプリケーション</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        
        .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        h1 {
            color: #333;
            text-align: center;
            margin-bottom: 30px;
        }
        
        .message {
            padding: 10px;
            margin: 10px 0;
            border-radius: 5px;
        }
        
        .error {
            background-color: #ffebee;
            color: #c62828;
            border: 1px solid #ffcdd2;
        }
        
        .success {
            background-color: #e8f5e8;
            color: #2e7d32;
            border: 1px solid #c8e6c9;
        }
        
        .form-group {
            margin-bottom: 15px;
        }
        
        label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
            color: #555;
        }
        
        input, textarea {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 14px;
            box-sizing: border-box;
        }
        
        textarea {
            height: 80px;
            resize: vertical;
        }
        
        .btn {
            background-color: #4CAF50;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            margin-right: 10px;
        }
        
        .btn:hover {
            background-color: #45a049;
        }
        
        .btn-danger {
            background-color: #f44336;
        }
        
        .btn-danger:hover {
            background-color: #da190b;
        }
        
        .btn-warning {
            background-color: #ff9800;
        }
        
        .btn-warning:hover {
            background-color: #e68900;
        }
        
        .todo-list {
            margin-top: 30px;
        }
        
        .todo-item {
            background: #f9f9f9;
            padding: 15px;
            margin: 10px 0;
            border-radius: 5px;
            border-left: 4px solid #4CAF50;
        }
        
        .todo-item.completed {
            border-left-color: #9e9e9e;
            opacity: 0.7;
        }
        
        .todo-item.completed .todo-title {
            text-decoration: line-through;
        }
        
        .todo-title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 5px;
            color: #333;
        }
        
        .todo-description {
            color: #666;
            margin-bottom: 10px;
        }
        
        .todo-meta {
            font-size: 12px;
            color: #999;
            margin-bottom: 10px;
        }
        
        .todo-actions {
            margin-top: 10px;
        }
        
        .todo-actions .btn {
            margin-right: 5px;
            padding: 5px 10px;
            font-size: 12px;
        }
        
        .status-pending {
            color: #ff9800;
            font-weight: bold;
        }
        
        .status-completed {
            color: #4CAF50;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>📝 ToDoアプリケーション</h1>
        
        <!-- メッセージ表示 -->
        <?php if ($error_message): ?>
            <div class="message error"><?php echo htmlspecialchars($error_message); ?></div>
        <?php endif; ?>
        
        <?php if ($success_message): ?>
            <div class="message success"><?php echo htmlspecialchars($success_message); ?></div>
        <?php endif; ?>
        
        <!-- ToDo追加フォーム -->
        <h2>新しいToDoを追加</h2>
        <form method="POST">
            <input type="hidden" name="action" value="create">
            
            <div class="form-group">
                <label for="title">タイトル *</label>
                <input type="text" id="title" name="title" required placeholder="ToDoのタイトルを入力してください">
            </div>
            
            <div class="form-group">
                <label for="description">詳細説明</label>
                <textarea id="description" name="description" placeholder="詳細説明を入力してください（任意）"></textarea>
            </div>
            
            <button type="submit" class="btn">ToDoを追加</button>
        </form>
        
        <!-- ToDo一覧 -->
        <div class="todo-list">
            <h2>ToDo一覧</h2>
            
            <?php if (empty($todos)): ?>
                <p>まだToDoがありません。上記のフォームから追加してください。</p>
            <?php else: ?>
                <?php foreach ($todos as $todo): ?>
                    <div class="todo-item <?php echo $todo['status'] === 'completed' ? 'completed' : ''; ?>">
                        <div class="todo-title"><?php echo htmlspecialchars($todo['title']); ?></div>
                        
                        <?php if (!empty($todo['description'])): ?>
                            <div class="todo-description"><?php echo htmlspecialchars($todo['description']); ?></div>
                        <?php endif; ?>
                        
                        <div class="todo-meta">
                            作成日: <?php echo date('Y年m月d日 H:i', strtotime($todo['created_at'])); ?>
                            | ステータス: <span class="status-<?php echo $todo['status']; ?>">
                                <?php echo $todo['status'] === 'pending' ? '未完了' : '完了'; ?>
                            </span>
                        </div>
                        
                        <div class="todo-actions">
                            <!-- ステータス切り替え -->
                            <form method="POST" style="display: inline;">
                                <input type="hidden" name="action" value="toggle_status">
                                <input type="hidden" name="id" value="<?php echo $todo['id']; ?>">
                                <button type="submit" class="btn btn-warning">
                                    <?php echo $todo['status'] === 'pending' ? '完了にする' : '未完了にする'; ?>
                                </button>
                            </form>
                            
                            <!-- 編集フォーム（簡易版） -->
                            <button onclick="editTodo(<?php echo htmlspecialchars(json_encode($todo)); ?>)" class="btn">編集</button>
                            
                            <!-- 削除 -->
                            <form method="POST" style="display: inline;" onsubmit="return confirm('本当に削除しますか？')">
                                <input type="hidden" name="action" value="delete">
                                <input type="hidden" name="id" value="<?php echo $todo['id']; ?>">
                                <button type="submit" class="btn btn-danger">削除</button>
                            </form>
                        </div>
                    </div>
                <?php endforeach; ?>
            <?php endif; ?>
        </div>
    </div>
    
    <script>
        // 編集機能（簡易版）
        function editTodo(todo) {
            const newTitle = prompt('新しいタイトルを入力してください:', todo.title);
            if (newTitle && newTitle !== todo.title) {
                const newDescription = prompt('新しい詳細説明を入力してください:', todo.description || '');
                
                // フォームを作成して送信
                const form = document.createElement('form');
                form.method = 'POST';
                form.innerHTML = `
                    <input type="hidden" name="action" value="update">
                    <input type="hidden" name="id" value="${todo.id}">
                    <input type="hidden" name="title" value="${newTitle}">
                    <input type="hidden" name="description" value="${newDescription}">
                `;
                document.body.appendChild(form);
                form.submit();
            }
        }
    </script>
</body>
</html>

