import * as pdfjsLib from "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.6.82/build/pdf.mjs";

    // Worker (gleiche Version!) – wichtig, sonst lädt nichts
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.6.82/build/pdf.worker.mjs";

    (function initPdfViewers() {
      const viewers = document.querySelectorAll('.pdfjs-viewer');
      if (!viewers.length) return;

      viewers.forEach(async (el) => {
        const rawPath = el.dataset.pdfPath || "";
        // absoluter Pfad (robust für GitHub Pages / Unterordner)
        const path = new URL(rawPath, window.location.href).href;

        let pageNum = parseInt(el.dataset.startPage || '1', 10);
        let pdfDoc = null;
        let scale = 1.0;
        const minScale = 0.5, maxScale = 2.0;

        // UI-Elemente
        const canvas = el.querySelector('.pdf-canvas');
        const ctx = canvas.getContext('2d');
        const pageNumSpan = el.querySelector('.page-num');
        const pageCountSpan = el.querySelector('.page-count');
        const prevBtn = el.querySelector('.prev');
        const nextBtn = el.querySelector('.next');
        const zOutBtn = el.querySelector('.zoom-out');
        const zInBtn = el.querySelector('.zoom-in');
        const zReset = el.querySelector('.zoom-reset');
        const wrap = el.querySelector('.pdf-canvas-wrap');

        const showError = (msg) => {
          wrap.innerHTML = '<div class="bubble" style="margin:0 18px 18px;">' + msg + '</div>';
          console.error(msg);
        };

        // Optionaler Vorab-Check (hilft bei Tippfehlern im Pfad)
        try {
          const head = await fetch(path, { method: 'HEAD' });
          if (!head.ok) {
            showError(`PDF nicht gefunden (HTTP ${head.status}). Prüfe Pfad/Dateinamen: ${rawPath}`);
            return;
          }
        } catch (e) {
          // OK bei file:// oder geblockten HEAD-Anfragen – wir laden einfach direkt
          console.warn('HEAD fehlgeschlagen, lade direkt mit PDF.js …', e);
        }

        // PDF laden
        try {
          pdfDoc = await pdfjsLib.getDocument({ url: path }).promise;
        } catch (err) {
          if (window.location.protocol === 'file:') {
            showError(
              'PDF konnte nicht geladen werden. Öffne die Seite über einen lokalen Server (z. B. VS Code „Live Server“) ' +
              'oder über GitHub Pages – nicht per Doppelklick.'
            );
          } else {
            showError('PDF konnte nicht geladen werden. Details in der Konsole.');
          }
          console.error(err);
          return;
        }

        pageCountSpan.textContent = pdfDoc.numPages;

        async function renderPage(num) {
          if (num < 1) num = 1;
          if (num > pdfDoc.numPages) num = pdfDoc.numPages;
          pageNum = num;
          pageNumSpan.textContent = pageNum;

          const page = await pdfDoc.getPage(pageNum);

          // an Card-Breite anpassen
          const natural = page.getViewport({ scale: 1 });
          const available = Math.max(320, el.querySelector('.pdf-canvas-wrap').clientWidth - 36);
          const fitScale = available / natural.width;
          const viewport = page.getViewport({ scale: fitScale * scale });

          canvas.width = Math.floor(viewport.width);
          canvas.height = Math.floor(viewport.height);

          await page.render({ canvasContext: ctx, viewport }).promise;

          prevBtn.disabled = (pageNum <= 1);
          nextBtn.disabled = (pageNum >= pdfDoc.numPages);
          zOutBtn.disabled = (scale <= minScale + 0.001);
          zInBtn.disabled = (scale >= maxScale - 0.001);
          zReset.textContent = Math.round(scale * 100) + '%';
        }

        // Events
        prevBtn.addEventListener('click', () => renderPage(pageNum - 1));
        nextBtn.addEventListener('click', () => renderPage(pageNum + 1));
        zOutBtn.addEventListener('click', () => { scale = Math.max(minScale, scale - 0.1); renderPage(pageNum); });
        zInBtn.addEventListener('click', () => { scale = Math.min(maxScale, scale + 0.1); renderPage(pageNum); });
        zReset.addEventListener('click', () => { scale = 1.0; renderPage(pageNum); });

        // Bei Resize neu rendern (debounced)
        let rAF = null;
        window.addEventListener('resize', () => {
          if (rAF) cancelAnimationFrame(rAF);
          rAF = requestAnimationFrame(() => renderPage(pageNum));
        });

        // Start
        renderPage(pageNum);
      });
    })();