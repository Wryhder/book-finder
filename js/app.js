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

    /* Utility functions */
    const chores = {
        createNode(element) {
            return document.createElement(element);
        },
        append(parent, el) {
            return parent.appendChild(el);
        },
        toggleVisibility(target) {
            target.classList.toggle('hidden');
        },
        promptSearch() {
            statusDiv.innerHTML = statusMessages.noSearchAttempted;
        },
        getSearchQuery() {
            (function getSearchString() {
                // Get search string entered by user
                userInput = searchInput.value;
            })();

            return (function convertSearchStringToQueryFormat(str) {
                // Convert search string to query format
                return str.split(' ').join('+');
            })(userInput);
        },
        buildFetchURL() {
            url = 'https://www.googleapis.com/books/v1/volumes?q=' + this.getSearchQuery() + '&maxResults=20&key=AIzaSyAd2TY0Wyum01edRAeyuoQbV3DxdBfZXRU';
        },
        clearPage() {
            // Empty the page of any previous search results
            booksContainer.innerHTML = '';
        },
        createLoadingAnimation() {
            statusDiv.classList.replace('no-search-attempted', 'loading');
            statusDiv.classList.add('sk-folding-cube', 'hidden');

            const div1 = this.createNode('div'),
                div2 = this.createNode('div'),
                div4 = this.createNode('div'),
                div3 = this.createNode('div');

            div1.classList.add('sk-cube1', 'sk-cube');
            div2.classList.add('sk-cube2', 'sk-cube');
            div4.classList.add('sk-cube4', 'sk-cube');
            div3.classList.add('sk-cube3', 'sk-cube');

            this.append(statusDiv, div1);
            this.append(statusDiv, div2);
            this.append(statusDiv, div4);
            this.append(statusDiv, div3);
        },
        renderBook(item) {
            // Create HTML elements
            const article = this.createNode('article'),
                img = this.createNode('img'),
                titleDiv = this.createNode('div'),
                authorDiv = this.createNode('div'),
                publisherDiv = this.createNode('div'),
                viewBookDetailsLink = this.createNode('a');

            /* Populate elements with book details */
            // Book cover
            img.src = item.volumeInfo.imageLinks.thumbnail;
            // Book title
            titleDiv.innerHTML = item.volumeInfo.title;
            // Author(s)
            authorDiv.innerHTML = `By: ${item.volumeInfo.authors}`;
            // Publisher
            if (typeof item.volumeInfo.publisher === 'undefined') {
                publisherDiv.innerHTML = `Publisher: Unknown`;
            } else {
                publisherDiv.innerHTML = `Publisher: ${item.volumeInfo.publisher}`;
            }
            // Link to book details; links out to external website
            viewBookDetailsLink.innerHTML = 'View Book Details';
            viewBookDetailsLink.href = item.volumeInfo.previewLink;

            // Add styling
            article.classList.add('book');
            img.classList.add('book-cover');
            titleDiv.classList.add('book-title');
            authorDiv.classList.add('book-author');
            publisherDiv.classList.add('book-publisher');

            // Append created elements to a parent container
            this.append(booksContainer, article);
            this.append(article, img);
            this.append(article, titleDiv);
            this.append(article, authorDiv);
            this.append(article, publisherDiv);
            this.append(article, viewBookDetailsLink);
        }
    }

    // Prompt user to search for a book
    chores.promptSearch();
}); 