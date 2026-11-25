const amount = document.querySelector('#valor');
const currency = new Intl.NumberFormat('pt-BR', {style:'currency', currency:'BRL'});
const rate = document.querySelector('#rate');
function updateEstimate() {
  document.querySelector('#percent').textContent = rate.value + '%';
  const cents = Math.round(amount.valueAsNumber * 100);
  const valid = amount.validity.valid && Number.isSafeInteger(cents) && cents >= 0;
  const fee = Math.round(cents * Number(rate.value) / 100);
  document.querySelector('#fee').textContent = valid ? currency.format(fee / 100) : 'â€”';
  document.querySelector('#net').textContent = valid ? currency.format((cents - fee) / 100) : 'â€”';
}
amount.addEventListener('input', updateEstimate);
rate.addEventListener('change', updateEstimate);
document.querySelectorAll('[data-rate]').forEach(link => link.addEventListener('click', () => {
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
  contactUrl.searchParams.set('text', greeting + ' Tenho interesse na ' + rate.selectedOptions[0].textContent + '.' + (model ? ' Meu carro: ' + model : ''));
  contactLink.href = contactUrl.href;
}
vehicle.addEventListener('input', updateContact);
rate.addEventListener('change', updateContact);
updateContact();

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
