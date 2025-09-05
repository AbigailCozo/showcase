document.addEventListener('DOMContentLoaded', () => {
    // Jahreszahl im Footer
    document.getElementById('year').textContent = new Date().getFullYear();

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

});