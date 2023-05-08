import { 
    getMovieByAllParameters, 
    getMovieBySearchWord, 
    getMovieBySearchWordAndCategory, 
    getMovieBySearchWordAndFilter, 
    getMoviesByCategory, 
    getMoviesByCategoryAndFilter, 
    getMoviesByFilter } from "../data/movie.js";
import { typeOfListFilter } from "./utilsConstants.js";

export function createSubmiteHandler(callback, shouldClear) {

    return function (event) {

        event.preventDefault();
        const eventData = new FormData(event.target);
        const data = Object.fromEntries([...eventData].map(([k, v]) => [k, v.trim()]));
        const children = event.target.children;

        if (shouldClear) {
            for (let child of children) {
                console.log(child.tagName)
                if (child.tagName == "INPUT") {
                    child.value = '';
                }
            }
        }

        callback(data, event.target);

    }

};

// function which takes the list of ratings returned when accessing the detail page of a movie,
// and returns an object containing the necessary properties -> average, number of ratings,
// and if the current user has rated
// 20230325 -> and the current RATING id, so that a delete request can easily be sent;
// and also the rating of the current user
export function createRatingObject(listOfRatings, currentUser) {

    let result = {

    }

    const length = listOfRatings.length;
    let sum = 0;
    let hasRated = false;
    let ratingId;
    let currentUserRating;

    for (let rating of listOfRatings) {
        sum += rating.rating;
        if (rating.owner.objectId == currentUser) {
            hasRated = true;
            ratingId = rating.objectId;
            currentUserRating = rating.rating;
        }
    }

    const average = (sum / length).toFixed(2);

    result.hasRated = hasRated;
    result.length = length;
    result.average = average;
    result.ratingId = ratingId;
    result.currentUserRating = currentUserRating;

    return result;

}

// 20230501 - function, which abstracts the filtering of results gotten 
// from DB by search word and then filtered by category / filter
export function filterDataByList (data, someList, typeOfList) {
    
    const result = [];
    const searchedProperty = typeOfListFilter[typeOfList].toString();

    // some 'data' received are objects with 'results' property, if from DB;
    // other are already filtered and are in an array;
    // TODO - unify them
    const dataObject = data.hasOwnProperty('results') ? data.results : data;
    
    for (let i = 0; i < dataObject.length; i++) {
        const currentMovie = dataObject[i];
        if (someList.indexOf(currentMovie[searchedProperty]) >= 0) {
            result.push(currentMovie);
        }
    };

    return result;

}


// 20230805 -> abstract the filtering and DB fetching; do it here, instead of in catalog
export async function getMoviesByParsedQuery (queryObject) {

    const queryString = queryObject.search;
    const queryFilterList = queryObject.filter?.split(",");
    const queryCategoryList = queryObject.category?.split(",");

    // queryObject['search'] was always present, even if queryString is '',
    // and the logic broke => filter the array to include only valid query params
    const objectKeysArr = Object.keys(queryObject).filter(
        (q) => queryObject[q] !== ''
    );

    let moviesToReturn;

    if (objectKeysArr.length === 3) {
        moviesToReturn = await getMovieByAllParameters(
            queryString,
            queryCategoryList,
            queryFilterList,
        )
    } else if (objectKeysArr.length === 1) {

        if (queryString) {
            const {results: moviesBySearchWord} = await getMovieBySearchWord(queryString);
            moviesToReturn = moviesBySearchWord;
        } else if (queryCategoryList) {
            const {results:MoviesByCategory} = await getMoviesByCategory(queryCategoryList);
            moviesToReturn = MoviesByCategory;
        } else if (queryFilterList) {
            const {results: MoviesByFilter} = await getMoviesByFilter(queryFilterList);
            moviesToReturn = MoviesByFilter;
        }

    } else if (objectKeysArr.length === 2) {

        if (queryString && queryCategoryList) {
            const MoviesByCategoryAndSearchWord = await getMovieBySearchWordAndCategory(
                queryString,
                queryCategoryList
            );
            moviesToReturn = MoviesByCategoryAndSearchWord;
        };
        if (queryString && queryFilterList) {
            const moviesBySearchWordAndFIlter = await getMovieBySearchWordAndFilter(
                queryString, 
                queryFilterList
            );
            moviesToReturn = moviesBySearchWordAndFIlter;
        };
        if (queryCategoryList && queryFilterList) {
            const MoviesByCategoryAndFilter = await getMoviesByCategoryAndFilter(
                queryCategoryList,
                queryFilterList
            );
            moviesToReturn = MoviesByCategoryAndFilter;
        };

    }

    return moviesToReturn;
    
}
