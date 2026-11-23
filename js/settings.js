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
  var nameSaved = saveValue('cb_user_name', name);
  var emailSaved = saveValue('cb_user_email', emailInput.value.trim());
  var saveMessage = document.getElementById('save-message');

  if (!nameSaved || !emailSaved) {
    saveMessage.className = 'form-error';
    saveMessage.textContent = 'Could not save your profile. Please try again.';
    return;
  }

  renderProfileDisplay();
  saveMessage.className = 'form-success';
  saveMessage.textContent = 'Profile saved successfully';
}
