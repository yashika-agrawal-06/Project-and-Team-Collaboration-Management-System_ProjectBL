var nameInput = document.getElementById('name');
var emailInput = document.getElementById('s-email');

nameInput.value = localStorage.getItem('cb_user_name') || '';
emailInput.value = localStorage.getItem('cb_user_email') || '';

function onFormValid(form) {
  var name = nameInput.value.trim();
  localStorage.setItem('cb_user_name', name);
  localStorage.setItem('cb_user_email', emailInput.value.trim());
  if (typeof renderProfileDisplay === 'function') {
    renderProfileDisplay();
  }
  document.getElementById('save-message').textContent = 'Profile saved successfully';
}
