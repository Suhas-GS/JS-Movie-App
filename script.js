const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const resultsDiv = document.getElementById('results');
const favoritesDiv = document.getElementById('favorites');

const BASE_URL = "http://www.omdbapi.com/"
const API_KEY = "d5829d49";

const searchMovies = async(query)=>{
    try {
        const response = await fetch(`${BASE_URL}?apikey=${API_KEY}&s=${query}`);
        if (!response.ok) {
            throw new Error("HTTP Error: ",response.status);
        }
        const data = await response.json();
        return data.Search || [];
    } catch (error) {
        console.error("Error: ",error);
    }
}

const renderMovies = (movies)=>{
    resultsDiv.innerHTML="";
    movies.forEach((movie)=>{
        const card = document.createElement('div');
        card.innerHTML=`
        <img src="${movie.Poster}" alt="poster width="100px">
        <h3>${movie.Title} (${movie.Year}) </h3>
        <button onclick="addToFavorites('${movie.imdbID}','${movie.Title}','${movie.Year}','${movie.Poster}')">Add To Favorites</button>
        `;
        resultsDiv.appendChild(card);
    });
}

searchBtn.addEventListener('click',async()=>{
    const query = searchInput.value;
    const movies = await searchMovies(query);
    renderMovies(movies);
});

// Favorites

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

const saveFavorites = ()=>{
    localStorage.setItem("favorites",JSON.stringify(favorites));
};

const renderFavorites = ()=>{
    favoritesDiv.innerHTML="";
    favorites.forEach((movie)=>{
        const card = document.createElement('div');
        card.innerHTML=`
        <img src="${movie.poster}" alt="poster">
        <h3>${movie.title} (${movie.year})</h3>
        <button onclick="removeFavorites('${movie.id}')">Remove</button>
        `;
        favoritesDiv.appendChild(card);
    });
}

const addToFavorites = (id,title,year,poster)=>{
    if (!favorites.find(m=>m.id===id)) {
        favorites.push({id,title,year,poster});
        saveFavorites();
        renderFavorites();
    }
}

const removeFavorites= (id)=>{
    favorites = favorites.filter(m=>m.id !== id);
    saveFavorites();
    renderFavorites();
}

renderFavorites();

