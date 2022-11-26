if (!localStorage.getItem("User")) {
    location.href = "./index.html";
}
const logOut = document.querySelector("#log-out");
logOut.addEventListener("click", () => {
    localStorage.removeItem("User");
    location.href = "./index.html";
});
