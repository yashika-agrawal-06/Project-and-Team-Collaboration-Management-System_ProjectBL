var nameInput = document.getElementById('name');
var emailInput = document.getElementById('s-email');

nameInput.value = readValue('cb_user_name') || '';
emailInput.value = readValue('cb_user_email') || '';

/**
 * Save the profile name and email. Called by validation.js after the form passes validation.
 * @param {HTMLFormElement} form
 */
function onFormValid(form) {
  var name = nameInput.value.trim();
  localStorage.setItem('cb_user_name', name);
  localStorage.setItem('cb_user_email', emailInput.value.trim());
  updateProfileDisplay();
  document.getElementById('save-message').textContent = 'Profile saved successfully';
}
