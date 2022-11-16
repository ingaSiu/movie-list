const loginBox = document.querySelector('#log-in-box');
const loginForm = document.querySelector('#login-form');
const directToRegistration = document.querySelector('#click-to-register')

const registrationBox = document.querySelector('#registration-box');
const registrationForm = document.querySelector('#registration-form');
const alreadyMember = document.querySelector('#already-member');

directToRegistration.addEventListener('click', (event) => {
    event.preventDefault();
    registrationBox.style.display = 'block';
    loginBox.style.display = 'none';
})

alreadyMember.addEventListener('click', (event) => {
    event.preventDefault();
    registrationBox.style.display = 'none';
    loginBox.style.display = 'block';
})
