// Global app controller
import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import { elements, renderLoader, clearLoader } from './views/base';

/** Global state of the app 
 * - Search object
 * - Current recipe object
 * - Shopping list obj
 * - Liked recipes
 * **/
const state = {};
//window.state = state; // gán vào window để dễ testing


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
            recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
        } catch (error) {
            alert('Error processing recipe!')
        }
    }
}

// window.addEventListener('hashchange', controlRecipe); // haschange là sự kiện url thay đổi query sau #
// window.addEventListener('load', controlRecipe);
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));



/**
 *  LIST CONTROLLER ========================
 */
const controlList = () => {
    // Create a new list if there in none yet
    if (!state.list) state.list = new List();

    // Add each ingredient to the list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
}

// Handle delete and update list item events
elements.shopping.addEventListener('click', (e) => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    // Handle the delete button - check xem có click đúng vào nút xóa ko
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // Delete from state
        state.list.deleteItem(id);
        // Delete from UI
        listView.deleItem(id);

        // Handle the count update
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseInt(e.target.value);
        state.list.updateCount(id, val);
    }
});


/**
 *  LIKE CONTROLLER ========================
*/
const controlLike = () => {
    if (!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;


    if (!state.likes.isLiked(currentID)) {
        // User has NOT yet liked current recipe

        // Add like to the state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );
        // Toggle the like button
        likesView.toggleLikeBtn(true);
        // Add like to UI list
        likesView.renderLike(newLike);
    } else {
        // User HAS liked current recipe

        // Remove like to the state
        state.likes.deleteLike(currentID);
        // Toggle the like button
        likesView.toggleLikeBtn(false);
        // Remove like from UI list
        likesView.deleteLike(currentID);
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
};

// Restore liked recipe on page load
window.addEventListener('load', () => {
    state.likes = new Likes();
    // Restore likes
    state.likes.readStorage();
    // Toggle like menu button
    likesView.toggleLikeMenu(state.likes.getNumLikes());

    // Render the existing like
    state.likes.likes.forEach(like => likesView.renderLike(like));
})

// Handling recipe button clicks 
elements.recipe.addEventListener('click', (e) => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {// ko dùng closest ở đây vì trong recipe có nhiều btn có nhiều tác dụng khác nhau như dec,inc, like,add to list
        // Decrease btn is clicked
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            // update Servings and Ingredients in UI
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) { // btn-increase and any btn-increase's child
        // Decrease btn is clicked
        state.recipe.updateServings('inc');
        // update Servings and Ingredients in UI
        recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        // add ingredient to shopping list
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        // add to the list lover
        controlLike();
    }

})


