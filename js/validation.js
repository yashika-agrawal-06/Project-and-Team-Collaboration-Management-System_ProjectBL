function showError(input, message) {
  var error = input.parentElement.querySelector('.form-error');
  if (error) {
    error.textContent = message;
  }
  if (message) {
    input.classList.add('input--invalid');
  } else {
    input.classList.remove('input--invalid');
  }
}

function validateField(input) {
  var value = input.value.trim();

  if (value === '') {
    if (input.required) {
      showError(input, 'This field is required');
      return false;
    }
    showError(input, '');
    return true;
  }

  if (input.type === 'email') {
    var at = value.indexOf('@');
    var dot = value.lastIndexOf('.');
    if (at < 1 || dot < at + 2 || dot === value.length - 1) {
      showError(input, 'Enter a valid email');
      return false;
    }
  }

  if (input.type === 'password' && value.length < 6) {
    showError(input, 'Minimum 6 characters');
    return false;
  }

  showError(input, '');
  return true;
}

function setupForm(form) {
  var fields = form.querySelectorAll('input');

  for (var i = 0; i < fields.length; i++) {
    fields[i].addEventListener('input', function () {
      validateField(this);
    });
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var allValid = true;

    for (var j = 0; j < fields.length; j++) {
      if (!validateField(fields[j])) {
        allValid = false;
      }
    }
    if (!allValid) {
      return;
    }

    var redirect = form.getAttribute('data-redirect');
    if (redirect) {
      window.location.href = redirect;
    } else if (typeof onFormValid === 'function') {
      onFormValid(form);
    }
  });
}

var forms = document.querySelectorAll('form[data-validate]');
for (var f = 0; f < forms.length; f++) {
  setupForm(forms[f]);
}
