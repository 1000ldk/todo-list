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

// 高度なスクロールアニメーション
function addAdvancedScrollAnimation() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // 要素の種類に応じて異なるアニメーションを適用
                if (entry.target.classList.contains('skill-card')) {
                    const cards = Array.from(document.querySelectorAll('.skill-card'));
                    const index = cards.indexOf(entry.target);
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0) scale(1)';
                    }, index * 150);
                } else if (entry.target.classList.contains('contact')) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // アニメーション対象の要素にスタイルを適用
    const animatedElements = document.querySelectorAll('.skill-card, .contact');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = el.classList.contains('contact') ? 'translateX(-50px)' : 'translateY(30px) scale(0.9)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(el);
    });
}

// パララックス効果
function addParallaxEffect() {
    const parallaxElements = document.querySelectorAll('.hero');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        parallaxElements.forEach(element => {
            element.style.transform = `translateY(${rate}px)`;
        });
    });
}

// マウスホバーアニメーション
function addHoverAnimations() {
    const skillCards = document.querySelectorAll('.skill-card');
    
    skillCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.05)';
            card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.2)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
            card.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        });
    });
    
    // ボタンのホバーエフェクト
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.05)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
        });
    });
}

// テキストタイピングアニメーション
function addTypingAnimation() {
    const heroTitle = document.querySelector('.hero h2');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        heroTitle.style.borderRight = '2px solid white';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            } else {
                // タイピング完了後、カーソルを点滅
                setInterval(() => {
                    heroTitle.style.borderRight = heroTitle.style.borderRight === '2px solid white' ? '2px solid transparent' : '2px solid white';
                }, 500);
            }
        };
        
        setTimeout(typeWriter, 1000);
    }
}

// 3D回転カードエフェクト
function add3DCardEffect() {
    const skillCards = document.querySelectorAll('.skill-card');
    
    skillCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
    });
}

// 波紋エフェクト
function addRippleEffect() {
    document.addEventListener('click', (e) => {
        const ripple = document.createElement('span');
        const rect = e.target.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;
        
        // 波紋アニメーションのCSSを追加
        if (!document.querySelector('#ripple-styles')) {
            const style = document.createElement('style');
            style.id = 'ripple-styles';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        e.target.style.position = 'relative';
        e.target.style.overflow = 'hidden';
        e.target.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
}

// アニメーション効果（既存の関数を置き換え）
function addScrollAnimation() {
    addAdvancedScrollAnimation();
    addParallaxEffect();
    addHoverAnimations();
    addTypingAnimation();
    add3DCardEffect();
    addRippleEffect();
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

// イージング関数の定義
const easingFunctions = {
    linear: t => t,
    easeInQuad: t => t * t,
    easeOutQuad: t => t * (2 - t),
    easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    easeInCubic: t => t * t * t,
    easeOutCubic: t => (--t) * t * t + 1,
    easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
    easeInSine: t => 1 - Math.cos(t * Math.PI / 2),
    easeOutSine: t => Math.sin(t * Math.PI / 2),
    easeInOutSine: t => -(Math.cos(Math.PI * t) - 1) / 2,
    easeInBack: t => 2.7 * t * t * t - 1.7 * t * t,
    easeOutBack: t => 1 + 2.7 * Math.pow(t - 1, 3) + 1.7 * Math.pow(t - 1, 2),
    easeInOutBack: t => t < 0.5 ? (2 * t) * (2 * t) * (3.4 * t - 2.4) / 2 : (2 * t - 2) * (2 * t - 2) * (3.4 * (2 * t - 2) + 2.4) / 2 + 1,
    easeInElastic: t => t === 0 ? 0 : t === 1 ? 1 : -Math.pow(2, 10 * (t - 1)) * Math.sin((t - 1.1) * 5 * Math.PI),
    easeOutElastic: t => t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t - 0.1) * 5 * Math.PI) + 1,
    easeInOutElastic: t => t === 0 ? 0 : t === 1 ? 1 : t < 0.5 ? -(Math.pow(2, 20 * t - 10) * Math.sin((20 * t - 11.125) * (2 * Math.PI) / 4.5)) / 2 : (Math.pow(2, -20 * t + 10) * Math.sin((20 * t - 11.125) * (2 * Math.PI) / 4.5)) / 2 + 1
};

// 汎用アニメーション関数
function animateElement(element, properties, duration = 1000, easing = 'easeOutQuad', callback = null) {
    const startValues = {};
    const endValues = {};
    const startTime = performance.now();
    
    // 開始値を取得
    Object.keys(properties).forEach(prop => {
        if (prop === 'opacity') {
            startValues[prop] = parseFloat(getComputedStyle(element)[prop]) || 0;
        } else if (prop === 'transform') {
            startValues[prop] = 0; // 簡略化のため
        } else {
            startValues[prop] = parseFloat(getComputedStyle(element)[prop]) || 0;
        }
        endValues[prop] = properties[prop];
    });
    
    const easingFunc = easingFunctions[easing] || easingFunctions.easeOutQuad;
    
    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easingFunc(progress);
        
        Object.keys(properties).forEach(prop => {
            const startValue = startValues[prop];
            const endValue = endValues[prop];
            const currentValue = startValue + (endValue - startValue) * easedProgress;
            
            if (prop === 'opacity') {
                element.style[prop] = currentValue;
            } else if (prop === 'transform') {
                element.style.transform = `translateX(${currentValue}px)`;
            } else {
                element.style[prop] = currentValue + 'px';
            }
        });
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else if (callback) {
            callback();
        }
    }
    
    requestAnimationFrame(animate);
}

// パーティクルエフェクト
function createParticle(x, y, color = '#ff6b6b', size = 4) {
    const particle = document.createElement('div');
    particle.style.position = 'fixed';
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.backgroundColor = color;
    particle.style.borderRadius = '50%';
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '9999';
    
    document.body.appendChild(particle);
    
    // ランダムな方向に移動
    const angle = Math.random() * Math.PI * 2;
    const velocity = 50 + Math.random() * 100;
    const vx = Math.cos(angle) * velocity;
    const vy = Math.sin(angle) * velocity;
    
    const startTime = performance.now();
    const duration = 1000 + Math.random() * 1000;
    
    function animateParticle(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = elapsed / duration;
        
        if (progress < 1) {
            const currentX = x + vx * progress;
            const currentY = y + vy * progress - 0.5 * 9.8 * progress * progress * 100; // 重力効果
            
            particle.style.left = currentX + 'px';
            particle.style.top = currentY + 'px';
            particle.style.opacity = 1 - progress;
            particle.style.transform = `scale(${1 - progress * 0.5})`;
            
            requestAnimationFrame(animateParticle);
        } else {
            particle.remove();
        }
    }
    
    requestAnimationFrame(animateParticle);
}

// クリック時のパーティクルエフェクト
function addClickParticleEffect() {
    document.addEventListener('click', (event) => {
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        // 複数のパーティクルを生成
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                createParticle(event.clientX, event.clientY, color, 3 + Math.random() * 4);
            }, i * 50);
        }
    });
}

// マウス追従エフェクト
function addMouseFollowEffect() {
    const cursor = document.createElement('div');
    cursor.style.position = 'fixed';
    cursor.style.width = '20px';
    cursor.style.height = '20px';
    cursor.style.borderRadius = '50%';
    cursor.style.backgroundColor = 'rgba(37, 99, 235, 0.3)';
    cursor.style.pointerEvents = 'none';
    cursor.style.zIndex = '9999';
    cursor.style.transition = 'transform 0.1s ease';
    cursor.style.display = 'none';
    
    document.body.appendChild(cursor);
    
    document.addEventListener('mousemove', (event) => {
        cursor.style.display = 'block';
        cursor.style.left = event.clientX - 10 + 'px';
        cursor.style.top = event.clientY - 10 + 'px';
    });
    
    document.addEventListener('mouseleave', () => {
        cursor.style.display = 'none';
    });
}

// タイムラインアニメーション
function createTimeline() {
    const timeline = [];
    
    function add(animation, delay = 0) {
        timeline.push({ animation, delay });
        return { add, play };
    }
    
    function play() {
        let totalDelay = 0;
        timeline.forEach(({ animation, delay }) => {
            totalDelay += delay;
            setTimeout(animation, totalDelay);
        });
    }
    
    return { add, play };
}

// アニメーションデモパネル
function createAnimationDemoPanel() {
    const panel = document.createElement('div');
    panel.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(255, 255, 255, 0.95);
        border: 2px solid var(--primary-color);
        border-radius: 10px;
        padding: 20px;
        z-index: 1000;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        max-width: 320px;
        font-family: 'Segoe UI', sans-serif;
        backdrop-filter: blur(10px);
        transition: all 0.3s ease;
    `;
    
    panel.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
            <h3 style="margin: 0; color: var(--primary-color);">アニメーションデモ</h3>
            <button id="toggle-panel" style="background: none; border: none; font-size: 18px; cursor: pointer;">−</button>
        </div>
        <div id="demo-content" style="display: flex; flex-direction: column; gap: 8px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                <button id="demo-bounce" style="padding: 8px 12px; background: var(--primary-color); color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 12px;">バウンス</button>
                <button id="demo-elastic" style="padding: 8px 12px; background: var(--accent-color); color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 12px;">エラスティック</button>
                <button id="demo-timeline" style="padding: 8px 12px; background: #10b981; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 12px;">タイムライン</button>
                <button id="demo-particles" style="padding: 8px 12px; background: #8b5cf6; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 12px;">パーティクル</button>
                <button id="demo-scroll" style="padding: 8px 12px; background: #f59e0b; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 12px;">スクロール</button>
                <button id="demo-typing" style="padding: 8px 12px; background: #ef4444; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 12px;">タイピング</button>
                <button id="demo-3d" style="padding: 8px 12px; background: #06b6d4; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 12px;">3D回転</button>
                <button id="demo-ripple" style="padding: 8px 12px; background: #84cc16; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 12px;">波紋</button>
            </div>
            <div style="margin-top: 10px; padding: 10px; background: rgba(0,0,0,0.05); border-radius: 5px;">
                <p style="font-size: 11px; color: #666; margin: 0 0 5px 0;">💡 ヒント:</p>
                <p style="font-size: 10px; color: #666; margin: 0;">• ページをクリックしてパーティクル</p>
                <p style="font-size: 10px; color: #666; margin: 0;">• カードにマウスを乗せて3D効果</p>
                <p style="font-size: 10px; color: #666; margin: 0;">• スクロールでパララックス効果</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(panel);
    
    // パネルの折りたたみ機能
    let isCollapsed = false;
    document.getElementById('toggle-panel').addEventListener('click', () => {
        const content = document.getElementById('demo-content');
        const toggleBtn = document.getElementById('toggle-panel');
        
        if (isCollapsed) {
            content.style.display = 'flex';
            toggleBtn.textContent = '−';
            panel.style.height = 'auto';
        } else {
            content.style.display = 'none';
            toggleBtn.textContent = '+';
            panel.style.height = '60px';
        }
        isCollapsed = !isCollapsed;
    });
    
    // デモボタンのイベントリスナー
    document.getElementById('demo-bounce').addEventListener('click', () => {
        const hero = document.querySelector('.hero');
        animateElement(hero, { transform: 50 }, 1000, 'easeOutBack', () => {
            animateElement(hero, { transform: 0 }, 500, 'easeOutQuad');
        });
    });
    
    document.getElementById('demo-elastic').addEventListener('click', () => {
        const skillCards = document.querySelectorAll('.skill-card');
        skillCards.forEach((card, index) => {
            setTimeout(() => {
                animateElement(card, { transform: 20 }, 800, 'easeOutElastic', () => {
                    animateElement(card, { transform: 0 }, 400, 'easeOutQuad');
                });
            }, index * 100);
        });
    });
    
    document.getElementById('demo-timeline').addEventListener('click', () => {
        const tl = createTimeline();
        tl.add(() => {
            const hero = document.querySelector('.hero');
            animateElement(hero, { opacity: 0.5 }, 500, 'easeInOutQuad');
        }, 0);
        tl.add(() => {
            const hero = document.querySelector('.hero');
            animateElement(hero, { opacity: 1 }, 500, 'easeInOutQuad');
        }, 500);
        tl.add(() => {
            const skills = document.querySelector('.skills');
            animateElement(skills, { transform: 30 }, 600, 'easeOutBack', () => {
                animateElement(skills, { transform: 0 }, 400, 'easeOutQuad');
            });
        }, 1000);
        tl.play();
    });
    
    document.getElementById('demo-particles').addEventListener('click', () => {
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'];
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const x = Math.random() * window.innerWidth;
                const y = Math.random() * window.innerHeight;
                const color = colors[Math.floor(Math.random() * colors.length)];
                createParticle(x, y, color, 5);
            }, i * 100);
        }
    });
    
    document.getElementById('demo-scroll').addEventListener('click', () => {
        window.scrollTo({
            top: document.querySelector('.skills').offsetTop - 100,
            behavior: 'smooth'
        });
    });
    
    document.getElementById('demo-typing').addEventListener('click', () => {
        const heroTitle = document.querySelector('.hero h2');
        const originalText = heroTitle.textContent;
        heroTitle.textContent = '';
        heroTitle.style.borderRight = '2px solid white';
        
        let i = 0;
        const typeWriter = () => {
            if (i < originalText.length) {
                heroTitle.textContent += originalText.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            } else {
                setTimeout(() => {
                    heroTitle.style.borderRight = 'none';
                }, 1000);
            }
        };
        typeWriter();
    });
    
    document.getElementById('demo-3d').addEventListener('click', () => {
        const skillCards = document.querySelectorAll('.skill-card');
        skillCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.transform = 'perspective(1000px) rotateY(360deg)';
                card.style.transition = 'transform 1s ease';
                setTimeout(() => {
                    card.style.transform = 'perspective(1000px) rotateY(0deg)';
                }, 1000);
            }, index * 200);
        });
    });
    
    document.getElementById('demo-ripple').addEventListener('click', () => {
        // 中央に波紋エフェクトを生成
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const ripple = document.createElement('div');
                ripple.style.cssText = `
                    position: fixed;
                    left: ${centerX - 50}px;
                    top: ${centerY - 50}px;
                    width: 100px;
                    height: 100px;
                    border: 2px solid var(--primary-color);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 1s ease-out;
                    pointer-events: none;
                    z-index: 9999;
                `;
                document.body.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 1000);
            }, i * 200);
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
    
    // 新しいアニメーション機能を追加
    addClickParticleEffect();
    addMouseFollowEffect();
    createAnimationDemoPanel();
    
    console.log('ポートフォリオサイトが読み込まれました！');
    console.log('開発者ツールを開いて、このコンソールメッセージを確認してください。');
    console.log('右上のアニメーションデモパネルで様々なアニメーションを試してみてください！');
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
