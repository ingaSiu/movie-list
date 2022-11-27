if (!localStorage.getItem("User")) {
    location.href = "./index.html";
}
const moviePageWrapper = document.querySelector(".moviepage-wrapper");
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

    const overview = document.createElement("p");
    overview.textContent = movie.overview;
    info.appendChild(overview);

    moviePageWrapper.appendChild(movieName);
    moviePageWrapper.appendChild(imgContainer);
    moviePageWrapper.appendChild(info);
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
const logOut = document.querySelector("#log-out");
logOut.addEventListener("click", () => {
    localStorage.removeItem("User");
    location.href = "./index.html";
});
