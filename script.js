
// Initializations and Declarations
const searchForm = document.querySelector('.app-body-search');
let searchList = document.getElementById('search-list');
let activeTab = 1, allData;

// function to create MD5 hash from crypto JS.
function generateMD5Hash(data) {
    return CryptoJS.MD5(data).toString();
}

//my keys
const publicKey = "e2063f4c519b245c8d0f25ac565863d2";
const privateKey = "f53513a8c5e922ffd06cff587fb12b6fd308fb7d";
const ts = Math.floor(new Date().getTime() / 1000);
const hashString = ts + privateKey + publicKey;
const hashValue = generateMD5Hash(hashString);

//fetch data from Marvel API
const fetchAllSuperHero = async(searchText) => {
    
    let hashValue = generateMD5Hash(ts + privateKey + publicKey);
    var URL = "";
    //working URL
    if(searchText == null)
        URL = `https://gateway.marvel.com:443/v1/public/characters?ts=${ts}&apikey=${publicKey}&hash=${hashValue}`;                                                  
    else
        URL = `https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=${searchText}&ts=${ts}&apikey=${publicKey}&hash=${hashValue}`;

    try{
        const response = await fetch(URL);
        allData = await response.json();
        var responseData = allData.data.results;
        if(searchText == null)
            return responseData;
        else
            showSearchList(responseData);
    } catch(error){
        console.error(error);
        return null;
    }
}

// create super hero card with name and its image
function createSuperHeroCard(superHero) {
    const cardContainer = document.getElementById('superHeroContainer');

    const card = document.createElement('div');
    card.classList.add('card');

    const image = document.createElement('img');
    image.classList.add('super-hero-image');
    const imageUrl = superHero.thumbnail.path + '.' + superHero.thumbnail.extension;
    image.src = imageUrl;
    image.alt = `${superHero.name} Image`;

    const name = document.createElement('h3');
    name.classList.add('super-hero-name');
    name.textContent = superHero.name;

    const addButton = document.createElement('button');
    addButton.classList.add('add-to-favorites-button');

    // Check if the superhero is already in favorites and set the button text accordingly
    const favorites = getFavoritesFromStorage();
    if (favorites.includes(superHero.id.toString())) {
        addButton.textContent = 'Remove from Favorites';
    } else {
        addButton.textContent = 'Add to Favorites';
    }

    addButton.addEventListener('click', function(event) {
        event.stopPropagation();
        toggleFavorites(superHero, addButton);
    });

    // Add an event listener to redirect to details.html with the superhero's ID as a request parameter
    card.addEventListener('click', function() {
        window.location.href = `details.html?id=${superHero.id}`;
    });

    card.appendChild(image);
    card.appendChild(name);
    card.appendChild(addButton);

    cardContainer.appendChild(card);
}

// Function to handle toggling favorites and updating the button text
function toggleFavorites(superHero, addButton) {
    const favorites = getFavoritesFromStorage();
    const index = favorites.indexOf(superHero.id.toString());

    if (index !== -1) {
        // Superhero is already in favorites, remove it
        favorites.splice(index, 1);
    } else {
        // Superhero is not in favorites, add it
        favorites.push(superHero.id.toString());
    }

    // Update the button text
    // const addButton = document.querySelector('.add-to-favorites-button');
    if (index !== -1) {
        addButton.textContent = 'Add to Favorites';
    } else {
        addButton.textContent = 'Remove from Favorites';
    }

    // Save the updated favorites list to local storage
    saveFavoritesToStorage(favorites);
}

// Function to retrieve favorites from local storage
function getFavoritesFromStorage() {
    const favoritesJSON = localStorage.getItem('favorites');
    return favoritesJSON ? JSON.parse(favoritesJSON) : [];
}

// Function to save favorites to local storage
function saveFavoritesToStorage(favorites) {
    const favoritesJSON = JSON.stringify(favorites);
    localStorage.setItem('favorites', favoritesJSON);
}

// Function to render superhero cards based on API data
async function renderSuperHeroCards() {
    const superHeroesData = await fetchAllSuperHero(null);
    // Check if data is available
    if (superHeroesData && Array.isArray(superHeroesData)) {
        superHeroesData.forEach(superHero => {
            createSuperHeroCard(superHero);
        });
    }
}

//Render few superheros on load
renderSuperHeroCards();

// get input value from search input
const getInputValue = (event) => {
    event.preventDefault();
    let searchText = searchForm.search.value;
    fetchAllSuperHero(searchText);
}

// search form submission
searchForm.addEventListener('submit', getInputValue);

// show seach list according to searched text
const showSearchList = (data) => {
    searchList.innerHTML = "";
    data.forEach(dataItem => {
        const imageUrl = dataItem.thumbnail.path + '.' + dataItem.thumbnail.extension;
        const divElem = document.createElement('div');
        divElem.classList.add('search-list-item');
        divElem.innerHTML = `
            <img src = "${imageUrl}" alt = "${dataItem.name} Image">
            <p data-id = "${dataItem.id}">${dataItem.name}</p>
        `;
        searchList.appendChild(divElem);
    });
}

// search form key up event
searchForm.search.addEventListener('keyup', () => {
    if(searchForm.search.value.length > 1){
        fetchAllSuperHero(searchForm.search.value);
    } else {
        searchList.innerHTML = "";
    }
});

// search list item click event
searchList.addEventListener('click', (event) => {
    let searchId = event.target.dataset.id;
    let singleData = allData.data.results.filter(singleData => {
        if (searchId == singleData.id){
            return singleData
        }
    });
    renderSingleSuperHeroCard(singleData[0]);
    searchList.innerHTML = "";
});

// clear all cards and render only one selected card
function renderSingleSuperHeroCard(superHero) {
    const cardContainer = document.getElementById('superHeroContainer');
    cardContainer.innerHTML = ''; // Clear existing cards

    createSuperHeroCard(superHero);
}




