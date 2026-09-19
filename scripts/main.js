/**
 * Portfolio Client Scripts
 * Clean, lightweight, bespoke animations & interactions.
 * Zero external libraries.
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeroTypewriter();
  initSpotlightEffect();
  initScrollReveal();
  initProjectFilters();
  initClipboardCopy();
  initTikTokScrollSnap();
});

/**
 * 1. Очеловеченная анимация набора текста заголовка (Humanized Typewriter)
 */
function initHeroTypewriter() {
  const target = document.getElementById('typingTarget');
  if (!target) return;

  // Если у пользователя включен режим пониженного движения (a11y) — оставляем текст как есть
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  // Очищаем контейнер перед набором
  target.innerHTML = '';

  // Сегменты текста с разметкой
  const segments = [
    { text: 'Сайты, которые ', highlight: false },
    { text: 'реально', highlight: true },
    { text: ' работают', highlight: false }
  ];

  let segmentIdx = 0;
  let charIdx = 0;
  let currentSpan = null;

  // Очеловеченный расчёт паузы между нажатиями клавиш
  function getHumanDelay(char, prevChar) {
    // Базовая скорость печати: 60-95мс с естественным разбросом
    let delay = 65 + Math.random() * 35;

    // После запятой человек делает естественную осмысленную паузу
    if (prevChar === ',') {
      delay += 260 + Math.random() * 80; // ~320-400мс
    } else if (char === ' ') {
      // Пауза между словами
      delay += 55 + Math.random() * 45;
    } else if (Math.random() < 0.12) {
      // Периодическое лёгкое естественное замедление (перенос пальца на другую клавишу)
      delay += 90 + Math.random() * 70;
    }

    return Math.round(delay);
  }

  function typeChar() {
    if (segmentIdx >= segments.length) {
      // Набор завершён: курсор остаётся в конце и продолжает плавно мигать
      return;
    }

    const currentSeg = segments[segmentIdx];

    // Если это выделенный сегмент ("реально") — создаём для него цветной спан
    if (charIdx === 0 && currentSeg.highlight) {
      currentSpan = document.createElement('span');
      currentSpan.className = 'hero-highlight';
      target.appendChild(currentSpan);
    } else if (charIdx === 0 && !currentSeg.highlight) {
      currentSpan = null;
    }

    const char = currentSeg.text[charIdx];
    const prevChar = charIdx > 0 ? currentSeg.text[charIdx - 1] : (segmentIdx > 0 ? segments[segmentIdx - 1].text.slice(-1) : '');

    if (currentSpan) {
      currentSpan.textContent += char;
    } else {
      target.appendChild(document.createTextNode(char));
    }

    charIdx++;

    // Переход к следующему сегменту
    if (charIdx >= currentSeg.text.length) {
      segmentIdx++;
      charIdx = 0;
    }

    const delay = getHumanDelay(char, prevChar);
    setTimeout(typeChar, delay);
  }

  // Небольшая естественная пауза перед первым нажатием клавиши (380мс)
  setTimeout(typeChar, 380);
}

/**
 * 2. Interactive Spotlight / Cursor Glow on Bento and Project cards
 */
function initSpotlightEffect() {
  const cards = document.querySelectorAll('.spotlight');

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

/**
 * 3. Smooth Scroll-Driven Reveal (Intersection Observer)
 */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (!revealElements.length) return;

  // If browser doesn't support IntersectionObserver, reveal immediately
  if (!('IntersectionObserver' in window)) {
    revealElements.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    },
    {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  revealElements.forEach((el) => observer.observe(el));
}

/**
 * 4. Filter projects by category with smooth fade
 */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');

  if (!filterBtns.length || !cards.length) return;

  // Автоматический подсчёт общего числа проектов в кнопке "Все работы"
  const allBtn = document.querySelector('.filter-btn[data-filter="all"]');
  if (allBtn) {
    allBtn.textContent = `Все работы (${cards.length})`;
  }

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      cards.forEach((card) => {
        const category = card.getAttribute('data-category');
        const matches = filterValue === 'all' || category === filterValue;

        if (matches) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          card.style.transform = 'translateY(12px)';

          requestAnimationFrame(() => {
            setTimeout(() => {
              card.style.transition = 'opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1), transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 10);
          });
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/**
 * 5. Copy contact to clipboard with toast notification
 */
function initClipboardCopy() {
  const copyButtons = document.querySelectorAll('[data-copy]');
  const toast = document.getElementById('toast-notice');

  if (!copyButtons.length || !toast) return;

  let toastTimeout;

  copyButtons.forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      try {
        await navigator.clipboard.writeText(textToCopy);
        showToast(`Скопировано: ${textToCopy}`);
      } catch {
        // Fallback
        const input = document.createElement('textarea');
        input.value = textToCopy;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        showToast(`Скопировано: ${textToCopy}`);
      }
    });
  });

  function showToast(message) {
    const toastText = toast.querySelector('.toast-text') || toast;
    toastText.textContent = message;
    toast.classList.add('show');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 2500);
  }
}

/**
 * 6. TikTok-style full-screen snap navigation
 * - Screen 1 (Hero) <--> Screen 2 (About / Tools / Services / Contacts)
 * - Screen 2 <--> Screen 3 (Projects catalog)
 * - Screen 3 and beyond: 100% normal native scrolling for any number of projects!
 */
function initTikTokScrollSnap() {
  const heroSection = document.querySelector('.hero-screen');
  const aboutSection = document.getElementById('about');
  const projectsSection = document.getElementById('projects');

  if (!heroSection || !aboutSection || !projectsSection) return;

  let isAnimating = false;
  let wheelCooldown = false;
  let currentRAF = null;
  let cooldownTimer = null;

  function getTargets() {
    const heroTop = 0;
    const aboutTop = Math.round(aboutSection.getBoundingClientRect().top + window.scrollY);
    const projectsTop = Math.round(projectsSection.getBoundingClientRect().top + window.scrollY);
    return { heroTop, aboutTop, projectsTop };
  }

  // Silk-smooth exponential ease-out animation
  function animateTo(targetY, duration, onComplete) {
    if (isAnimating) {
      cancelAnimationFrame(currentRAF);
    }

    isAnimating = true;
    const startY = window.scrollY;
    const dist = targetY - startY;

    if (Math.abs(dist) < 2) {
      window.scrollTo(0, targetY);
      isAnimating = false;
      if (onComplete) onComplete();
      return;
    }

    const startTime = performance.now();

    // easeInOutCubic: velvety smooth start, fluid glide, cushioned landing
    function easeInOutCubic(x) {
      return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    }

    function frame(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = easeInOutCubic(progress);

      window.scrollTo(0, Math.round(startY + dist * ease));

      if (progress < 1) {
        currentRAF = requestAnimationFrame(frame);
      } else {
        window.scrollTo(0, targetY);
        currentRAF = null;
        isAnimating = false;
        if (onComplete) onComplete();
      }
    }

    currentRAF = requestAnimationFrame(frame);
  }

  // Dedicated transition trigger: smooth 620ms glide with a minimal 80ms post-landing cooldown
  function triggerTransition(targetY) {
    isAnimating = true;
    wheelCooldown = true;
    clearTimeout(cooldownTimer);

    animateTo(targetY, 620, () => {
      // 80ms cooldown after landing: absorbs residual inertia without causing noticeable delay
      clearTimeout(cooldownTimer);
      cooldownTimer = setTimeout(() => {
        wheelCooldown = false;
      }, 80);
    });
  }

  // Floating Navigation Arrow Button (#scrollNavBtn)
  const scrollNavBtn = document.getElementById('scrollNavBtn');
  let navDirection = 'down'; // 'down' или 'up'

  function updateScrollNavBtn() {
    if (!scrollNavBtn) return;
    const { aboutTop, projectsTop } = getTargets();
    const currentY = window.scrollY;

    const isAtHero = currentY < aboutTop - 40;
    const isAtProjects = currentY >= projectsTop - 40;
    const isNearPageBottom = window.innerHeight + currentY >= document.documentElement.scrollHeight - 60;

    if (isAtHero) {
      navDirection = 'down';
    } else if (isAtProjects || isNearPageBottom) {
      navDirection = 'up';
    }
    // На втором экране (блок информации) сохраняется текущее направление навигации (up или down)

    if (navDirection === 'up') {
      if (!scrollNavBtn.classList.contains('is-up')) {
        scrollNavBtn.classList.add('is-up');
      }
      if (currentY <= aboutTop + 40) {
        scrollNavBtn.setAttribute('aria-label', 'В приветственный блок');
      } else {
        scrollNavBtn.setAttribute('aria-label', 'К блоку информации');
      }
    } else {
      if (scrollNavBtn.classList.contains('is-up')) {
        scrollNavBtn.classList.remove('is-up');
      }
      if (currentY < aboutTop - 40) {
        scrollNavBtn.setAttribute('aria-label', 'К блоку информации');
      } else {
        scrollNavBtn.setAttribute('aria-label', 'К проектам');
      }
    }
    scrollNavBtn.removeAttribute('title');
  }

  if (scrollNavBtn) {
    scrollNavBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (isAnimating) return;

      const { heroTop, aboutTop, projectsTop } = getTargets();
      const currentY = window.scrollY;

      if (scrollNavBtn.classList.contains('is-up')) {
        // Листаем вверх поэтапно:
        // Если находимся ниже блока информации (в проектах или внизу страницы) — перемещаемся на блок информации
        if (currentY > aboutTop + 40) {
          navDirection = 'up';
          triggerTransition(aboutTop);
        } else {
          // Если уже на блоке информации — перемещаемся в приветственный блок (самый верх)
          navDirection = 'up';
          triggerTransition(heroTop);
        }
      } else {
        // Листаем вниз поэтапно:
        if (currentY < aboutTop - 40) {
          navDirection = 'down';
          triggerTransition(aboutTop);
        } else {
          navDirection = 'down';
          triggerTransition(projectsTop);
        }
      }
    });

    window.addEventListener('scroll', updateScrollNavBtn, { passive: true });
    window.addEventListener('resize', updateScrollNavBtn, { passive: true });
    updateScrollNavBtn();
  }

  // 1. Mouse Wheel Handler (Desktop)
  window.addEventListener(
    'wheel',
    (e) => {
      if (isAnimating || wheelCooldown) {
        // While animating or cooling down, absorb all momentum events to prevent double-skipping
        e.preventDefault();
        return;
      }

      // Ignore micro-jitter
      if (Math.abs(e.deltaY) < 18) return;

      const { heroTop, aboutTop, projectsTop } = getTargets();
      const currentY = window.scrollY;
      const isDown = e.deltaY > 0;

      navDirection = isDown ? 'down' : 'up';
      updateScrollNavBtn();

      // 1. PROJECTS SECTION: Allow completely normal native scrolling for any number of projects
      if (currentY >= projectsTop - 20) {
        if (isDown) {
          // Allow normal native scrolling down through all projects
          return;
        }

        // Scrolling UP inside projects:
        // If within 90px of top of projects, snap smoothly to About screen
        if (currentY <= projectsTop + 90) {
          e.preventDefault();
          triggerTransition(aboutTop);
          return;
        }

        // Deeper in projects: normal native scrolling up
        return;
      }

      // 2. HERO SECTION: At or near the first screen
      if (currentY < aboutTop - 40) {
        if (isDown) {
          e.preventDefault();
          triggerTransition(aboutTop);
        }
        return;
      }

      // 3. ABOUT SECTION & TRANSITION ZONE (between aboutTop - 40 and projectsTop - 20)
      e.preventDefault();
      if (isDown) {
        // Scrolling down: always go to projects
        triggerTransition(projectsTop);
      } else {
        // Scrolling UP:
        // If we are anywhere below aboutTop + 30, we must FIRST land on aboutTop!
        if (currentY > aboutTop + 30) {
          triggerTransition(aboutTop);
        } else {
          // We are already parked on aboutTop: go to heroTop!
          triggerTransition(heroTop);
        }
      }
    },
    { passive: false }
  );

  // 2. Touch Swipe Handler (Mobile & Tablets)
  let touchStartY = 0;
  let touchStartX = 0;

  window.addEventListener(
    'touchstart',
    (e) => {
      if (e.touches.length === 1) {
        touchStartY = e.touches[0].clientY;
        touchStartX = e.touches[0].clientX;
      }
    },
    { passive: true }
  );

  window.addEventListener(
    'touchend',
    (e) => {
      if (isAnimating || wheelCooldown || !e.changedTouches.length) return;

      const deltaY = touchStartY - e.changedTouches[0].clientY;
      const deltaX = touchStartX - e.changedTouches[0].clientX;

      // Must be a clear vertical swipe (at least 35px)
      if (Math.abs(deltaY) < 35 || Math.abs(deltaY) < Math.abs(deltaX) * 1.1) return;

      const { heroTop, aboutTop, projectsTop } = getTargets();
      const currentY = window.scrollY;
      const isSwipeUp = deltaY > 0; // finger swiping up = scrolling page down

      navDirection = isSwipeUp ? 'down' : 'up';
      updateScrollNavBtn();

      // Projects section
      if (currentY >= projectsTop - 20) {
        if (!isSwipeUp && currentY <= projectsTop + 90) {
          triggerTransition(aboutTop);
        }
        return;
      }

      // Hero section
      if (currentY < aboutTop - 40) {
        if (isSwipeUp) {
          triggerTransition(aboutTop);
        }
        return;
      }

      // About section & middle zone
      if (isSwipeUp) {
        triggerTransition(projectsTop);
      } else {
        if (currentY > aboutTop + 30) {
          triggerTransition(aboutTop);
        } else {
          triggerTransition(heroTop);
        }
      }
    },
    { passive: true }
  );

  // 3. Keyboard Arrow & Page Navigation
  window.addEventListener('keydown', (e) => {
    if (isAnimating || wheelCooldown) return;
    const downKeys = ['ArrowDown', 'PageDown', ' '];
    const upKeys = ['ArrowUp', 'PageUp'];

    const { heroTop, aboutTop, projectsTop } = getTargets();
    const currentY = window.scrollY;

    if (downKeys.includes(e.key)) {
      navDirection = 'down';
      updateScrollNavBtn();
      if (currentY < aboutTop - 40) {
        e.preventDefault();
        triggerTransition(aboutTop);
      } else if (currentY < projectsTop - 20) {
        e.preventDefault();
        triggerTransition(projectsTop);
      }
    } else if (upKeys.includes(e.key)) {
      navDirection = 'up';
      updateScrollNavBtn();
      if (currentY >= projectsTop - 20 && currentY <= projectsTop + 90) {
        e.preventDefault();
        triggerTransition(aboutTop);
      } else if (currentY < projectsTop - 20 && currentY > aboutTop + 30) {
        e.preventDefault();
        triggerTransition(aboutTop);
      } else if (currentY >= aboutTop - 40 && currentY <= aboutTop + 30) {
        e.preventDefault();
        triggerTransition(heroTop);
      }
    }
  });
}
