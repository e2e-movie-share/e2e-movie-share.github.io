
import { html, nothing } from "../lib/lit-html.js";
import { repeat } from '../lib/directives/repeat.js'
import { getAllMovies, getMovieBySearchWord, getMovieBySearchWordAndFilter, getMoviesByFilter } from "../data/movie.js";
import { movieOptions } from "../util.js";

const catalogTemplate = (movies, onSearch, isSearch, options) => html `
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
        <div class="rating-filter">
            <form class="rating-filter-form">
                <label for="rating-filter"> Choose Categories: </label>
                <br>    
                <select name="rating" id="rating-filter" multiple>
                    ${repeat(options, optionsCard)}
                </select>
            </form>
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
    console.log(`the query is : ${ctx.query.search}`);
    console.log(`the filter query is : ${ctx.query.filter}`);
    let movies;
    let isSearch = Boolean(ctx.query.search);
    console.log(ctx.query);
    console.log(!!ctx.query)
    console.log(!!ctx.query.search)
    console.log(Object.keys(ctx.query))
    if (!!ctx.query && Object.keys(ctx.query).length > 0) {

        if (!!ctx.query.search && !ctx.query.filter) {
            const queryString = ctx.query.search;
            const {results: moviesBySearchWord} = await getMovieBySearchWord(queryString);
            console.log(moviesBySearchWord);
            movies = moviesBySearchWord;
        } else if (!!ctx.query.search && !!ctx.query.filter) {
            const queryString = ctx.query.search;
            const queryFilterList = ctx.query.filter.split(",");
            console.log(queryFilterList);

            const moviesBySearchWordAndFIlter = await getMovieBySearchWordAndFilter(queryString, queryFilterList);
            movies = moviesBySearchWordAndFIlter;
        } else if (!ctx.query.search && !!ctx.query.filter) {
            const queryFilterList = ctx.query.filter.split(",");
            const {results: MoviesByFilter} = await getMoviesByFilter(queryFilterList);
            movies = MoviesByFilter;
        }



    } else {
        const {results: allMovies} = await getAllMovies();
        movies = allMovies;
    }

    const options = Object.entries(movieOptions);

    console.log(movies);
    ctx.render(catalogTemplate(movies, onSearch, isSearch, options));

    async function onSearch (event) {
        event.preventDefault();
        const searchedWord = event.target.parentElement.querySelector('input');

        const filters = document.getElementById("rating-filter");
        console.log(filters);
        const selectedOptions = [];

        for (let i = 0; i < filters.children.length; i++) {
            if (filters.children[i].selected) {
                selectedOptions.push(filters.children[i]);
            };
        }
        console.log(selectedOptions);

        if (selectedOptions.length > 0) {
            ctx.page.redirect(`/catalog?search=${searchedWord.value}&filter=${encodeURIComponent(selectedOptions.map(e => e.value).join(","))}`);
            console.log(decodeURIComponent(selectedOptions.map(e => e.value).join(",")));
        } else {
            ctx.page.redirect(`/catalog?search=${searchedWord.value}`);
        }

        

    }

}

