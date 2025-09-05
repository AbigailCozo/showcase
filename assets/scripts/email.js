document.addEventListener('DOMContentLoaded', () => {
  (function () {
    // 1) HIER DEINE EmailJS-IDs einsetzen:
    const EMAILJS_PUBLIC_KEY = "_q5hRH_AS_atFb19L";
    const EMAILJS_SERVICE_ID = "service_oef140n";
    const EMAILJS_TEMPLATE_ID = "template_10y1jdj";
    emailjs.init(EMAILJS_PUBLIC_KEY);

    const form = document.getElementById('contact-form');
    const statusEl = document.getElementById('form-status');

    // 2) Platzhalter für DE/EN aktualisieren (dein Toggle setzt nur innerHTML)
    function applyPlaceholders(lang) {
      document.querySelectorAll('[data-ph-de]').forEach(el => {
        const ph = el.getAttribute(lang === 'en' ? 'data-ph-en' : 'data-ph-de');
        if (ph) el.placeholder = ph;
      });
    }
    const currentLang = document.documentElement.lang || 'de';
    applyPlaceholders(currentLang);

    const langSelect = document.getElementById('lang');
    if (langSelect) {
      langSelect.addEventListener('change', e => applyPlaceholders(e.target.value));
    }

    // 3) Senden
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Spam: Honeypot
      if (form.company && form.company.value) return;

      const lang = document.documentElement.lang === 'en' ? 'en' : 'de';
      statusEl.textContent = lang === 'en' ? 'Sending…' : 'Sende…';

      const payload = {
        from_name: form.name.value,
        reply_to: form.email.value,
        message: form.message.value
      };

      try {
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, payload);
        form.reset();
        statusEl.textContent = lang === 'en'
          ? 'Thanks! Your message has been sent.'
          : 'Danke! Deine Nachricht wurde gesendet.';
      } catch (err) {
        console.error(err);
        statusEl.textContent = lang === 'en'
          ? 'Hmm, something went wrong. Please email me directly: abigail.cozo@gmx.de'
          : 'Hmm, etwas ist schiefgelaufen. Schreib mir bitte direkt: abigail.cozo@gmx.de';
      }
    });
  })();
});