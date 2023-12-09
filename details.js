

// const allTabsBody = document.querySelectorAll('.tab-body-single');
// const allTabsHead = document.querySelectorAll('.tab-head-single');
// const searchForm = document.querySelector('.app-body-search');
// let searchList = document.getElementById('search-list');

let activeTab = 1, allData;

//generate timestamp
// let ts = new Date().getTime();
// console.log("timestamp = ", ts);

function generateMD5Hash(data) {
    return CryptoJS.MD5(data).toString();
}

//my keys
const publicKey = "e2063f4c519b245c8d0f25ac565863d2";
const privateKey = "f53513a8c5e922ffd06cff587fb12b6fd308fb7d";
const ts = Math.floor(new Date().getTime() / 1000);
const hashString = ts + privateKey + publicKey;
const hashValue = generateMD5Hash(hashString);

const urlParams = new URLSearchParams(window.location.search);
const superHeroId = urlParams.get('id');
console.log("query param id = ", superHeroId);

const fetchSelectedSuperHero = async() => {
    
    let hashValue = generateMD5Hash(ts + privateKey + publicKey);
    console.log("Generated HAshvalue = "+ hashValue);

    var URL = "";
    //working URL
    URL = `https://gateway.marvel.com:443/v1/public/characters/${superHeroId}?ts=${ts}&apikey=${publicKey}&hash=${hashValue}`;
    
    try{
        const response = await fetch(URL);
        allData = await response.json();
        const responseData = allData.data.results[0];
        console.log("all data = ", responseData);

        showSuperHeroDetails(responseData);
        
    } catch(error){
        console.log(error);
    }
}

fetchSelectedSuperHero();

function showSuperHeroDetails(superHero) {
    const cardContainer = document.getElementById('superHerocard');

    const name = document.createElement('div');
    name.classList.add('name');
    name.textContent = superHero.name;

    const description = document.createElement('div');
    description.classList.add('description');
    description.textContent = superHero.description;


    const imageContainer = document.getElementById('superHeroImage');


    const image = document.createElement('img');
    image.classList.add('app-body-content-image');
    const imageUrl = superHero.thumbnail.path + '.' + superHero.thumbnail.extension;
    image.src = imageUrl;
    image.alt = `${superHero.name} Image`;

    imageContainer.appendChild(image);

    cardContainer.appendChild(name);
    cardContainer.appendChild(description)
    // cardContainer.appendChild(imageContainer);
    
}










