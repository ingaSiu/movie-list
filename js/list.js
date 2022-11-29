if (!localStorage.getItem("User")) {
    location.href = "./index.html";
}

//will try to use this for movie details page
//for xample movie.html?movie_id=9001
console.log(window.location.search);

const logedInUser = JSON.parse(localStorage.getItem("User"));
const welcomeMessage = document.querySelector("#message");
welcomeMessage.textContent = `Welcome, ${logedInUser.name}!`;

const emptyListMsg = document.querySelector("#empty-list-msg");

let moviesArr = [];
let listsArr = [];
const listWrapper = document.querySelector("#list-wrapper");
//passing id which will be used for btn-del to remove movie from list
const renderListCard = (movie, id) => {
    const wrapperListCard = document.createElement("div");
    wrapperListCard.setAttribute("class", "wrapper-list-card");

    const moviePoster = document.createElement("img");
    moviePoster.setAttribute(
        "src",
        "https://image.tmdb.org/t/p/w500" + movie.poster_path
    );
    if (!movie.poster_path) {
        moviePoster.setAttribute("src", "images/shiba.jpg");
    }

    const infoDiv = document.createElement("div");
    infoDiv.setAttribute("class", "info-div");

    const movieName = document.createElement("h1");
    movieName.textContent = movie.original_title;

    const btnMoreInfo = document.createElement("button");
    btnMoreInfo.textContent = "More Information";
    btnMoreInfo.setAttribute("class", "btn-card");

    const infoLink = document.createElement("a");
    infoLink.setAttribute("href", "./moviepage.html?movie_id=" + movie.id);
    infoLink.setAttribute("target", "_blank");
    infoLink.append(btnMoreInfo);

    const btnDelteCard = document.createElement("button");
    btnDelteCard.textContent = "Delete Movie Card";
    btnDelteCard.setAttribute("class", "btn-card");
    btnDelteCard.addEventListener("click", () => {
        fetch(`http://ingasiu.online/movie/${id}`, {
            method: "DELETE",
            headers: {
                Authorization:
                    "Bearer ozjjlUNIAtI2ThgwbYQvPUKZFHmNPdJqzv0gyT1i",
            },
        }).then((response) => {
            if (response.ok) {
                // alert("Movie was removed from list");
                // const deletionMessage = document.createElement("p");
                // deletionMessage.textContent = "Movie was deleted from the list";
                // listWrapper.prepend(deletionMessage);
                moviesArr = moviesArr.filter((movie) => {
                    if (id !== movie.id) {
                        return true;
                    }
                    return false;
                });
                renderMovieList(moviesArr);
                return;
            }
            //if reponse is not ok and not 404 then something has failed.
            //return error and do nothing else
            alert("failed to remove");
        });
    });

    wrapperListCard.appendChild(moviePoster);
    infoDiv.appendChild(movieName);
    infoDiv.appendChild(infoLink);
    infoDiv.appendChild(btnDelteCard);
    wrapperListCard.appendChild(infoDiv);
    listWrapper.append(wrapperListCard);
};

const renderMovieList = (movies) => {
    listWrapper.innerHTML = "";
    movies.forEach((movie) => {
        getMovieInfoAndRender(movie);
    });
};

const getMovieInfoAndRender = (movie) => {
    //on 1st get info is saved to this property so if i have it
    //i dont need to do a request to get it again. i can render straight away
    if (movie.movie_info) {
        renderListCard(movie.movie_info, movie.id);
        return;
    }
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
                //set movie info if it will be neeeded for later
                //would not want to request same movie again for no reason
                movie.movie_info = movieInfoResult;
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
                emptyListMsg.style.display = "block";
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
