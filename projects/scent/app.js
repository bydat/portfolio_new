// SENSE LAB - Olfactory Logic

document.addEventListener('DOMContentLoaded', () => {


    // === 2. Scent Constructor Sliders & Balancing Algorithm ===
    const sliderTop = document.getElementById('slider-top');
    const sliderHeart = document.getElementById('slider-heart');
    const sliderBase = document.getElementById('slider-base');

    const valTop = document.getElementById('top-val');
    const valHeart = document.getElementById('heart-val');
    const valBase = document.getElementById('base-val');

    const liquid = document.getElementById('liquid');
    const labelFormula = document.getElementById('label-formula');
    const labelNum = document.getElementById('label-num');
    const formulaType = document.getElementById('formula-type');

    // Stats
    const statCitrus = document.getElementById('stat-citrus');
    const statFloral = document.getElementById('stat-floral');
    const statSpicy = document.getElementById('stat-spicy');
    const statWoody = document.getElementById('stat-woody');

    // Balancing inputs so they always sum up to 100%
    function balanceSliders(activeSlider) {
        let t = parseInt(sliderTop.value);
        let h = parseInt(sliderHeart.value);
        let b = parseInt(sliderBase.value);
        const sum = t + h + b;

        if (sum !== 100) {
            const diff = 100 - sum;
            if (activeSlider === 'top') {
                // Adjust heart and base proportionally
                const remaining = h + b || 1;
                h += Math.round(diff * (h / remaining));
                b = 100 - t - h;
            } else if (activeSlider === 'heart') {
                const remaining = t + b || 1;
                t += Math.round(diff * (t / remaining));
                b = 100 - h - t;
            } else {
                const remaining = t + h || 1;
                t += Math.round(diff * (t / remaining));
                h = 100 - b - t;
            }

            // Clamping values between 0 and 100
            t = Math.max(0, Math.min(100, t));
            h = Math.max(0, Math.min(100, h));
            b = 100 - t - h;

            sliderTop.value = t;
            sliderHeart.value = h;
            sliderBase.value = b;
        }

        updateMixerUI(t, h, b);
    }

    // Dynamic Color Mixing & UI updates
    function updateMixerUI(t, h, b) {
        // Display percentages
        valTop.textContent = `${t}%`;
        valHeart.textContent = `${h}%`;
        valBase.textContent = `${b}%`;

        // Color Mixing
        // Top notes (citrus): golden yellow (230, 205, 80)
        // Heart notes (floral): soft rose-pink (210, 85, 120)
        // Base notes (woody): rich warm amber-brown (140, 80, 45)
        const r = Math.round((t * 230 + h * 210 + b * 140) / 100);
        const g = Math.round((t * 205 + h * 85 + b * 80) / 100);
        const bl = Math.round((t * 80 + h * 120 + b * 45) / 100);

        liquid.style.background = `linear-gradient(180deg, rgba(${r}, ${g}, ${bl}, 0.65) 0%, rgba(${Math.max(0, r - 30)}, ${Math.max(0, g - 20)}, ${Math.max(0, bl - 10)}, 0.85) 100%)`;

        // Update liquid height dynamically based on the base-heavy/top-heavy formulation
        const heightPct = 50 + (b * 0.3) + (h * 0.1);
        liquid.style.height = `${heightPct}%`;

        // Generate Formula Label Text
        let topText = t > 40 ? "CITRUS" : (t > 20 ? "Bergamot" : "Neroli");
        let heartText = h > 40 ? "JASMINE" : (h > 20 ? "Rose" : "Pepper");
        let baseText = b > 40 ? "AMBER" : (b > 20 ? "Sandal" : "Cedar");
        labelFormula.textContent = `${topText} - ${heartText} - ${baseText}`;

        // Dynamic formula name description
        let typeStr = "Сбалансированный эликсир";
        if (t > h && t > b) typeStr = "Свежий Цитрусовый характер";
        else if (h > t && h > b) typeStr = "Цветочный чувственный букет";
        else if (b > t && b > h) typeStr = "Благородный Древесный шлейф";
        else if (t > 30 && b > 30) typeStr = "Контрастный Цитрусово-Древесный аромат";
        formulaType.textContent = typeStr;

        // Dynamic stats
        statCitrus.style.width = `${t}%`;
        statFloral.style.width = `${Math.round(h * 0.65)}%`;
        statSpicy.style.width = `${Math.round(h * 0.35 + b * 0.2)}%`;
        statWoody.style.width = `${Math.round(b * 0.8)}%`;

        // Dynamic unique formula code
        const code = 1000 + (t * 7) + (h * 13) + (b * 19);
        labelNum.textContent = code;
    }

    // Attach slider inputs
    if (sliderTop && sliderHeart && sliderBase) {
        sliderTop.addEventListener('input', () => balanceSliders('top'));
        sliderHeart.addEventListener('input', () => balanceSliders('heart'));
        sliderBase.addEventListener('input', () => balanceSliders('base'));
        
        // Initial balance
        balanceSliders('top');
    }

    // === 3. Sensory Quiz ===
    const quizQuestions = [
        {
            question: "Какая атмосфера вам ближе для отдыха?",
            options: [
                { text: "Солнечный цитрусовый сад у моря утром", formula: { t: 60, h: 25, b: 15 } },
                { text: "Приватная библиотека, кожаные кресла и камин", formula: { t: 15, h: 30, b: 55 } },
                { text: "Цветущая оранжерея после теплого ливня", formula: { t: 25, h: 55, b: 20 } },
                { text: "Восточный базар с пряностями и благовониями", formula: { t: 20, h: 40, b: 40 } }
            ]
        },
        {
            question: "Выберите текстуру, которая вам приятнее всего:",
            options: [
                { text: "Холодный полированный мрамор", formula: { t: 50, h: 30, b: 20 } },
                { text: "Теплый мягкий кашемир", formula: { t: 15, h: 45, b: 40 } },
                { text: "Грубое фактурное дерево", formula: { t: 20, h: 20, b: 60 } },
                { text: "Тонкий струящийся шелк", formula: { t: 30, h: 50, b: 20 } }
            ]
        },
        {
            question: "Какой напиток отражает ваше настроение прямо сейчас?",
            options: [
                { text: "Ледяной тоник с лаймом и мятой", formula: { t: 70, h: 20, b: 10 } },
                { text: "Крепкий черный кофе со специями", formula: { t: 15, h: 45, b: 40 } },
                { text: "Жасминовый зеленый чай", formula: { t: 30, h: 50, b: 20 } },
                { text: "Выдержанный виски с торфяным дымком", formula: { t: 10, h: 25, b: 65 } }
            ]
        }
    ];

    let currentQuestionIdx = 0;
    const qTitle = document.getElementById('q-title');
    const qOptions = document.getElementById('q-options');
    const progressFill = document.getElementById('quiz-progress');

    // Accumulated formula settings from answers
    let accumulatedFormula = { t: 0, h: 0, b: 0 };

    function loadQuestion() {
        if (currentQuestionIdx >= quizQuestions.length) {
            showQuizResults();
            return;
        }

        const q = quizQuestions[currentQuestionIdx];
        qTitle.textContent = q.question;
        qOptions.innerHTML = '';

        // Progress
        const progressPct = ((currentQuestionIdx) / quizQuestions.length) * 100;
        progressFill.style.width = `${progressPct}%`;

        q.options.forEach((opt, idx) => {
            const btn = document.createElement('button');
            btn.className = 'quiz-option';
            btn.innerHTML = `
                <span class="option-num">0${idx + 1}</span>
                <span class="option-text">${opt.text}</span>
            `;
            
            // Click Handler
            btn.addEventListener('click', () => {
                accumulatedFormula.t += opt.formula.t;
                accumulatedFormula.h += opt.formula.h;
                accumulatedFormula.b += opt.formula.b;
                
                currentQuestionIdx++;
                loadQuestion();
            });
            
            qOptions.appendChild(btn);
        });
        
        // Re-apply cursor hover logic for new options
        const newOptions = qOptions.querySelectorAll('.quiz-option');
        newOptions.forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('hover-active'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('hover-active'));
        });
    }

    function showQuizResults() {
        progressFill.style.width = '100%';
        
        // Calculate average recommended formula
        const n = quizQuestions.length;
        let finalT = Math.round(accumulatedFormula.t / n);
        let finalH = Math.round(accumulatedFormula.h / n);
        let finalB = 100 - finalT - finalH;

        // Display results page inside quiz card
        qTitle.innerHTML = "Ольфакторный тест завершен";
        
        // Let's identify the recommended archetype
        let archetype = "Сбалансированная гармония";
        if (finalT > finalH && finalT > finalB) archetype = "Энергичный Цитрусовый Мусс";
        else if (finalH > finalT && finalH > finalB) archetype = "Чувственная Пудровая Роза";
        else if (finalB > finalT && finalB > finalH) archetype = "Глубокий Янтарный Сандал";

        qOptions.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 20px 0;">
                <p style="margin-bottom: 20px; font-size: 1.1rem; color: var(--text-secondary);">Ваш ольфакторный архетип: <strong style="color: var(--brand-gold);">${archetype}</strong></p>
                <p style="margin-bottom: 30px; font-size: 0.9rem; color: var(--text-secondary); max-width: 500px; margin-left: auto; margin-right: auto;">Мы настроили пропорции ингредиентов в парфюмерном симуляторе на основе ваших ответов. Поднимитесь к разделу "Конструктор", чтобы увидеть созданный флакон и заказать тест-сет.</p>
                <button class="btn-scent-solid" id="apply-quiz-btn" style="margin: 0 auto;">Применить формулу в конструкторе</button>
            </div>
        `;

        document.getElementById('apply-quiz-btn').addEventListener('click', () => {
            sliderTop.value = finalT;
            sliderHeart.value = finalH;
            sliderBase.value = finalB;
            updateMixerUI(finalT, finalH, finalB);
            
            // Smooth scroll to constructor
            document.getElementById('constructor').scrollIntoView({ behavior: 'smooth' });
            
            // Reset quiz for retry
            setTimeout(() => {
                currentQuestionIdx = 0;
                accumulatedFormula = { t: 0, h: 0, b: 0 };
                loadQuestion();
            }, 2000);
        });
    }

    if (qTitle && qOptions) {
        loadQuestion();
    }

    // === 4. Order & Success Modals ===
    const orderModal = document.getElementById('order-modal');
    const successModal = document.getElementById('success-modal');
    
    const btnOrder = document.getElementById('btn-order');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const successCloseBtn = document.getElementById('success-close-btn');
    const successDoneBtn = document.getElementById('success-done-btn');

    const summaryFormulaText = document.getElementById('summary-formula-text');
    const sumTop = document.getElementById('sum-top');
    const sumHeart = document.getElementById('sum-heart');
    const sumBase = document.getElementById('sum-base');
    const summaryFormulaNum = document.getElementById('summary-formula-num');
    
    const orderForm = document.getElementById('scent-order-form');

    if (btnOrder && orderModal) {
        btnOrder.addEventListener('click', () => {
            // Fill details
            summaryFormulaText.textContent = labelFormula.textContent;
            sumTop.textContent = sliderTop.value;
            sumHeart.textContent = sliderHeart.value;
            sumBase.textContent = sliderBase.value;
            summaryFormulaNum.textContent = labelNum.textContent;

            // Show modal
            orderModal.classList.add('show');
        });

        // Close functions
        modalCloseBtn.addEventListener('click', () => orderModal.classList.remove('show'));
        successCloseBtn.addEventListener('click', () => successModal.classList.remove('show'));
        successDoneBtn.addEventListener('click', () => successModal.classList.remove('show'));

        // Close on clicking outside modal content
        window.addEventListener('click', (e) => {
            if (e.target === orderModal) orderModal.classList.remove('show');
            if (e.target === successModal) successModal.classList.remove('show');
        });

        // Form Submit
        if (orderForm) {
            orderForm.addEventListener('submit', (e) => {
                e.preventDefault();
                orderModal.classList.remove('show');
                successModal.classList.add('show');
                orderForm.reset();
            });
        }
    }
});
