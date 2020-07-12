// Global app controller
import Search from './models/Search';
import Recipe from './models/Recipe'
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import { elements, renderLoader, clearLoader } from './views/base';

/** Global state of the app 
 * - Search object
 * - Current recipe object
 * - Shopping list obj
 * - Liked recipes
 * **/
const state = {};
window.state = state


/**
 *  SEARCH CONTROLLER ========================
 */
const controllerSearch = async () => {
    // 1. Get query search from the view
    const query = searchView.getInput();

    if (query) {
        // 2. New search object and add to state
        state.search = new Search(query);

        // 3. prepare UI for results and input
        searchView.clearInput();
        searchView.clearResults(); // clear list results
        renderLoader(elements.searchRes);

        try {
            // 4. Search for recipes
            await state.search.getResults();

            // 5. render results on UI
            clearLoader(); // clear loader before render result
            searchView.renderResults(state.search.result);

        } catch (error) {
            alert('Something wrong with the search...');
            clearLoader();
        }
    }
}

elements.searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    controllerSearch();
});

// PAGINATION
elements.searchResPage.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-inline'); // closest dùng để select vào đúng thẻ mình muốn (ví dụ: trong btn có thẻ a, thẻ p => khi click thì có thể target vào thẻ a,p,btn => dùng closest giúp ta target dc vào tk btn)
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);

        // Goto page when user click btn pagination
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
})


/**
 *  RECIPE CONTROLLER ========================
 */
const controlRecipe = async () => {
    // Get ID from url
    const id = window.location.hash.replace('#', '');

    if (id) {
        // 1. Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // Highlight selected search item
        if (state.search) searchView.highlightSelected(id);

        // 2. Create new recipe object
        state.recipe = new Recipe(id);


        try {
            // 3. Get recipe data and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            // 4. Calc servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();

            // 5. Render recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe);
        } catch (error) {
            console.log(error)
            alert('Error processing recipe!')
        }
    }
}

// window.addEventListener('hashchange', controlRecipe); // haschange là sự kiện url thay đổi query sau #
// window.addEventListener('load', controlRecipe);
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));


// Handling recipe button clicks 
elements.recipe.addEventListener('click', (e) => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {// ko dùng closest ở đây vì trong recipe có nhiều btn có nhiều tác dụng khác nhau như dec,inc, like,add to list
        // Decrease btn is clicked
        console.log('b1')
        if (state.recipe.servings > 1)
            state.recipe.updateServings('dec');
    } else if (e.target.matches('.btn-increase, .btn-increase *')) { // btn-increase and any btn-increase's child
        // Decrease btn is clicked
        state.recipe.updateServings('inc');
    }
    // update Servings and Ingredients in UI
    recipeView.updateServingsIngredients(state.recipe);
})

