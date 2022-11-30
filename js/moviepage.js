if (!localStorage.getItem("User")) {
    location.href = "./index.html";
}

const logedInUser = JSON.parse(localStorage.getItem("User"));
const welcomeMessage = document.querySelector("#message");
welcomeMessage.textContent = `Welcome, ${logedInUser.name}!`;

const moviePageWrapper = document.querySelector(".moviepage-wrapper");
const movieBlock = document.querySelector("#movie-info-block");

let reviewArr = [];
const reviewsWrapper = document.querySelector(".reviews-wrapper");
const reviews = document.querySelector("#reviews");
const noReviews = document.querySelector("#no-reviews");

let movieId;
//some parsing stuff for get params from URL
//i am using movie_id get param to know which movie info to show
//might be usefull in future
if (window.location.search) {
    let searchParams = new URLSearchParams(window.location.search);
    movieId = parseInt(searchParams.get("movie_id"), 10);
}
console.log(movieId);

const renderMovieInfo = (movie) => {
    const movieName = document.createElement("h1");
    movieName.textContent = movie.original_title;

    const imgContainer = document.createElement("div");
    imgContainer.setAttribute("class", "movie-poster");
    const moviePoster = document.createElement("img");
    moviePoster.setAttribute(
        "src",
        "https://image.tmdb.org/t/p/w500" + movie.poster_path
    );
    if (!movie.poster_path) {
        moviePoster.setAttribute("src", "images/dog_img.jpg");
    }
    imgContainer.appendChild(moviePoster);

    const info = document.createElement("div");
    info.setAttribute("class", "info-div");

    const engTitle = document.createElement("p");
    engTitle.textContent = `ENGLISH TITLE: ${movie.title}`;
    info.appendChild(engTitle);

    const overview = document.createElement("p");
    overview.textContent = `ABOUT: ${movie.overview}`;
    info.appendChild(overview);

    const releaseDate = document.createElement("p");
    releaseDate.textContent = `RELEASE DATE: ${movie.release_date}`;
    info.append(releaseDate);

    const runtime = document.createElement("p");
    runtime.textContent = `RUNTIME: ${movie.runtime} min.`;
    info.appendChild(runtime);

    const vote = document.createElement("p");
    vote.textContent = `VOTE AVERAGE: ${movie.vote_average} (from ${movie.vote_count} voters)`;
    info.appendChild(vote);

    const budget = document.createElement("p");
    budget.textContent = `BUDGET: ${movie.budget}$`;
    info.appendChild(budget);

    const imdbBtn = document.createElement("button");
    imdbBtn.textContent = " More Information on IMDb";
    imdbBtn.setAttribute("class", "btn-imdb");
    info.appendChild(imdbBtn);
    imdbBtn.addEventListener("click", () => {
        let url = new URL(
            `https://api.themoviedb.org/3/movie/${movieId}/external_ids`
        );

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
            .then((result) => {
                if (result) {
                    console.log(result);
                    window.open(
                        "https://www.imdb.com/title/" + result.imdb_id,
                        "_blank"
                    );
                }
            });
    });

    movieBlock.appendChild(imgContainer);
    movieBlock.appendChild(info);
    moviePageWrapper.appendChild(movieName);
    moviePageWrapper.appendChild(movieBlock);
};

const getMovieAndRender = (movieId) => {
    let url = new URL(`https://api.themoviedb.org/3/movie/${movieId}`);

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
        .then((movie) => {
            if (movie) {
                renderMovieInfo(movie);
                console.log(movie);
            }
        });
};
getMovieAndRender(movieId);

const renderReview = (review) => {
    const reviewBox = document.createElement("div");
    reviewBox.setAttribute("class", "review-box");

    const author = document.createElement("p");
    author.textContent = `REVIEW AUTHOR: ${review.author}`;
    reviewBox.appendChild(author);

    const content = document.createElement("p");
    content.setAttribute("class", "review-text");
    content.textContent = review.content;
    reviewBox.appendChild(content);

    if (review.content.length > 350) {
        content.textContent = `REVIEW: ${review.content.slice(0, 350)}...`;

        const btnMore = document.createElement("button");
        btnMore.textContent = "Read more...";
        btnMore.setAttribute("class", "btn-card");
        btnMore.addEventListener("click", () => {
            if (content.textContent.length > 361) {
                content.textContent = `REVIEW: ${review.content.slice(
                    0,
                    350
                )}...`;
                btnMore.textContent = "Read more...";
            } else {
                content.textContent = `REVIEW: ${review.content}`;
                btnMore.textContent = "Read less...";
            }
        });
        reviewBox.append(btnMore);
    }
    reviews.appendChild(reviewBox);
    reviewsWrapper.appendChild(reviews);
};

const renderAllReviews = (reviews) => {
    reviews.forEach((review) => {
        renderReview(review);
    });
};

const getReviews = (movieId) => {
    let url = new URL(`https://api.themoviedb.org/3/movie/${movieId}/reviews`);

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
        .then((reviews) => {
            if (reviews && reviews.results.length > 0) {
                console.log(reviews.results);
                reviewArr = reviews.results;
                console.log(reviewArr);
                renderAllReviews(reviewArr);
            } else {
                noReviews.style.display = "block";
            }
        });
};
getReviews(movieId);

const logOut = document.querySelector("#log-out");
logOut.addEventListener("click", () => {
    localStorage.removeItem("User");
    location.href = "./index.html";
});
