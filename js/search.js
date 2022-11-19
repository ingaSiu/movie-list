if(!localStorage.getItem('User')) {
    location.href = './index.html';
}

const logOut = document.querySelector('#log-out');

const searchForm = document.querySelector('#search-form');

let searchArr = [];

logOut.addEventListener('click', () => {
    localStorage.removeItem('User');
    location.href = './index.html';
})

searchForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const searchInput = event.target.elements.search.value;

    if (searchInput){
        let url = new URL('https://api.themoviedb.org/3/search/movie');

        const params = {
            api_key:"c02a236a02faf40ecbb1944497d71eff", 
            query: searchInput
        };

        url.search = new URLSearchParams(params).toString();

        fetch(url)
        .then((response) =>{
            if(response.ok) {
                return response.json();
            }
        })
        .then((searchResult) => {
            searchArr = searchResult.results;
            // renderSearch();
            console.log(searchResult.results);
        })
    }
})

const renderCard = (result) => {

} 

// renderSearch