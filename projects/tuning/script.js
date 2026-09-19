document.addEventListener('DOMContentLoaded', () => {
    // Compact Header on Scroll
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('compact');
        } else {
            header.classList.remove('compact');
        }
    });

    // Typewriter Effect
    const titleElement = document.getElementById('typewriter');
    if (titleElement) {
        const text = "Делаем каждый автомобиль Как свой";
        titleElement.innerHTML = ''; // clear original
        
        // Split text by words or specific logic. For simplicity, just letters with <br> handling
        const originalHTML = "Делаем каждый автомобиль<br>Как свой";
        let i = 0;
        let isTag = false;
        let currentHTML = "";

        const cursor = document.createElement('span');
        cursor.className = 'typewriter-cursor';

        function typeWriter() {
            if (i < originalHTML.length) {
                if (originalHTML.charAt(i) === '<') isTag = true;
                currentHTML += originalHTML.charAt(i);
                if (originalHTML.charAt(i) === '>') isTag = false;
                
                titleElement.innerHTML = currentHTML;
                titleElement.appendChild(cursor);

                i++;
                let delay = isTag ? 0 : 50 + Math.random() * 50;
                setTimeout(typeWriter, delay);
            }
        }
        
        setTimeout(typeWriter, 500);
    }

    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const header = item.querySelector('.faq-header');
        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all items
            faqItems.forEach(faq => {
                faq.classList.remove('active');
            });

            // Open if wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // Stats Counter with Intersection Observer
    const statsNumbers = document.querySelectorAll('.stat-number');
    let hasCounted = false;

    const countUp = (el) => {
        const target = parseInt(el.getAttribute('data-target'));
        const duration = 2000;
        const frameRate = 30;
        const totalFrames = Math.round(duration / (1000 / frameRate));
        const increment = target / totalFrames;
        let current = 0;

        const counterInterval = setInterval(() => {
            current += increment;
            if (current >= target) {
                el.innerText = target + (target > 10 ? '+' : '');
                if (target === 1200) el.innerText += ' HP';
                clearInterval(counterInterval);
            } else {
                el.innerText = Math.round(current);
            }
        }, 1000 / frameRate);
    };

    const statsObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !hasCounted) {
            hasCounted = true;
            statsNumbers.forEach(num => {
                countUp(num);
            });
        }
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.stats-counter');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }
});
