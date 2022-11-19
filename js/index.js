const btnJoin = document.querySelector('#join');

if(localStorage.getItem('User')) {
    location.href = './search.html';
}


btnJoin.addEventListener('click', () => {
    location.href = './login.html';
})