
import { addOwnerPointerToObject, encodeObject } from '../util.js';
import { get, post } from './api.js'

const endpoints = {
    'movies': '/classes/Movie', 
    'movieById': '/classes/Movie/', 
    // this is for the test server from Viktor :D
    // 'moviesBySearchWord': (name)=>`/classes/Movie?where=name%20LIKE%20%22${encodeURIComponent(name)}%22`,
    // taken from the API docs, but only works with a full match.
    'moviesBySearchWord': (searchName)=>`/classes/Movie?where=${encodeObject({
        "name": {"$in": [searchName,]},
    })}`,
    // using a regex it works
    // TODO work on capitalized words - DONE; using $or to cycle through different regex variants;
    'moviesBySearchWordRegex': (searchName)=>`/classes/Movie?where=${encodeObject({
        "$or": [
            {"name": {"$regex": searchName}},
            {"name": {"$regex": searchName.toUpperCase()}},
            {"name": {"$regex": searchName.toLowerCase()}},
            {"name": {"$regex": searchName[0].toUpperCase() + searchName.substring(1)}},
            {"name": {"$regex": searchName[0].toUpperCase() + searchName.substring(1).toLowerCase()}},
            {"name": {"$regex": searchName[0].toLowerCase() + searchName.substring(1)}},

        ],
        
    })}`,
    'moviesByFilter' : (listOfFilters) => `/classes/Movie?where=${encodeObject({
        "rating": {"$in": listOfFilters},
    })}` 
}


export async function create (movieData, userId) {
    await post(endpoints.movies, addOwnerPointerToObject(movieData, userId));
}

export async function getAllMovies () {
    
    const data = await get(endpoints.movies);
    return data;

}

export async function getMovieById(id) {

    const data = await get(endpoints.movieById + id);
    return data;

}

export async function getMovieBySearchWord (searchWord) {
    
    // works with the regex
    const data = await get(endpoints.moviesBySearchWordRegex(searchWord));
    return data;

}

export async function getMovieBySearchWordAndFilter (searchWord, filterList) {
    
    const data = await get(endpoints.moviesBySearchWordRegex(searchWord));
    const result = [];

    for (let i = 0; i < data.results.length; i++) {
        const currentMovie = data.results[i];
        if (filterList.indexOf(currentMovie.rating) >= 0) {
            result.push(currentMovie);
        }
    }
    console.log(result);
    return result;

}


export async function getMoviesByFilter (filterList) {

    const data = await get(endpoints.moviesByFilter(filterList));
    return data;

}
