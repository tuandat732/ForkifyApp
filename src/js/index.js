// Global app controller
import Search from './models/Search';

/** Global state of the app 
 * - Search object
 * - Current recipe object
 * - Shopping list obj
 * - Liked recipes
 * **/
const state = {}

const controllerSearch = async () => {
    // 1. Get query from the view
    const query = 'pizza' // TODO

    if(query) {
        // 2. New search object and add to state
        state.search = new Search(query);

        // 3. prepare UI for results

        // 4. Search for recipes
        await state.search.getResults();

        // 5. render results on UI
        console.log(state.search.result);
    }
}

document.querySelector('.search').addEventListener('submit',(e)=>{
    e.preventDefault();
    controllerSearch();
});
