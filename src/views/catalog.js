
import { html, nothing } from "../lib/lit-html.js";
import { repeat } from '../lib/directives/repeat.js'
import { getAllMovies, getMovieByAllParameters, getMovieBySearchWord, getMovieBySearchWordAndCategory, getMovieBySearchWordAndFilter, getMoviesByCategory, getMoviesByCategoryAndFilter, getMoviesByFilter } from "../data/movie.js";
import { movieCategories, movieOptions } from "../util.js";

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
        <div class="movie-list">
            ${repeat(movies, m => m.objectId, movieCard)}
        </div>
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
    let isSearch = Boolean(ctx.query.search);

    // TODO make this whole mess into an abstract method;
    // also fetch queryString and the filters one time only
    if (!!ctx.query && Object.keys(ctx.query).length > 0) {

        if (!!ctx.query.search && !ctx.query.filter && !ctx.query.category) {
            const queryString = ctx.query.search;
            const {results: moviesBySearchWord} = await getMovieBySearchWord(queryString);
            movies = moviesBySearchWord;
        } else if (!!ctx.query.search && !!ctx.query.filter && !ctx.query.category) {
            const queryString = ctx.query.search;
            const queryFilterList = ctx.query.filter.split(",");

            const moviesBySearchWordAndFIlter = await getMovieBySearchWordAndFilter(queryString, queryFilterList);
            movies = moviesBySearchWordAndFIlter;
        } else if (!ctx.query.search && !!ctx.query.filter && !ctx.query.category) {
            const queryFilterList = ctx.query.filter.split(",");
            const {results: MoviesByFilter} = await getMoviesByFilter(queryFilterList);
            movies = MoviesByFilter;
        } else if (!ctx.query.search && !ctx.query.filter && !!ctx.query.category) {
            const queryCategoryList = ctx.query.category.split(",");
            const {results:MoviesByCategory} = await getMoviesByCategory(queryCategoryList);
            movies = MoviesByCategory;
        } else if (!ctx.query.search && !!ctx.query.filter && !!ctx.query.category) {
            const queryCategoryList = ctx.query.category.split(",");
            const queryFilterList = ctx.query.filter.split(",");
            // IMPORTANT -> should NOT be {results:varableName},
            // since we return an array directly from data fetching; maybe make it thus for all?
            const MoviesByCategoryAndFilter = await getMoviesByCategoryAndFilter(
                queryCategoryList,
                queryFilterList
            );
            movies = MoviesByCategoryAndFilter;
        } else if (!!ctx.query.search && !ctx.query.filter && !!ctx.query.category) {
            const queryCategoryList = ctx.query.category.split(",");
            const queryString = ctx.query.search;
            const MoviesByCategoryAndSearchWord = await getMovieBySearchWordAndCategory(
                queryString,
                queryCategoryList
            );
            movies = MoviesByCategoryAndSearchWord;
        } else if (!!ctx.query.search && !!ctx.query.filter && !!ctx.query.category) {
            const queryCategoryList = ctx.query.category.split(",");
            const queryFilterList = ctx.query.filter.split(",");
            const queryString = ctx.query.search;

            const MoviesByAllThreeFilters = await getMovieByAllParameters(
                queryString,
                queryCategoryList,
                queryFilterList,
            )

            movies = MoviesByAllThreeFilters;

        }



    } else {
        const {results: allMovies} = await getAllMovies();
        movies = allMovies;
    }

    const options = Object.entries(movieOptions);
    const categories = Object.entries(movieCategories);

    ctx.render(catalogTemplate(movies, onSearch, isSearch, options, categories));

    async function onSearch (event) {
        event.preventDefault();
        const searchedWord = event.target.parentElement.querySelector('input');

        const filters = document.getElementById("rating-filter");
        const selectedOptions = [];

        for (let i = 0; i < filters.children.length; i++) {
            if (filters.children[i].selected) {
                selectedOptions.push(filters.children[i]);
            };
        }

        const categoryFilters = document.getElementById("category-filter");
        const selectedCategories = [];

        for (let k = 0; k < categoryFilters.children.length; k++) {
            if (categoryFilters.children[k].selected) {
                selectedCategories.push(categoryFilters.children[k]);
            }
        }

        if (selectedOptions.length > 0 && selectedCategories.length == 0) {
            ctx.page.redirect(`/catalog?search=${searchedWord.value}&filter=${encodeURIComponent(selectedOptions.map(e => e.value).join(","))}`);
            console.log(decodeURIComponent(selectedOptions.map(e => e.value).join(",")));
        } else if (selectedCategories.length > 0 && selectedOptions.length == 0) {
            ctx.page.redirect(`/catalog?search=${
                searchedWord.value
            }&category=${
                encodeURIComponent(selectedCategories.map(e => e.value).join(","))
            }`);
        } else if (selectedCategories.length > 0 && selectedOptions.length > 0) {
            ctx.page.redirect(`/catalog?search=${
                searchedWord.value
            }&category=${
                encodeURIComponent(selectedCategories.map(e => e.value).join(","))
            }&filter=${
                encodeURIComponent(selectedOptions.map(e => e.value).join(","))
            }`);
        }else {
            ctx.page.redirect(`/catalog?search=${searchedWord.value}`);
        }

    }

}

