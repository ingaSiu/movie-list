if (!localStorage.getItem("User")) {
    location.href = "./index.html";
}

const logedInUser = JSON.parse(localStorage.getItem("User"));
const welcomeMessage = document.querySelector("#message");
welcomeMessage.textContent = `Welcome, ${logedInUser.username}!`;

const logOut = document.querySelector("#log-out");
logOut.addEventListener("click", () => {
    localStorage.removeItem("User");
    location.href = "./index.html";
});
