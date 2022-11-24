if (!localStorage.getItem("User")) {
    location.href = "./index.html";
}

const logedInUser = JSON.parse(localStorage.getItem("User"));
const welcomeMessage = document.querySelector("#message");
welcomeMessage.textContent = `Welcome, ${logedInUser.name}!`;

let moviesArr = [];
const getMovies = (listId) => {
    fetch(`http://ingasiu.online/list-movies/${listId}`, {
        method: "GET",
        headers: {
            Authorization: "Bearer ozjjlUNIAtI2ThgwbYQvPUKZFHmNPdJqzv0gyT1i",
        },
    })
        .then((response) => {
            if (response.ok) {
                return response.json();
            }
        })
        .then((movies) => {
            if (movies) {
                moviesArr = movies;
                console.log(moviesArr);
                //CIA KVIESTI RENDER FUNKCIJA
            } else {
                alert("error");
            }
        });
};

getMovies(1);

const logOut = document.querySelector("#log-out");
logOut.addEventListener("click", () => {
    localStorage.removeItem("User");
    location.href = "./index.html";
});
