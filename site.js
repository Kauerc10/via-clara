const amount = document.querySelector('#valor');
const currency = new Intl.NumberFormat('pt-BR', {style:'currency', currency:'BRL'});
const rate = document.querySelector('#rate');
let selectedByVisitor = false;
function updateEstimate() {
  document.querySelector('#percent').textContent = rate.value + '%';
  const cents = Math.round(amount.valueAsNumber * 100);
  const valid = amount.validity.valid && Number.isSafeInteger(cents) && cents >= 0;
  const fee = Math.round(cents * Number(rate.value) / 100);
  document.querySelector('#fee').textContent = valid ? currency.format(fee / 100) : '—';
  document.querySelector('#net').textContent = valid ? currency.format((cents - fee) / 100) : '—';
}
amount.addEventListener('input', updateEstimate);
rate.addEventListener('change', updateEstimate);
document.querySelectorAll('[data-rate]').forEach(link => link.addEventListener('click', () => {
  selectedByVisitor = true;
  rate.value = link.dataset.rate;
  updateEstimate();
  updateContact();
}));

const vehicle = document.querySelector('#vehicle');
const contactLink = document.querySelector('#contato .btn');
const contactUrl = new URL(contactLink.href);
const greeting = contactUrl.searchParams.get('text');
function updateContact() {
  const model = vehicle.value.trim();
  contactUrl.searchParams.set('text', greeting + (selectedByVisitor ? ' Tenho interesse na ' + rate.selectedOptions[0].textContent + '.' : '') + (model ? ' Meu carro: ' + model : ''));
  contactLink.href = contactUrl.href;
  const simulation = new URL(contactUrl);
  simulation.searchParams.set('text', 'Olá! Simulei a ' + rate.selectedOptions[0].textContent + ' no site da Via Clara e gostaria de conversar.');
  document.querySelector('#sim-contact').href = simulation.href;
}
vehicle.addEventListener('input', updateContact);
rate.addEventListener('change', () => {
  selectedByVisitor = true;
  updateContact();
});
updateContact();

async function loadHighlights() {
  const section = document.querySelector('#vitrine');
  if (!section) return;
  try {
    const response = await fetch('/api/vitrine/destaques');
    if (!response.ok) return;
    const vehicles = await response.json();
    if (!Array.isArray(vehicles) || !vehicles.length) return;
    const { renderCard } = await import('/vitrine-render.mjs');
    section.querySelector('.vehicle-grid').innerHTML = vehicles.map(renderCard).join('');
    section.hidden = false;
  } catch { /* The institutional site remains available when inventory is offline. */ }
}
loadHighlights();
if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    }
  }, { threshold: 0.12 });
  document.querySelectorAll('.guide-grid article, .steps article, .calc').forEach(item => observer.observe(item));
}
