if (!localStorage.getItem("User")) {
    location.href = "./index.html";
}
const logedInUser = JSON.parse(localStorage.getItem("User"));
const welcomeMessage = document.querySelector("#message");
welcomeMessage.textContent = `Welcome, ${logedInUser.username}!`;

const logOut = document.querySelector("#log-out");

const searchForm = document.querySelector("#search-form");

const wrapperAllMovieCards = document.querySelector("#wrapper-of-all-cards");

let searchArr = [];

logOut.addEventListener("click", () => {
    localStorage.removeItem("User");
    location.href = "./index.html";
});

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

const renderSearchCard = (result) => {
    const wrapperMovieCard = document.createElement("div");
    wrapperMovieCard.setAttribute("class", "wrapper-movie-card");

    const imgContainer = document.createElement("div");
    imgContainer.setAttribute("class", "image-container");
    const moviePoster = document.createElement("img");
    moviePoster.setAttribute(
        "src",
        "https://image.tmdb.org/t/p/w500" + result.poster_path
    );
    if (!result.poster_path) {
        moviePoster.setAttribute("src", "images/dog_img.jpg");
    }
    imgContainer.appendChild(moviePoster);

    const detailsContainer = document.createElement("div");
    detailsContainer.setAttribute("class", "details-container");
    const movieTitle = document.createElement("h2");
    movieTitle.textContent = `${result.original_title}`;
    detailsContainer.appendChild(movieTitle);

    const releaseDate = document.createElement("p");
    releaseDate.textContent = `Movie release date: ${result.release_date}`;
    detailsContainer.appendChild(releaseDate);

    const overview = document.createElement("p");
    overview.textContent = `ABOUT: ${result.overview}`;
    detailsContainer.appendChild(overview);
    if (result.overview.length > 350) {
        overview.textContent = `ABOUT: ${result.overview.slice(0, 350)}...`;

        const btnMore = document.createElement("button");
        btnMore.textContent = "Read more...";
        btnMore.addEventListener("click", () => {
            if (overview.textContent.length > 361) {
                overview.textContent = `ABOUT: ${result.overview.slice(
                    0,
                    350
                )}...`;
                btnMore.textContent = "Read more...";
            } else {
                overview.textContent = `ABOUT: ${result.overview}`;
                btnMore.textContent = "Read less...";
            }
        });
        detailsContainer.append(btnMore);
    }

    const btnReview = document.createElement("button");
    btnReview.textContent = "GET REVIEWS";
    // btnReview.addEventListener('click', () => {
    // const reviewCard = document.createElement('div');
    // wrapperMovieCard.append(reviewCard);
    //ka daryti su review container, jis turi buti korteles viduj
    //     //pagetina reviews, kurie yra pridedami i atskira diva
    // })
    detailsContainer.appendChild(btnReview);

    const btnAddToList = document.createElement("button");
    btnAddToList.textContent = "ADD TO LIST";
    detailsContainer.appendChild(btnAddToList);
    // btnAddToList.addEventListener("click", () => {
    //     fetch('')
    //     .then((response) =>{
    //         if(response.ok) {
    //             return response.json();
    //         }
    //     })
    //     .then(()) => {

    //     }
    // });
    //     fetch('')
    //     .then((response) =>{
    //         if(response.ok) {
    //             return response.json();
    //         }
    //     })
    //     .then(()) => {

    //     }

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
