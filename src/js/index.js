// Global app controller
import Search from './models/Search';
import * as searchView from './views/searchView';
import { elements, renderLoader, clearLoader } from './views/base';

/** Global state of the app 
 * - Search object
 * - Current recipe object
 * - Shopping list obj
 * - Liked recipes
 * **/
const state = {}

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

        // 4. Search for recipes
        await state.search.getResults();

        // 5. render results on UI
        clearLoader(); // clear loader before render result
        searchView.renderResults(state.search.result);
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
