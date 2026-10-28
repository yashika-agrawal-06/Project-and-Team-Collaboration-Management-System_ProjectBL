function showError(input, message) {
  const err = input.parentElement.querySelector('.form-error');
  if (err) err.textContent = message;
  input.classList.toggle('input--invalid', Boolean(message));
}

function validateField(input) {
  const v = input.value.trim();
  if (input.required && !v) return showError(input, 'This field is required'), false;
  if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))
    return showError(input, 'Enter a valid email'), false;
  if (input.type === 'password' && v.length < 6)
    return showError(input, 'Minimum 6 characters'), false;
  showError(input, '');
  return true;
}

document.querySelectorAll('form[data-validate]').forEach((form) => {
  const fields = form.querySelectorAll('input[required]');
  fields.forEach((f) => f.addEventListener('input', () => validateField(f)));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const ok = [...fields].map(validateField).every(Boolean);
    if (ok) {
      const next = form.dataset.redirect;
      if (next) window.location.href = next;
      else alert('Saved successfully');
    }
  });
});
