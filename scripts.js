/* scripts.js — small interactive enhancements:
   - current year
   - smooth scroll
   - mobile nav toggle
   - simple form mock (AJAX placeholder)
*/

document.addEventListener('DOMContentLoaded', function () {
  // set current year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // smooth scroll for internal anchors
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      // allow external anchors like # and javascript:void(0)
      if (!href || href === '#' || href.startsWith('http')) return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // mobile nav toggle
  const navToggle = document.getElementById('nav-toggle');
  const navList = document.getElementById('nav-list');
  if (navToggle && navList) {
    navToggle.addEventListener('click', function () {
      const expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', String(!expanded));
      navList.classList.toggle('show');
    });
  }

  // contact form submission (mock)
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  if (form && status) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      status.textContent = 'Enviando...';
      // collect values
      const data = new FormData(form);
      const payload = {};
      data.forEach((v, k) => payload[k] = v);
      // simulate network request
      setTimeout(function () {
        status.textContent = 'Recebemos sua solicitação! Entraremos em contato via WhatsApp.';
        form.reset();
      }, 900);
      // TODO: replace with real fetch() to your backend endpoint
    });
  }

  // Accessibility: close nav when focus leaves or clicking outside
  document.addEventListener('click', function (e) {
    if (!navList) return;
    if (!navList.contains(e.target) && !navToggle.contains(e.target)) {
      navList.classList.remove('show');
      if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
    }
  });
});

// ---------- Lightbox para estudos de caso ----------
(function () {
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightbox-img');
  const lbCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.querySelector('.lightbox-close');

  function openLightbox(src, caption) {
    lbImg.src = src;
    lbImg.alt = caption || 'Estudo de caso';
    lbCaption.textContent = caption || '';
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closeLightbox() {
    lightbox.setAttribute('aria-hidden', 'true');
    lbImg.src = '';
    lbCaption.textContent = '';
    document.body.style.overflow = '';
  }

  // abrir ao clicar nos botões
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const src = this.dataset.src;
      const caption = this.dataset.caption;
      openLightbox(src, caption);
    });
  });

  // fechar clicando no fundo ou no X
  lightbox.addEventListener('click', function (e) {
    if (e.target === this || e.target === closeBtn) closeLightbox();
  });
  closeBtn.addEventListener('click', closeLightbox);

  // fechar com ESC
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lightbox.getAttribute('aria-hidden') === 'false') closeLightbox();
  });

  // permitir abrir imagem também clicando na imagem (caso queira)
  document.querySelectorAll('.case-img').forEach(img => {
    img.addEventListener('click', function () {
      const parentBtn = this.closest('.case-figure')?.querySelector('.view-btn');
      if (parentBtn) parentBtn.click();
    });
  });
})();

// ===== nav mobile safe close =====
(function () {
  const navToggle = document.getElementById('nav-toggle');
  const navList = document.getElementById('nav-list');

  if (!navToggle || !navList) return;

  navToggle.addEventListener('click', function () {
    const isOpen = navList.classList.toggle('show');
    this.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  // fecha ao clicar em qualquer link
  navList.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      if (navList.classList.contains('show')) {
        navList.classList.remove('show');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // remove inline widths/heights problemáticos (proteção)
  window.addEventListener('resize', () => {
    document.querySelectorAll('[style]').forEach(el => {
      const st = el.getAttribute('style') || '';
      // se algum elemento tiver width fixa em px, remover (só se for problemático)
      if (/width:\s*\d+px/.test(st) && el.classList.contains('hero-right')) {
        el.style.width = '';
      }
    });
  });
})();

/* NAV MOBILE - toggle + fechar ao clicar em link (robusto) */
(function () {
  const navToggle = document.getElementById('nav-toggle');
  const navList = document.getElementById('nav-list');
  if (!navToggle || !navList) return;

  function closeNav() {
    navList.classList.remove('show');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  navToggle.addEventListener('click', function (e) {
    const opened = navList.classList.toggle('show');
    this.setAttribute('aria-expanded', opened ? 'true' : 'false');
  });

  // fechar ao clicar em qualquer link do menu
  navList.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      if (navList.classList.contains('show')) closeNav();
    });
  });

  // fechar ao clicar fora (quando aberto)
  document.addEventListener('click', function (e) {
    if (!navList.classList.contains('show')) return;
    if (e.target.closest('#nav-list') || e.target.closest('#nav-toggle')) return;
    closeNav();
  });

  // prevenir estilos inline problemáticos em resize (proteção)
  window.addEventListener('resize', function () {
    if (window.innerWidth > 780 && navList.classList.contains('show')) {
      closeNav();
    }
  });
})();

/* ==========================
   ENVIAR FORMULÁRIO PARA WHATSAPP
   ========================== */
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("btn-whatsapp");
  const form = document.getElementById("contact-form");

  btn.addEventListener("click", () => {
    const name = form.querySelector("input[name='name']").value.trim();
    const phone = form.querySelector("input[name='phone']").value.trim();
    const message = form.querySelector("textarea[name='message']").value.trim();

    if (!name || !phone) {
      alert("Preencha pelo menos Nome e Telefone antes de enviar.");
      return;
    }

    // Número do WhatsApp da clínica (modifique aqui)
    const whatsappNumber = "5511999999999";

    // Mensagem formatada
    const text = `
Olá! Gostaria de agendar uma consulta.

 *Nome:* ${name}
 *Telefone:* ${phone}
 *Mensagem:* ${message || "—"}

Enviado através do site.`.trim();

    // Montar URL
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;

    // Abrir WhatsApp
    window.open(url, "_blank");
  });
});
