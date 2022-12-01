const loginBox = document.querySelector("#log-in-box");
const loginForm = document.querySelector("#login-form");
const directToRegistration = document.querySelector("#click-to-register");
const failLogMessage = document.querySelector("#fail-log");

const registrationBox = document.querySelector("#registration-box");
const registrationForm = document.querySelector("#registration-form");
const alreadyMember = document.querySelector("#already-member");
const failPswMessage = document.querySelector("#fail-psw");
const registrationOk = document.querySelector("#registration-ok");

directToRegistration.addEventListener("click", () => {
    registrationBox.style.display = "block";
    loginBox.style.display = "none";
});

alreadyMember.addEventListener("click", () => {
    registrationBox.style.display = "none";
    loginBox.style.display = "block";
});

if (localStorage.getItem("User")) {
    location.href = "./search.html";
}

registrationForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = event.target.elements.email.value;
    const username = event.target.elements.username.value;
    const password = event.target.elements.password.value;
    const repeatPsw = event.target.elements.repeatPassword.value;

    if (password === repeatPsw) {
        fetch("http://ingasiu.online/user", {
            method: "POST",
            headers: {
                Authorization:
                    "Bearer ozjjlUNIAtI2ThgwbYQvPUKZFHmNPdJqzv0gyT1i",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                name: username,
                password: password,
            }),
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                if (response.status === 409) {
                    alert("User already exists");
                    return;
                }
                alert("registration failed");
            })
            .then((result) => {
                if (result) {
                    registrationOk.style.display = "block";
                    failPswMessage.style.display = "none";
                }
            });
    } else {
        failPswMessage.style.display = "block";
    }
});

loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = event.target.elements.email.value;
    const password = event.target.elements.password.value;
    fetch("http://ingasiu.online/authenticate", {
        method: "POST",
        headers: {
            Authorization: "Bearer ozjjlUNIAtI2ThgwbYQvPUKZFHmNPdJqzv0gyT1i",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: email,
            password: password,
        }),
    })
        .then((response) => {
            if (response.ok) {
                return response.json();
            }
        })
        .then((user) => {
            //user loged in
            if (user) {
                localStorage.setItem("User", JSON.stringify(user));
                location.href = "./search.html";
            } else {
                failLogMessage.style.display = "block";
            }
        });
});
