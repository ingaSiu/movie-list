const loginBox = document.querySelector('#log-in-box');
const loginForm = document.querySelector('#login-form');
const directToRegistration = document.querySelector('#click-to-register')
const failLogMessage = document.querySelector('#fail-log');


const registrationBox = document.querySelector('#registration-box');
const registrationForm = document.querySelector('#registration-form');
const alreadyMember = document.querySelector('#already-member');
const failPswMessage = document.querySelector('#fail-psw');
const registrationOk = document.querySelector('#registration-ok');

let userArr = [];

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

if(localStorage.getItem('User')) {
    location.href = './search.html';
}

fetch('https://testapi.io/api/inga/resource/users')
.then((response) =>{
    if(response.ok) {
        return response.json();
    }
})
.then((result) => {
    userArr = result.data;
    console.log(userArr);
});


registrationForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = event.target.elements.email.value;
    const username = event.target.elements.username.value;
    const password = event.target.elements.password.value;
    const repeatPsw = event.target.elements.repeatPassword.value;

    if(password === repeatPsw) {
             
        fetch('	https://testapi.io/api/inga/resource/users',
        {   method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                username: username,
                password: password
            })
        })
        .then((response) =>{
            if(response.ok) {
                return response.json();
            }
        })
        .then((result) => {
            userArr.push(result);
            console.log(userArr);
            registrationOk.style.display = 'block';
            failPswMessage.style.display = 'none';
            // location.reload();
        })
    
    } else{
        failPswMessage.style.display = 'block';
    }

})



loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = event.target.elements.email.value;
    const password = event.target.elements.password.value;
    const filteredUsers = userArr.filter((user) => {
        if(user.email === email && user.password === password) {
            return true;
        }
        return false;
    })
    //user loged in
    if(filteredUsers[0]) {
        localStorage.setItem('User', JSON.stringify(filteredUsers[0]));
        //REDIRECT TO SEARCH WHEN USER LOGGED IN
        location.href = './search.html';
    } else {
        failLogMessage.style.display = 'block';
    }
})