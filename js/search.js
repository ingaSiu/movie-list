if (!localStorage.getItem("User")) {
    location.href = "./index.html";
}
const logedInUser = JSON.parse(localStorage.getItem("User"));
const welcomeMessage = document.querySelector("#message");
welcomeMessage.textContent = `Welcome, ${logedInUser.name}!`;
console.log(window.location.search);
const logOut = document.querySelector("#log-out");

const searchForm = document.querySelector("#search-form");
const delSearch = document.querySelector("#btn-del-search");
const wrapperAllMovieCards = document.querySelector("#wrapper-of-all-cards");

let searchArr = [];

logOut.addEventListener("click", () => {
    localStorage.removeItem("User");
    location.href = "./index.html";
});

// const searchInput = document.querySelector("#search-input");
// delSearch.addEventListener("click", () => {
//     searchInput.value = "";
// });

searchForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const searchInput = event.target.elements.search.value;

    if (searchInput) {
        let url = new URL("https://api.themoviedb.org/3/search/movie");

        const params = {
            api_key: "c02a236a02faf40ecbb1944497d71eff",
            query: searchInput,
        };

        url.search = new URLSearchParams(params).toString();

        fetch(url)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
            })
            .then((searchResult) => {
                searchArr = searchResult.results;
                renderAllSearch(searchArr);
                console.log(searchResult.results);
            });
    }
});

const saveMovie = (movieId, listId) => {
    fetch("http://ingasiu.online/movie", {
        method: "POST",
        headers: {
            Authorization: "Bearer ozjjlUNIAtI2ThgwbYQvPUKZFHmNPdJqzv0gyT1i",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            movie_id: movieId,
            list_id: listId,
        }),
    })
        .then((response) => {
            if (response.ok) {
                return response.json();
            }
        })
        .then((listMovie) => {
            if (!listMovie) {
                alert("failed");
                return;
            }

            console.log("added to list");
        });
};

//"name" is name of the list
const saveListAndSaveMovie = (name, movieId) => {
    fetch("http://ingasiu.online/list", {
        method: "POST",
        headers: {
            Authorization: "Bearer ozjjlUNIAtI2ThgwbYQvPUKZFHmNPdJqzv0gyT1i",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: name,
            user_id: logedInUser.id,
        }),
    })
        .then((response) => {
            if (response.ok) {
                return response.json();
            }
        })
        .then((list) => {
            if (!list) {
                alert("failed");
                return;
            }
            saveMovie(movieId, list.id);
        });
};

const addMovieToList = (movieId) => {
    fetch(`http://ingasiu.online/user-lists/${logedInUser.id}`, {
        method: "GET",
        headers: {
            Authorization: "Bearer ozjjlUNIAtI2ThgwbYQvPUKZFHmNPdJqzv0gyT1i",
        },
    })
        .then((response) => {
            //if got the lists return them to other 'then'
            if (response.ok) {
                return response.json();
            }
            //if no lists found - create new list and save movie to that list
            if (response.status === 404) {
                saveListAndSaveMovie("My List", movieId);
                return;
            }
            //if reponse is not ok and not 404 then something has failed.
            //return error and do nothing else
            alert("failed");
        })
        .then((lists) => {
            //if response was ok and lists were found then save movie to
            //first found list. lists var might be empty if get failed
            if (lists) {
                saveMovie(movieId, lists[0].id);
            }
        });
};

const renderSearchCard = (movie) => {
    const wrapperMovieCard = document.createElement("div");
    wrapperMovieCard.setAttribute("class", "wrapper-movie-card");

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

    const detailsContainer = document.createElement("div");
    detailsContainer.setAttribute("class", "details-container");
    const movieTitle = document.createElement("h3");
    movieTitle.textContent = `${movie.original_title}`;
    detailsContainer.appendChild(movieTitle);

    const releaseDate = document.createElement("p");
    releaseDate.textContent = `Movie release date: ${movie.release_date}`;
    detailsContainer.appendChild(releaseDate);

    const overview = document.createElement("p");
    overview.textContent = `ABOUT: ${movie.overview}`;
    detailsContainer.appendChild(overview);
    if (movie.overview.length > 300) {
        overview.textContent = `ABOUT: ${movie.overview.slice(0, 300)}...`;

        const btnMore = document.createElement("button");
        btnMore.textContent = "Read more...";
        btnMore.setAttribute("class", "btn-card");
        btnMore.addEventListener("click", () => {
            if (overview.textContent.length > 310) {
                overview.textContent = `ABOUT: ${movie.overview.slice(
                    0,
                    300
                )}...`;
                btnMore.textContent = "Read more...";
            } else {
                overview.textContent = `ABOUT: ${movie.overview}`;
                btnMore.textContent = "Read less...";
            }
        });
        detailsContainer.append(btnMore);
    }

    const btnMoreInfo = document.createElement("button");
    btnMoreInfo.textContent = "More Information";
    btnMoreInfo.setAttribute("class", "btn-card");
    const infoLink = document.createElement("a");
    infoLink.setAttribute("href", "./moviepage.html?movie_id=" + movie.id);
    infoLink.setAttribute("target", "_blank");
    infoLink.appendChild(btnMoreInfo);
    detailsContainer.appendChild(infoLink);

    const btnAddToList = document.createElement("button");
    btnAddToList.textContent = "Add to List";
    btnAddToList.setAttribute("class", "btn-card");
    btnAddToList.addEventListener("click", () => {
        addMovieToList(movie.id);
        addedToList.style.display = "block";
    });

    const addedToList = document.createElement("p");
    addedToList.textContent = "Succesfully added to list";
    addedToList.style.display = "none";

    detailsContainer.appendChild(btnAddToList);
    detailsContainer.appendChild(addedToList);
    wrapperMovieCard.appendChild(imgContainer);
    wrapperMovieCard.appendChild(detailsContainer);

    return wrapperMovieCard;
};

const renderAllSearch = (searchArr) => {
    wrapperAllMovieCards.innerHTML = "";
    searchArr.forEach((result) => {
        wrapperAllMovieCards.append(renderSearchCard(result));
    });
};
