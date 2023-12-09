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

const fetchFavoriteSuperHeros = async(characterId) => {

    let hashValue = generateMD5Hash(ts + privateKey + publicKey);

    var URL = "";
    //working URL
    URL = `https://gateway.marvel.com:443/v1/public/characters/${characterId}?ts=${ts}&apikey=${publicKey}&hash=${hashValue}`;
    
    try{
        const response = await fetch(URL);
        allData = await response.json();
        var responseData = allData.data.results[0];
        return responseData;
    } catch(error){
        console.error(error);
        return null;
    }
}

function createSuperHeroCard(superHero) {
    const cardContainer = document.getElementById('superHeroContainer');

    const card = document.createElement('div');
    card.classList.add('card');
    card.id = superHero.id;

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
        toggleFavorites(superHero, card);
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
function toggleFavorites(superHero, card) {
    const favorites = getFavoritesFromStorage();
    const index = favorites.indexOf(superHero.id.toString());
    console.log("super hero we got in toogle() ", superHero)

    if (index !== -1) {
        // Superhero is already in favorites, remove it
        favorites.splice(index, 1);

        card.remove();
    } 

    // Save the updated favorites list to local storage
    saveFavoritesToStorage(favorites);
    // renderSuperHeroCards();
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
    const superHeroesData = getFavoritesFromStorage();
    // Check if data is available
    if (superHeroesData && Array.isArray(superHeroesData)) {
        superHeroesData.forEach( async characterIdId => {
            const superHero = await fetchFavoriteSuperHeros(characterIdId);
            createSuperHeroCard(superHero);
        });
    }
}

//Render few superheros on load
renderSuperHeroCards();





