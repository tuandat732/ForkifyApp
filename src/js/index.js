// Global app controller
import axios from 'axios';

async function getResults(query) {
    try{
    const res = await axios.get(`https://forkify-api.herokuapp.com/api/search?q=${query}`);
    const recipes = res.data.recipes;
    console.log(recipes)
    }catch(error) {
        console.log(error);
    }
}

getResults('pizza');

// 462b1cc8d4f2730081462fbc65136320
// http://food2fork.com/api/search
// https://forkify-api.herokuapp.com/api