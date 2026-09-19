document.addEventListener('DOMContentLoaded', () => {
    // Sticky Header
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
    });

    // Fade-in Animation Observer
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: stop observing once visible
                // observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    fadeElements.forEach(el => observer.observe(el));

    // Custom Cursor
    const cursor = document.querySelector('.custom-cursor');
    if (cursor) {
        let mouseX = 0;
        let mouseY = 0;
        let cursorX = 0;
        let cursorY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        const animateCursor = () => {
            cursorX += (mouseX - cursorX) * 0.15; // Плавное следование (Lerp)
            cursorY += (mouseY - cursorY) * 0.15;
            cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
            requestAnimationFrame(animateCursor);
        };
        requestAnimationFrame(animateCursor);

        const hoverElements = document.querySelectorAll('a, button, .ba-slider, img, .portfolio-item');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });
    }

    // Before/After Slider
    const baSlider = document.querySelector('.ba-slider');
    if (baSlider) {
        const baAfter = baSlider.querySelector('.ba-after');
        const baHandle = baSlider.querySelector('.ba-handle');
        let isDragging = false;

        const moveSlider = (e) => {
            if (!isDragging) return;
            let x;
            if (e.type.includes('mouse')) {
                x = e.clientX - baSlider.getBoundingClientRect().left;
            } else {
                x = e.touches[0].clientX - baSlider.getBoundingClientRect().left;
            }
            
            if (x < 0) x = 0;
            if (x > baSlider.offsetWidth) x = baSlider.offsetWidth;
            
            const percent = (x / baSlider.offsetWidth) * 100;
            baAfter.style.width = percent + '%';
            baHandle.style.left = percent + '%';
        };

        baSlider.addEventListener('mousedown', () => isDragging = true);
        baSlider.addEventListener('touchstart', () => isDragging = true, {passive: true});
        
        window.addEventListener('mouseup', () => isDragging = false);
        window.addEventListener('touchend', () => isDragging = false);
        
        window.addEventListener('mousemove', moveSlider);
        window.addEventListener('touchmove', moveSlider, {passive: true});
    }
});
