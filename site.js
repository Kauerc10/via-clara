const amount = document.querySelector('#valor');
const currency = new Intl.NumberFormat('pt-BR', {style:'currency', currency:'BRL'});
amount.addEventListener('input', () => {
  const cents = Math.round(amount.valueAsNumber * 100);
  const valid = amount.validity.valid && Number.isSafeInteger(cents) && cents >= 0;
  const fee = Math.round(cents * .05);
  document.querySelector('#fee').textContent = valid ? currency.format(fee / 100) : '—';
  document.querySelector('#net').textContent = valid ? currency.format((cents - fee) / 100) : '—';
});
