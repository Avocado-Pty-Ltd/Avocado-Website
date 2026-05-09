/* ==========================================================================
   Avocado — Audit Modal (vanilla)
   Drop-in for static subpages. Anchors any element with [data-audit-trigger]
   to open the modal. Submits to the existing Google Sheets endpoint.
   ========================================================================== */
(function () {
  'use strict';

  var ENDPOINT = 'https://script.google.com/macros/s/AKfycbxH3ufXbJid0j20ZjRH8mbwXt_8VUg36YyNMAHYvnA6_170EzmKKT11e3C9yot_HC9JDw/exec';

  var TECH_STACK = [
    { value: 'spreadsheets', label: 'Spreadsheets (Excel/Google Sheets)' },
    { value: 'accounting',   label: 'Accounting software (Xero, MYOB, QuickBooks)' },
    { value: 'crm',          label: 'CRM (HubSpot, Salesforce, etc.)' },
    { value: 'pm',           label: 'Project management tools' },
    { value: 'industry',     label: 'Industry-specific software' },
    { value: 'paper',        label: 'Mostly paper-based / minimal tech' },
  ];

  var root = null;
  var formEl = null;
  var submitBtn = null;
  var idleHTML = 'Book my free audit <span class="arrow">→</span>';

  function buildMarkup() {
    var checks = TECH_STACK.map(function (opt) {
      return (
        '<label class="audit-check">'
        + '<input type="checkbox" name="tech_stack" value="' + opt.value + '"/>'
        + '<span>' + opt.label + '</span>'
        + '</label>'
      );
    }).join('');
    return ''
      + '<div class="audit-modal-overlay" data-audit-close="1"></div>'
      + '<div class="audit-modal-panel" role="dialog" aria-modal="true" aria-labelledby="audit-modal-title">'
      +   '<button type="button" class="audit-modal-close" aria-label="Close" data-audit-close="1">×</button>'
      +   '<span class="eyebrow">— Free tech audit</span>'
      +   '<h3 id="audit-modal-title" class="audit-modal-title">A 30-minute call,<br/><em class="serif-italic">no pitch.</em></h3>'
      +   '<p class="audit-modal-lede">Answer a few quick questions so we can prepare. We\'ll write back within two working days with a time and a short brief.</p>'
      +   '<form class="audit-form" novalidate>'
      +     '<div class="audit-field">'
      +       '<label for="audit-email"><span class="eyebrow">Email</span></label>'
      +       '<input id="audit-email" name="email" type="email" required placeholder="you@yourbusiness.com.au"/>'
      +     '</div>'
      +     '<div class="audit-field">'
      +       '<label for="audit-size"><span class="eyebrow">Business size</span></label>'
      +       '<select id="audit-size" name="business_size" required>'
      +         '<option value="" disabled selected>Select team size…</option>'
      +         '<option value="solo">Just me (solo operator)</option>'
      +         '<option value="2-5">2–5 employees</option>'
      +         '<option value="6-20">6–20 employees</option>'
      +         '<option value="20+">20+ employees</option>'
      +       '</select>'
      +     '</div>'
      +     '<div class="audit-field">'
      +       '<span class="eyebrow">Current tech stack</span>'
      +       '<div class="audit-checkboxes">' + checks + '</div>'
      +     '</div>'
      +     '<div class="audit-field">'
      +       '<label for="audit-tasks"><span class="eyebrow">Time-consuming manual tasks</span></label>'
      +       '<textarea id="audit-tasks" name="manual_tasks" rows="3" required placeholder="Data entry, invoicing, scheduling, follow-ups…"></textarea>'
      +     '</div>'
      +     '<div class="audit-field">'
      +       '<label for="audit-budget"><span class="eyebrow">Tech budget</span></label>'
      +       '<select id="audit-budget" name="tech_budget" required>'
      +         '<option value="" disabled selected>Select budget range…</option>'
      +         '<option value="100-200">$100–200 / month</option>'
      +         '<option value="200-400">$200–400 / month</option>'
      +         '<option value="400-1000">$400–1,000 / month</option>'
      +         '<option value="1000+">$1,000+ / month</option>'
      +       '</select>'
      +     '</div>'
      +     '<button type="submit" class="btn btn-primary audit-submit">' + idleHTML + '</button>'
      +   '</form>'
      + '</div>';
  }

  function ensure() {
    if (root) return root;
    root = document.createElement('div');
    root.className = 'audit-modal-root';
    root.style.display = 'none';
    root.innerHTML = buildMarkup();
    document.body.appendChild(root);

    formEl = root.querySelector('.audit-form');
    submitBtn = root.querySelector('.audit-submit');

    root.addEventListener('click', function (e) {
      if (e.target.closest('[data-audit-close]')) close();
    });
    root.querySelectorAll('.audit-check input').forEach(function (cb) {
      cb.addEventListener('change', function () {
        cb.closest('.audit-check').classList.toggle('on', cb.checked);
      });
    });
    formEl.addEventListener('submit', onSubmit);

    return root;
  }

  function open() {
    ensure();
    root.style.display = 'grid';
    document.body.style.overflow = 'hidden';
    setTimeout(function () { root.querySelector('#audit-email').focus(); }, 60);
  }

  function close() {
    if (!root) return;
    root.style.display = 'none';
    document.body.style.overflow = '';
  }

  function setBtn(html, disabled) {
    submitBtn.innerHTML = html;
    submitBtn.disabled = !!disabled;
  }

  function onSubmit(e) {
    e.preventDefault();
    setBtn('Submitting…', true);

    var data = {
      form_type: 'audit',
      email: formEl.querySelector('#audit-email').value,
      business_size: formEl.querySelector('#audit-size').value,
      tech_stack: Array.prototype.map.call(
        formEl.querySelectorAll('input[name="tech_stack"]:checked'),
        function (cb) { return cb.value; }
      ).join(', '),
      manual_tasks: formEl.querySelector('#audit-tasks').value,
      tech_budget: formEl.querySelector('#audit-budget').value,
    };

    fetch(ENDPOINT, { method: 'POST', mode: 'no-cors', body: JSON.stringify(data) })
      .then(function () {
        setBtn("Thanks — we'll be in touch ✓", true);
        setTimeout(function () {
          close();
          formEl.reset();
          root.querySelectorAll('.audit-check.on').forEach(function (l) { l.classList.remove('on'); });
          setBtn(idleHTML, false);
        }, 2200);
      })
      .catch(function (err) {
        console.error('Audit submit failed', err);
        setBtn('Error — please try again', false);
        setTimeout(function () { setBtn(idleHTML, false); }, 3000);
      });
  }

  document.addEventListener('click', function (e) {
    var trigger = e.target.closest('[data-audit-trigger]');
    if (trigger) {
      e.preventDefault();
      open();
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && root && root.style.display === 'grid') close();
  });

  window.AvocadoAudit = { open: open, close: close };
})();
