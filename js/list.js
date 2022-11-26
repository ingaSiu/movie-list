if (!localStorage.getItem("User")) {
    location.href = "./index.html";
}

//will try to use this for movie details page
//for xample movie.html?movie_id=9001
console.log(window.location.search);

const logedInUser = JSON.parse(localStorage.getItem("User"));
const welcomeMessage = document.querySelector("#message");
welcomeMessage.textContent = `Welcome, ${logedInUser.name}!`;

let moviesArr = [];
let listsArr = [];
const listWrapper = document.querySelector("#list-wrapper");
//passing id which will be used for btn-del to remove movie from list
const renderListCard = (movie, id) => {
    const wrapperListCard = document.createElement("div");
    wrapperListCard.setAttribute("class", "wrapper-list-card");

    const movieName = document.createElement("h3");
    movieName.textContent = movie.original_title;

    const imgContainer = document.createElement("div");
    imgContainer.setAttribute("class", "image-container");
    const moviePoster = document.createElement("img");
    moviePoster.setAttribute(
        "src",
        "https://image.tmdb.org/t/p/w500" + movie.poster_path
    );
    if (!movie.poster_path) {
        moviePoster.setAttribute("src", "images/dog_img.jpg");
    }
    imgContainer.appendChild(moviePoster);

    const btnMoreInfo = document.createElement("button");
    btnMoreInfo.textContent = "GET MORE INFO";
    //prideti on click funcionaluma

    const btnDelteCard = document.createElement("button");
    btnDelteCard.textContent = "DELETE MOVIE CARD";
    btnDelteCard.addEventListener("click", () => {
        //paimti id, pagal kuri reiks istrinti filma is listo
    });
    wrapperListCard.appendChild(movieName);
    wrapperListCard.appendChild(imgContainer);
    wrapperListCard.appendChild(btnMoreInfo);
    wrapperListCard.appendChild(btnDelteCard);
    listWrapper.append(wrapperListCard);
};

const renderMovieList = (movies) => {
    movies.forEach((movie) => {
        getMovieInfoAndRender(movie);
    });
};

const getMovieInfoAndRender = (movie) => {
    let url = new URL(`https://api.themoviedb.org/3/movie/${movie.movie_id}`);

    const params = {
        api_key: "c02a236a02faf40ecbb1944497d71eff",
    };

    url.search = new URLSearchParams(params).toString();

    fetch(url)
        .then((response) => {
            if (response.ok) {
                return response.json();
            }
        })
        .then((movieInfoResult) => {
            if (movieInfoResult) {
                renderListCard(movieInfoResult, movie.id);
            }
            console.log(movieInfoResult);
        });
};

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
                renderMovieList(moviesArr);
            } else {
                alert("error");
            }
        });
};

// getMovies(1);

const getListsAndMovies = () => {
    fetch(`http://ingasiu.online/user-lists/${logedInUser.id}`, {
        method: "GET",
        headers: {
            Authorization: "Bearer ozjjlUNIAtI2ThgwbYQvPUKZFHmNPdJqzv0gyT1i",
        },
    })
        .then((response) => {
            if (response.ok) {
                return response.json();
            }
            //if reponse is not ok and not 404 then something has failed.
            //return error and do nothing else
            alert("failed");
        })
        .then((lists) => {
            if (lists) {
                console.log(lists);
                getMovies(lists[0].id);
            }
        });
};
getListsAndMovies();
const logOut = document.querySelector("#log-out");
logOut.addEventListener("click", () => {
    localStorage.removeItem("User");
    location.href = "./index.html";
});
