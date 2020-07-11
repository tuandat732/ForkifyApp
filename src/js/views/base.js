export const elements = {
    searchForm: document.querySelector('.search'),
    searchInput: document.querySelector('.search__field'),
    searchRes: document.querySelector('.results'),
    searchResList: document.querySelector('.results__list'),
    searchResPage: document.querySelector('.results__pages'),
    recipe: document.querySelector('.recipe')
};

export const elementStrings = {
    loader: 'loader',
};

// animation loaded for fetch
export const renderLoader = parent => { // thẻ cha để inner loader vào
    const loader = `
        <div class="${elementStrings.loader}">
            <svg>
                <use href="img/icons.svg#icon-cw"></use>
            </svg>
        </div>
    `;
    parent.insertAdjacentHTML('afterbegin', loader);
}

export const clearLoader = () => {
    const loader = document.querySelector(`.${elementStrings.loader}`) // phải select ở đây vì loader ban đầu ko có trên dom
    if (loader) {
        loader.parentElement.removeChild(loader);
    }
}