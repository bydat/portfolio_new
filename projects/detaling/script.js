document.addEventListener('DOMContentLoaded', () => {
    // FAQ Accordion Logic
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                otherItem.querySelector('.faq-answer').style.maxHeight = null;
            });
            if (!isActive) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    // Sticky Header Logic
    const stickyHeader = document.querySelector('.sticky-header');
    if (stickyHeader) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                stickyHeader.classList.add('visible');
            } else {
                stickyHeader.classList.remove('visible');
            }
        });
    }

    // Hero Carousel Logic
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prev-slide');
    const nextBtn = document.getElementById('next-slide');
    const currentSlideEl = document.getElementById('current-slide');
    const title = document.getElementById('hero-title');
    const desc = document.getElementById('hero-desc');
    
    if (slides.length > 0) {
        const slideData = [
            { t: "Детейлинг автомобиля", d: "Самый известный детейлинг-центр России. Безупречное качество, проверенное тысячами клиентов." },
            { t: "Полировка и защита", d: "Восстановление блеска и устранение царапин с помощью передовых технологий и составов." },
            { t: "Оклейка пленкой", d: "Надежная антигравийная защита кузова от сколов и царапин полиуретановыми пленками." },
            { t: "Химчистка салона", d: "Глубокая очистка интерьера с использованием гипоаллергенной химии премиум-класса." },
            { t: "Малярные работы", d: "Полная и локальная покраска деталей автомобиля, профессиональные колористы и маляры." },
            { t: "Керамика кузова", d: "Нанесение многослойных керамических покрытий для максимального блеска и гидрофоба." }
        ];
        let currentSlide = 0;
        let slideInterval;

        function goToSlide(index) {
            slides[currentSlide].classList.remove('active');
            
            if (index >= slides.length) currentSlide = 0;
            else if (index < 0) currentSlide = slides.length - 1;
            else currentSlide = index;

            slides[currentSlide].classList.add('active');
            currentSlideEl.textContent = currentSlide + 1;
            
            title.style.opacity = 0;
            desc.style.opacity = 0;
            setTimeout(() => {
                title.textContent = slideData[currentSlide].t;
                desc.textContent = slideData[currentSlide].d;
                title.style.opacity = 1;
                desc.style.opacity = 1;
            }, 300);
        }

        function startAutoplay() {
            slideInterval = setInterval(() => {
                goToSlide(currentSlide + 1);
            }, 5000);
        }

        function resetAutoplay() {
            clearInterval(slideInterval);
            startAutoplay();
        }

        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => {
                goToSlide(currentSlide - 1);
                resetAutoplay();
            });
            nextBtn.addEventListener('click', () => {
                goToSlide(currentSlide + 1);
                resetAutoplay();
            });
        }

        startAutoplay();
    }
});
