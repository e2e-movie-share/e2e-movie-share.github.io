
import { html, nothing } from "../lib/lit-html.js";
import { repeat } from '../lib/directives/repeat.js'
import { getAllMovies, getMovieByAllParameters, getMovieBySearchWord, getMovieBySearchWordAndCategory, getMovieBySearchWordAndFilter, getMoviesByCategory, getMoviesByCategoryAndFilter, getMoviesByFilter } from "../data/movie.js";
import { movieCategories, movieOptions } from "../util.js";
import { constructSearchObject, createQueryListForURL, getMoviesByParsedQuery, twoWayBindSelectElementDOMandURL } from "../utils/utilsHelpers.js";

const catalogTemplate = (movies, onSearch, isSearch, options, categories) => html `
    <div class="search-bar-wrapper">
        <div class="search-div">
            <form class="search-form" @submit=${onSearch}>
                <input placeholder="Your favourite movie goes here ..." class="search-bar">

                </input>
                <button class="meta-search-button search-button">Search</button>
                ${isSearch ? html `
                <a href="/catalog">Clear</a>
                ` : nothing}
            </form>
        </div>
    </div>
    <div class="rating-filter-wrapper">
        <div class="inner-rating-wrapper">
            <div class="rating-filter">
                <form class="rating-filter-form">
                    <label for="rating-filter">Rating:</label>
                    <br>    
                    <select name="rating" id="rating-filter" multiple>
                        ${repeat(options, optionsCard)}
                    </select>
                </form>
            </div>
            <div class="category-filter">
                <form class="category-filter-form">
                    <label for="category-filter">Categories:</label>
                    <br>    
                    <select name="category" id="category-filter" multiple>
                        ${repeat(categories, optionsCard)}
                    </select>
                </form>
            </div>
        </div>    
    </div>
    <div class="movie-wrapper">
        <div class="tags-container">
            <h4>Hardcoded Categories of Movies</h4>
            <div class="tags-list">
                <a href="/">Action</a>
                <a>Adventure</a>
                <a>Classic</a>
                <a>Other</a>
            </div>
        </div>

        <!-- Throws error with a single item - it doesn't, the problem was with fetching (result'S')-->
        ${movies.length > 0 ? html `
        <div class="movie-list">
            ${repeat(movies, m => m.objectId, movieCard)}
        </div>
        ` : html `
        <div class="no-movies">
            No movies found with such criteria!
        </div>
        `}

    </div>
`;

const movieCard = (movie) => html `
    <div class="single-movie">
        <h4>${movie.name}</h4>
        ${movie.imageUrl ? html `
        <img src=${movie.imageUrl} class="catalog-img">
        `: html `
        <img src="../../static/images/default.jpeg" class="catalog-img">
        `}
        <p>Release date: ${movie.year}<p>
        <p>Description: ${movie.description}<p>
        <a href="/catalog/${movie.objectId}">Details</a>
    </div>
`;

const optionsCard = (option) => html `
<option value="${option[0]}">${option[1]}</option>
`

export async function catalogView(ctx) {

    // a midleware was needed first ...
    let movies;
    let isSearch = Object.keys(ctx.query).length > 0;

    // TODO make this whole mess into an abstract method;
    // also fetch queryString and the filters one time only
    // 20230508 -> DONE; removed about 50 lines, method is now in utils
    if (!!ctx.query && Object.keys(ctx.query).length > 0) {
        const moviesWithParams = await getMoviesByParsedQuery(ctx.query)
        movies = moviesWithParams;
    } else {
        const { results: allMovies } = await getAllMovies();
        movies = allMovies;
    }

    const options = Object.entries(movieOptions);
    const categories = Object.entries(movieCategories);

    ctx.render(catalogTemplate(movies, onSearch, isSearch, options, categories));

    // 20230508 -> feed/clear the state (search params) from the URL into the forms for better UI
    // {
    const searchInputField = document.getElementsByClassName('search-bar')[0];
    if (!!ctx.query.search && ctx.query.search !== searchInputField.value) {
        searchInputField.value = ctx.query.search;
    }

    if (!!searchInputField.value && !ctx.query.search) {
        searchInputField.value = '';
    }

    // 20230513 -> abstract away the two way binding between DOM select elements and url query params

    // ensure DOM state of ratings is the one from URL
    const ratingFilterInputField = document.getElementById('rating-filter');
    twoWayBindSelectElementDOMandURL(ratingFilterInputField, ctx.query.filter);

    // ensure DOM state of categories is the one from URL
    const categoryInputField = document.getElementById('category-filter');
    twoWayBindSelectElementDOMandURL(categoryInputField, ctx.query.category);

    // }

    async function onSearch (event) {
        event.preventDefault();
        const searchedWord = event.target.parentElement.querySelector('input');

        // 20230512 -> create the query list of selected attributes in an abstract way
        //  pass in the HTML select element -> get a list of the selected attributes
        const selectedOptions = createQueryListForURL(document.getElementById("rating-filter"));
        const selectedCategories = createQueryListForURL(document.getElementById("category-filter"));

        // remove search with empty query when pressing the button
        if (searchedWord.value == '' && selectedOptions.length == 0 && selectedCategories.length == 0) {
            return;
        }

        // 20230512 -> the search query string is now constructed in utils;
        const toSearch = constructSearchObject(searchedWord, selectedOptions, selectedCategories);
        ctx.page.redirect(toSearch);

    }

}

