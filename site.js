const amount = document.querySelector('#valor');
const currency = new Intl.NumberFormat('pt-BR', {style:'currency', currency:'BRL'});
amount.addEventListener('input', () => {
  const cents = Math.round(amount.valueAsNumber * 100);
  const valid = amount.validity.valid && Number.isSafeInteger(cents) && cents >= 0;
  const fee = Math.round(cents * .05);
  document.querySelector('#fee').textContent = valid ? currency.format(fee / 100) : '—';
  document.querySelector('#net').textContent = valid ? currency.format((cents - fee) / 100) : '—';
});

const vehicle = document.querySelector('#vehicle');
const contactLink = document.querySelector('#contato .btn');
const contactUrl = new URL(contactLink.href);
const greeting = contactUrl.searchParams.get('text');
vehicle.addEventListener('input', () => {
  const model = vehicle.value.trim();
  contactUrl.searchParams.set('text', model ? greeting + ' Meu carro: ' + model : greeting);
  contactLink.href = contactUrl.href;
});

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
