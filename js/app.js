document.addEventListener("DOMContentLoaded", function () {

    const booksContainer = document.querySelector('#search-results'),
        form = document.querySelector('.form-wrapper'),
        searchInput = document.querySelector('.search-input'),
        statusDiv = document.querySelector('#status > div');

    let userInput, url;

    const statusMessages = {
        noSearchAttempted: 'Nothing here yet - try searching for a book',
        invalidQuery: 'Error: Please provide a search query first',
        noMatchFound: 'Nothing found! Try another query',
    }
}); 