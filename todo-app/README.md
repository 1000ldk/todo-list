# ToDoアプリケーション

PHPとMySQLを使用したWebベースのToDo管理アプリケーションです。

## 機能

### 基本機能
- ✅ **ToDoの追加** - タイトルと詳細説明を入力してToDoを作成
- ✅ **ToDoの一覧表示** - 登録されたToDoを時系列で表示
- ✅ **ToDoの編集** - 既存のToDoの内容を更新
- ✅ **ToDoの削除** - 不要なToDoを削除
- ✅ **ステータス管理** - 完了/未完了の切り替え

### 高度な機能
- 🔔 **プッシュ通知** - ブラウザ通知APIを使用したリマインド通知
- ⏰ **リマインド機能** - 相対時間（何時間何分後）と絶対時間（日時指定）の両方に対応
- 📱 **レスポンシブデザイン** - iPhoneやタブレットでも快適に使用可能
- ✏️ **インライン編集** - タイトルをクリックして直接編集
- 🇯🇵 **日本標準時対応** - JSTでの時間設定

## 技術仕様

### 使用技術
- **PHP 8.x** - サーバーサイド処理
- **MySQL** - データベース
- **PDO** - データベース接続（SQLインジェクション対策済み）
- **HTML5/CSS3** - フロントエンド
- **JavaScript (ES6+)** - インタラクティブ機能
- **レスポンシブデザイン** - モバイル対応

### データベース構造
```sql
CREATE TABLE todos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status ENUM('pending', 'completed') DEFAULT 'pending',
    reminder_date DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## セットアップ

### 必要な環境
- PHP 8.0以上
- MySQL 5.7以上
- Webサーバー（Apache/Nginx）

### インストール手順

1. **リポジトリのクローン**
```bash
git clone https://github.com/[ユーザー名]/todo-list.git
cd todo-list
```

2. **データベースの作成**
```sql
CREATE DATABASE todo_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

3. **テーブルの作成**
```sql
CREATE TABLE todos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status ENUM('pending', 'completed') DEFAULT 'pending',
    reminder_date DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

4. **設定ファイルの編集**
`config/database.php`でデータベース接続情報を設定

5. **Webサーバーでアクセス**
`http://localhost/todo-list/to doリスト/todo.php`

## 使用方法

### 基本的な使い方
1. **ToDoの追加**: フォームにタイトルと詳細を入力して「ToDoを追加」をクリック
2. **ToDoの編集**: タイトルをクリックして直接編集、または「編集」ボタンで詳細編集
3. **ステータス変更**: 「完了にする」/「未完了にする」ボタンで切り替え
4. **ToDoの削除**: 「削除」ボタンで削除（確認ダイアログあり）

### リマインド機能
- **相対時間**: 「相対時間（何時間何分後）」を選択して時間と分を設定
- **絶対時間**: 「絶対時間（日時指定）」を選択して具体的な日時を設定
- **通知**: リマインド時間になるとブラウザ通知が表示される

### モバイル対応
- iPhoneやAndroidでアクセス可能
- タッチ操作に最適化されたUI
- レスポンシブデザインで画面サイズに自動対応

## セキュリティ機能

- **SQLインジェクション対策**: プリペアドステートメント使用
- **XSS対策**: htmlspecialchars()でエスケープ処理
- **入力値検証**: 必須項目のチェック
- **CSRF対策**: フォーム送信時の検証

## ライセンス

MIT License

## 貢献

プルリクエストやイシューの報告を歓迎します。

## 更新履歴

### v1.0.0 (2025-01-15)
- 基本的なCRUD操作の実装
- レスポンシブデザインの追加
- リマインド機能の実装
- プッシュ通知機能の追加
- インライン編集機能の実装
- 日本標準時対応
