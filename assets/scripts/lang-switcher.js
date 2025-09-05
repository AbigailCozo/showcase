document.addEventListener('DOMContentLoaded', () => {
  const select = document.getElementById('lang');
  const APPLY_LANG = (lang) => {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-de]').forEach(el => {
      const text = el.getAttribute(`data-${lang}`);
      if (text) {
        // support for \n line breaks in data attributes
        el.innerHTML = text.replace(/\\n/g, '<br>');
      }
    });
    localStorage.setItem('site-lang', lang);
  };
  // initial aus Storage oder Browser-Sprache (Fallback: de)
  const stored = localStorage.getItem('site-lang');
  const initial = stored || (navigator.language && navigator.language.startsWith('en') ? 'en' : 'de');
  select.value = initial; APPLY_LANG(initial);
  select.addEventListener('change', e => APPLY_LANG(e.target.value));

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
});