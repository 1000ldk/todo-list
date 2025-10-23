<?php
/**
 * ToDoアプリケーション - メインファイル
 * 基本的なCRUD操作（Create, Read, Update, Delete）を実装
 */

// データベース接続設定を読み込み
require_once '../config/database.php';

// セッション開始
session_start();

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
            $reminder_date = $_POST['calculated_reminder_date'] ?? null;
            
            if (!empty($title)) {
                try {
                    $stmt = $pdo->prepare("INSERT INTO todos (title, description, reminder_date) VALUES (?, ?, ?)");
                    $stmt->execute([$title, $description, $reminder_date ?: null]);
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
            $reminder_date = $_POST['calculated_reminder_date'] ?? null;
            
            if (!empty($id) && !empty($title)) {
                try {
                    $stmt = $pdo->prepare("UPDATE todos SET title = ?, description = ?, reminder_date = ? WHERE id = ?");
                    $stmt->execute([$title, $description, $reminder_date ?: null, $id]);
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
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ToDoアプリケーション</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        
        /* モバイル対応のメディアクエリ */
        @media (max-width: 768px) {
            body {
                padding: 10px;
                font-size: 14px;
            }
            
            .container {
                padding: 15px;
                margin: 0;
                border-radius: 5px;
            }
            
            h1 {
                font-size: 24px;
                margin-bottom: 20px;
            }
            
            h2 {
                font-size: 18px;
                margin-bottom: 15px;
            }
            
            .todo-item {
                padding: 12px;
                margin: 8px 0;
            }
            
            .todo-title {
                font-size: 16px;
            }
            
            .todo-actions {
                margin-top: 8px;
            }
            
            .todo-actions .btn {
                padding: 8px 12px;
                font-size: 11px;
                margin-right: 3px;
                margin-bottom: 5px;
            }
            
            input, textarea {
                font-size: 16px; /* iOSでズームを防ぐ */
            }
            
            .btn {
                padding: 12px 20px;
                font-size: 16px;
                min-height: 44px; /* タッチしやすいサイズ */
            }
        }
        
        /* 超小画面対応（iPhone SE等） */
        @media (max-width: 480px) {
            body {
                padding: 5px;
            }
            
            .container {
                padding: 10px;
            }
            
            h1 {
                font-size: 20px;
            }
            
            .todo-actions .btn {
                width: 100%;
                margin-right: 0;
                margin-bottom: 5px;
            }
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
            
            <div class="form-group">
                <label for="reminder_type">リマインド設定（任意）</label>
                <select id="reminder_type" name="reminder_type" onchange="toggleReminderInput()">
                    <option value="">リマインドなし</option>
                    <option value="relative">相対時間（何時間何分後）</option>
                    <option value="absolute">絶対時間（日時指定）</option>
                </select>
            </div>
            
            <div class="form-group" id="relative_reminder" style="display: none;">
                <label>何時間何分後にリマインド</label>
                <div style="display: flex; gap: 10px; align-items: center;">
                    <input type="number" id="reminder_hours" name="reminder_hours" min="0" max="168" value="1" style="width: 80px;">
                    <span>時間</span>
                    <input type="number" id="reminder_minutes" name="reminder_minutes" min="0" max="59" value="0" style="width: 80px;">
                    <span>分後</span>
                </div>
            </div>
            
            <div class="form-group" id="absolute_reminder" style="display: none;">
                <label for="reminder_date">リマインド日時</label>
                <input type="datetime-local" id="reminder_date" name="reminder_date">
            </div>
            
            <input type="hidden" id="calculated_reminder_date" name="calculated_reminder_date">
            
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
                        <div class="todo-title" id="title-<?php echo $todo['id']; ?>" onclick="editTitle(<?php echo $todo['id']; ?>)">
                            <?php echo htmlspecialchars($todo['title']); ?>
                        </div>
                        
                        <?php if (!empty($todo['description'])): ?>
                            <div class="todo-description"><?php echo htmlspecialchars($todo['description']); ?></div>
                        <?php endif; ?>
                        
                        <div class="todo-meta">
                            作成日: <?php echo date('Y年m月d日 H:i', strtotime($todo['created_at'])); ?>
                            | ステータス: <span class="status-<?php echo $todo['status']; ?>">
                                <?php echo $todo['status'] === 'pending' ? '未完了' : '完了'; ?>
                            </span>
                            <?php if (!empty($todo['reminder_date'])): ?>
                                | リマインド: <?php echo date('Y年m月d日 H:i', strtotime($todo['reminder_date'])); ?>
                            <?php endif; ?>
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
        // インライン編集機能
        function editTitle(todoId) {
            const titleElement = document.getElementById('title-' + todoId);
            const currentTitle = titleElement.textContent.trim();
            
            // 入力フィールドを作成
            const input = document.createElement('input');
            input.type = 'text';
            input.value = currentTitle;
            input.style.width = '100%';
            input.style.padding = '5px';
            input.style.border = '2px solid #4CAF50';
            input.style.borderRadius = '3px';
            
            // 元のテキストを入力フィールドに置き換え
            titleElement.innerHTML = '';
            titleElement.appendChild(input);
            input.focus();
            input.select();
            
            // 保存処理
            function saveTitle() {
                const newTitle = input.value.trim();
                if (newTitle && newTitle !== currentTitle) {
                    // フォームを作成して送信
                    const form = document.createElement('form');
                    form.method = 'POST';
                    form.innerHTML = `
                        <input type="hidden" name="action" value="update">
                        <input type="hidden" name="id" value="${todoId}">
                        <input type="hidden" name="title" value="${newTitle}">
                        <input type="hidden" name="description" value="">
                        <input type="hidden" name="reminder_date" value="">
                    `;
                    document.body.appendChild(form);
                    form.submit();
                } else {
                    // 変更がない場合は元に戻す
                    titleElement.textContent = currentTitle;
                }
            }
            
            // キャンセル処理
            function cancelEdit() {
                titleElement.textContent = currentTitle;
            }
            
            // イベントリスナーを追加
            input.addEventListener('blur', saveTitle);
            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    saveTitle();
                } else if (e.key === 'Escape') {
                    cancelEdit();
                }
            });
        }
        
        // 編集機能（詳細編集版）
        function editTodo(todo) {
            const newTitle = prompt('新しいタイトルを入力してください:', todo.title);
            if (newTitle && newTitle !== todo.title) {
                const newDescription = prompt('新しい詳細説明を入力してください:', todo.description || '');
                const newReminderDate = prompt('リマインド日時を入力してください（YYYY-MM-DDTHH:MM形式、空欄で削除）:', todo.reminder_date || '');
                
                // フォームを作成して送信
                const form = document.createElement('form');
                form.method = 'POST';
                form.innerHTML = `
                    <input type="hidden" name="action" value="update">
                    <input type="hidden" name="id" value="${todo.id}">
                    <input type="hidden" name="title" value="${newTitle}">
                    <input type="hidden" name="description" value="${newDescription}">
                    <input type="hidden" name="reminder_date" value="${newReminderDate}">
                `;
                document.body.appendChild(form);
                form.submit();
            }
        }
        
        // プッシュ通知の許可を要求
        function requestNotificationPermission() {
            if ('Notification' in window) {
                if (Notification.permission === 'default') {
                    Notification.requestPermission().then(function(permission) {
                        if (permission === 'granted') {
                            console.log('通知許可が得られました');
                        }
                    });
                }
            }
        }
        
        // プッシュ通知を送信
        function sendNotification(title, body) {
            if ('Notification' in window && Notification.permission === 'granted') {
                const notification = new Notification(title, {
                    body: body,
                    icon: '/favicon.ico',
                    badge: '/favicon.ico',
                    tag: 'todo-reminder'
                });
                
                // 5秒後に自動的に閉じる
                setTimeout(() => {
                    notification.close();
                }, 5000);
            }
        }
        
        // リマインド通知機能（改良版）
        function checkReminders() {
            const now = new Date();
            const reminderElements = document.querySelectorAll('[data-reminder]');
            let hasReminder = false;
            
            reminderElements.forEach(element => {
                const reminderDate = new Date(element.dataset.reminder);
                if (reminderDate <= now) {
                    element.style.backgroundColor = '#fff3cd';
                    element.style.borderLeft = '4px solid #ffc107';
                    hasReminder = true;
                }
            });
            
            // リマインドがある場合は通知を送信
            if (hasReminder && Notification.permission === 'granted') {
                sendNotification('ToDoリマインド', 'リマインド時間になったToDoがあります');
            }
        }
        
        // リマインド設定の切り替え
        function toggleReminderInput() {
            const reminderType = document.getElementById('reminder_type').value;
            const relativeDiv = document.getElementById('relative_reminder');
            const absoluteDiv = document.getElementById('absolute_reminder');
            
            relativeDiv.style.display = reminderType === 'relative' ? 'block' : 'none';
            absoluteDiv.style.display = reminderType === 'absolute' ? 'block' : 'none';
        }
        
        // 相対時間から絶対時間を計算（JST対応）
        function calculateReminderDate() {
            const reminderType = document.getElementById('reminder_type').value;
            const calculatedInput = document.getElementById('calculated_reminder_date');
            
            if (reminderType === 'relative') {
                const hours = parseInt(document.getElementById('reminder_hours').value) || 0;
                const minutes = parseInt(document.getElementById('reminder_minutes').value) || 0;
                
                // 現在時刻（JST）に時間と分を追加
                const now = new Date();
                const reminderTime = new Date(now.getTime() + (hours * 60 + minutes) * 60 * 1000);
                
                // JST形式で設定
                const jstDate = new Date(reminderTime.getTime() + (9 * 60 * 60 * 1000)); // UTC+9
                calculatedInput.value = jstDate.toISOString().slice(0, 16);
            } else if (reminderType === 'absolute') {
                calculatedInput.value = document.getElementById('reminder_date').value;
            } else {
                calculatedInput.value = '';
            }
        }
        
        // フォーム送信時にリマインド日時を計算
        document.addEventListener('DOMContentLoaded', function() {
            requestNotificationPermission();
            checkReminders();
            
            // 30秒ごとにリマインドをチェック
            setInterval(checkReminders, 30000);
            
            // フォーム送信時にリマインド日時を計算
            const form = document.querySelector('form');
            if (form) {
                form.addEventListener('submit', function() {
                    calculateReminderDate();
                });
            }
            
            // 相対時間入力時にリアルタイム計算
            const hoursInput = document.getElementById('reminder_hours');
            const minutesInput = document.getElementById('reminder_minutes');
            if (hoursInput && minutesInput) {
                hoursInput.addEventListener('change', calculateReminderDate);
                minutesInput.addEventListener('change', calculateReminderDate);
            }
        });
    </script>
</body>
</html>

