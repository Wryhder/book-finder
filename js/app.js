document.addEventListener("DOMContentLoaded", function () {

    const booksContainer = document.querySelector('#search-results'),
        form = document.querySelector('.form-wrapper'),
        searchInput = document.querySelector('.search-input'),
        statusDiv = document.querySelector('#status > div');

    let userInput, url, state, totalSearchResults;

    const states = {
        noSearchAttempted: 'no-search-attempted',
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
                case states.fetchingResults:
                    chores.createLoadingAnimation();
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
        searchAndRender() {
            // Make call to Google Books API and return HTML elements populated with relevant book details
            fetch(url)
                .then((response) => response.json())
                .then((data) => {
                    
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
            // Create HTML elements
            const article = this.createNode('article'),
                img = this.createNode('img'),
                detailsContainer = this.createNode('div'),
                title = this.createNode('h5'),
                author = this.createNode('p'),
                publisher = this.createNode('p'),
                viewBookDetailsLink = this.createNode('a');

            /* Populate elements with book details */
            // Book cover
            img.src = item.volumeInfo.imageLinks.smallThumbnail;
            // Book title
            title.innerHTML = item.volumeInfo.title;
            // Author(s)
            author.innerHTML = `By: ${item.volumeInfo.authors}`;
            // Publisher
            if (typeof item.volumeInfo.publisher === 'undefined') {
                publisher.innerHTML = `Publisher: Unknown`;
            } else {
                publisher.innerHTML = `Publisher: ${item.volumeInfo.publisher}`;
            }
            // Link to book details; links out to external website
            viewBookDetailsLink.innerHTML = 'View Book Details';
            viewBookDetailsLink.href = item.volumeInfo.previewLink;

            // Add styling
            article.classList.add('book');
            img.classList.add('book-cover');
            title.classList.add('book-title');
            author.classList.add('book-author');
            publisher.classList.add('book-publisher');

            // Append created elements to a parent container
            this.append(booksContainer, article);
            this.append(article, img);
            this.append(article, detailsContainer);
            this.append(detailsContainer, title);
            this.append(detailsContainer, author);
            this.append(detailsContainer, publisher);
            this.append(detailsContainer, viewBookDetailsLink);
        }
    }

    chores.updateState('no-search-attempted');

    /* Listen for submit event on search form and display search results */
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        // Show loading animation
        chores.updateState('fetching-results');

        chores.buildFetchURL();
        chores.clearPage();
        chores.searchAndRender();
    });
});