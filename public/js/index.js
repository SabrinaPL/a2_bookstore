document.addEventListener('DOMContentLoaded', () => {
  // Initiate the password UX for the registration.
  const passwordInput = document.querySelector('#password')

  const passwordStrength = document.querySelector('hr')

  passwordInput.addEventListener('input', () => {
    const passwordLength = passwordInput.value.length

    // Remove all existing classes.
    passwordStrength.classList.remove('password-ux-default', 'password-ux-red', 'password-ux-green', 'password-ux-yellow')

    // Add apropriate class depending on the current length of the password (to improve UX).
    if (passwordLength <= 0) {
      passwordStrength.classList.add('password-ux-default')
    } else if (passwordLength < 5) {
      passwordStrength.classList.add('password-ux-red')
    } else if (passwordLength >= 5 && passwordLength < 10) {
      passwordStrength.classList.add('password-ux-yellow')
    } else if (passwordLength >= 10) {
      passwordStrength.classList.add('password-ux-green')
    }
  })
})
