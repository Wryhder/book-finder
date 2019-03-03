document.addEventListener("DOMContentLoaded", function () {

    const booksContainer = document.querySelector('#search-results'),
        form = document.querySelector('.form-wrapper'),
        searchInput = document.querySelector('.search-input'),
        statusDiv = document.querySelector('#status > div');

    let userInput, url, state, totalSearchResults;

    const states = {
        noSearchAttempted: 'no-search-attempted',
        invalidQuery: 'invalid-query',
        noMatchFound: 'no-match-found',
        fetchingResults: 'fetching-results',
        resultsRendered: 'results-rendered',
    }

    const statusMessages = {
        noSearchAttempted: 'Nothing here yet - try searching for a book',
        invalidQuery: 'Error: Please provide a search query first',
        noMatchFound: 'Nothing found! Try another query',
    }

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
        updateState(newState) {
            statusDiv.className = newState;
            state = newState;

            switch (state) {
                case states.noSearchAttempted:
                    statusDiv.innerHTML = statusMessages.noSearchAttempted;
                    break;
                case states.invalidQuery:
                    statusDiv.innerHTML = statusMessages.invalidQuery;
                    break;
                case states.fetchingResults:
                    this.clearPage();
                    this.createLoadingAnimation();
                    break;
                case states.resultsRendered:
                    statusDiv.classList.replace('sk-folding-cube', 'results-rendered');
                    statusDiv.innerHTML = `${totalSearchResults} search results for '${userInput}'`;
                    break;
            }
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
        loadResults() {
            // Make call to Google Books API and render returned data
            fetch(url)
                .then(response => response.json())
                .then(data => {

                    // Get total number of results; this will be displayed for the user
                    totalSearchResults = data.totalItems;

                    chores.updateState('results-rendered');

                    // Render each returned book item
                    return (data.items.map(function (item) {
                        return chores.renderBook(item);
                    }));
                });
        },
        clearPage() {
            // Empty the page of any previous search results
            booksContainer.innerHTML = '';
        },
        createLoadingAnimation() {
            // Empty div contents
            statusDiv.innerHTML = '';

            statusDiv.classList.replace('no-search-attempted', 'fetching-results');
            statusDiv.classList.add('sk-folding-cube');

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
            
            const { imageLinks, title, authors, publisher, previewLink } = item.volumeInfo;

            // Create HTML elements
            const article = this.createNode('article'),
                img = this.createNode('img'),
                detailsContainer = this.createNode('div'),
                bookTitle = this.createNode('h5'),
                bookAuthor = this.createNode('p'),
                bookPublisher = this.createNode('p'),
                viewBookDetailsLink = this.createNode('a');

            /* Populate elements with book details */
            // Book cover
            const placeholderImage = 'https://via.placeholder.com/150x130.png?text=Cover+not+available';
            img.src = imageLinks.smallThumbnail ? imageLinks.smallThumbnail : placeholderImage;
            // Book title
            bookTitle.innerHTML = title ? title : 'N/A';
            // Author(s)
            bookAuthor.innerHTML = authors ? `By: ${authors}` : 'N/A';
            // Publisher
            bookPublisher.innerHTML = publisher ? `Publisher: ${publisher}` : 'N/A';
            // Link to book details; links out to external website
            viewBookDetailsLink.innerHTML = 'View Book Details';
            viewBookDetailsLink.href = previewLink;

            // Add styling
            article.classList.add('book');
            img.classList.add('book-cover');
            bookTitle.classList.add('book-title');
            bookAuthor.classList.add('book-author');
            bookPublisher.classList.add('book-publisher');

            // Append created elements to a parent container
            this.append(booksContainer, article);
            this.append(article, img);
            this.append(article, detailsContainer);
            this.append(detailsContainer, bookTitle);
            this.append(detailsContainer, bookAuthor);
            this.append(detailsContainer, bookPublisher);
            this.append(detailsContainer, viewBookDetailsLink);
        }
    }

    chores.updateState('no-search-attempted');

    /* Listen for submit event on search form and display search results */
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        (function validateSearchQuery() {
            if (!chores.getSearchQuery()) {
                chores.updateState('invalid-query');;
            } else {
                chores.updateState('fetching-results');
                chores.buildFetchURL();
                chores.loadResults();
            }
        })();
    });
});

