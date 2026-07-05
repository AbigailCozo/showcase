document.addEventListener('DOMContentLoaded', () => {
    // ===== Jahreszahl im Footer =====
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    // ===== Scroll Reveal =====
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: .12 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));


    // ===== Hi & Wave Effekt im Header =====
    (function () {
        const h1 = document.querySelector('h1');
        function replayLoudSoft() {
            const el = h1 && h1.querySelector('.imsg-loud-soft');
            if (!el) return;
            el.classList.remove('play');
            void el.offsetWidth;
            el.classList.add('play');
        }
        replayLoudSoft();
        const langSelect = document.getElementById('lang');
        if (langSelect) {
            langSelect.addEventListener('change', () => {
                setTimeout(replayLoudSoft, 0);
            });
        }
        if (h1) {
            const obs = new MutationObserver(() => setTimeout(replayLoudSoft, 0));
            obs.observe(h1, { childList: true, subtree: true });
        }
    })();

    // ===== Galerie Image-Slider =====
    const slider = document.getElementById('imageSlider');
    const prevBtn = document.querySelector('.prev-arrow');
    const nextBtn = document.querySelector('.next-arrow');

    if (slider && prevBtn && nextBtn) {
        // Scrollt jeweils um die Breite von zwei Bildern (lässt sich anpassen)
        const getScrollAmount = () => slider.clientWidth / 2; 

        nextBtn.addEventListener('click', () => {
            slider.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
        });

        prevBtn.addEventListener('click', () => {
            slider.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
        });
    }

    // ===== Hero Automatischer Image-Slider (Alle 3 Sekunden) =====
    const heroSlides = document.querySelectorAll('.device img');
    if (heroSlides.length > 0) {
        let currentHeroSlide = 0;
        
        setInterval(() => {
            heroSlides[currentHeroSlide].classList.remove('active');
            currentHeroSlide = (currentHeroSlide + 1) % heroSlides.length;
            heroSlides[currentHeroSlide].classList.add('active');
        }, 3000);
    }

}); // <-- Hier schließt sich der Haupt-Block von ganz oben
