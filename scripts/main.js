// DOM要素の取得
const themeToggle = document.getElementById('theme-toggle');
const learnMoreButton = document.getElementById('learn-more');
const skillCards = document.querySelectorAll('.skill-card');
const contactForm = document.getElementById('contact-form');
const loading = document.getElementById('loading');

// テーマ切り替え機能
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    
    // ローカルストレージに保存
    localStorage.setItem('theme', newTheme);
}

// ページ読み込み時にテーマを復元
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
}

// スキルカードの詳細表示機能
function showSkillDetails(skill) {
    const details = {
        html: 'HTMLはWebページの構造を作るマークアップ言語です。セマンティックなタグを使って、コンテンツの意味を明確にします。',
        css: 'CSSはWebページの見た目を制御するスタイルシート言語です。レイアウト、色、フォントなどを自由にカスタマイズできます。',
        javascript: 'JavaScriptはWebページに動的な機能を追加するプログラミング言語です。ユーザーの操作に反応したり、データを処理したりできます。'
    };
    
    alert(details[skill] || '詳細情報は準備中です。');
}

// フォームバリデーション
function validateForm(formData) {
    const errors = {};
    
    // 名前のバリデーション
    if (!formData.name.trim()) {
        errors.name = 'お名前を入力してください。';
    } else if (formData.name.trim().length < 2) {
        errors.name = 'お名前は2文字以上で入力してください。';
    }
    
    // メールアドレスのバリデーション
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
        errors.email = 'メールアドレスを入力してください。';
    } else if (!emailRegex.test(formData.email)) {
        errors.email = '正しいメールアドレスを入力してください。';
    }
    
    // メッセージのバリデーション
    if (!formData.message.trim()) {
        errors.message = 'メッセージを入力してください。';
    } else if (formData.message.trim().length < 10) {
        errors.message = 'メッセージは10文字以上で入力してください。';
    }
    
    return errors;
}

// エラーメッセージの表示
function displayErrors(errors) {
    // 既存のエラーメッセージをクリア
    document.querySelectorAll('.error-message').forEach(error => {
        error.textContent = '';
    });
    
    // 新しいエラーメッセージを表示
    Object.keys(errors).forEach(field => {
        const errorElement = document.getElementById(`${field}-error`);
        if (errorElement) {
            errorElement.textContent = errors[field];
        }
    });
}

// フォーム送信処理
function handleFormSubmit(event) {
    event.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
    };
    
    const errors = validateForm(formData);
    
    if (Object.keys(errors).length === 0) {
        // バリデーション成功
        alert('お問い合わせありがとうございます！\n（実際の送信機能は実装されていません）');
        contactForm.reset();
        displayErrors({}); // エラーメッセージをクリア
    } else {
        // バリデーション失敗
        displayErrors(errors);
    }
}

// アニメーション効果
function addScrollAnimation() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });
    
    // アニメーション対象の要素にスタイルを適用
    const animatedElements = document.querySelectorAll('.skill-card, .contact');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// イベントリスナーの設定
function setupEventListeners() {
    // テーマ切り替え
    themeToggle.addEventListener('click', toggleTheme);
    
    // もっと詳しくボタン
    learnMoreButton.addEventListener('click', () => {
        alert('このサイトはHTML、CSS、JavaScriptで作られています！\n\n' +
              '• HTML: ページの構造\n' +
              '• CSS: デザインとレイアウト\n' +
              '• JavaScript: インタラクティブな機能');
    });
    
    // スキルカード
    skillCards.forEach(card => {
        card.addEventListener('click', () => {
            const skill = card.getAttribute('data-skill');
            showSkillDetails(skill);
        });
    });
    
    // フォーム送信
    contactForm.addEventListener('submit', handleFormSubmit);
}

// ローディング画面の制御
function hideLoading() {
    setTimeout(() => {
        if (loading) {
            loading.classList.add('hidden');
            // アニメーション完了後に要素を削除
            setTimeout(() => {
                loading.remove();
            }, 500);
        }
    }, 1000); // 1秒間ローディング表示
}

// アクセシビリティの改善
function improveAccessibility() {
    // フォーカス管理
    const focusableElements = document.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    // キーボードナビゲーション
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
    });
    
    // スキップリンクの追加
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.textContent = 'メインコンテンツにスキップ';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--primary-color);
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 1000;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
}

// パフォーマンス監視
function monitorPerformance() {
    // ページ読み込み時間の測定
    window.addEventListener('load', () => {
        const loadTime = performance.now();
        console.log(`ページ読み込み時間: ${Math.round(loadTime)}ms`);
        
        // 遅い読み込みの警告
        if (loadTime > 3000) {
            console.warn('ページの読み込みが遅いです。画像の最適化を検討してください。');
        }
    });
}

// ページ読み込み時の初期化
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    setupEventListeners();
    addScrollAnimation();
    improveAccessibility();
    monitorPerformance();
    hideLoading();
    
    console.log('ポートフォリオサイトが読み込まれました！');
    console.log('開発者ツールを開いて、このコンソールメッセージを確認してください。');
});

// キーボードショートカット
document.addEventListener('keydown', (event) => {
    // Ctrl/Cmd + K でテーマ切り替え
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        toggleTheme();
    }
    
    // Escape でフォーカスをクリア
    if (event.key === 'Escape') {
        document.activeElement.blur();
    }
});
