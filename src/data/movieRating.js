import { addMoviePointerToObject, addOwnerPointerToObject, encodeObject, filterRelation } from "../util.js";
import { del, get, post } from "./api.js";

const endpoints = {
    'rateMovie': '/classes/movieRating',
    'ratingsByMovieId': (movieId) => '/classes/movieRating?where=' + encodeObject(filterRelation('moviePointer', "Movie", movieId)),
    'deleteRatingById': '/classes/movieRating/',
}



export async function getMovieRatingsById (movieId) {

    const data = await get(endpoints.ratingsByMovieId(movieId));
    return data;

}

export async function postRating (ratingData, movieId, ownerId) {

    ratingData = addMoviePointerToObject(ratingData, movieId);
    ratingData = addOwnerPointerToObject(ratingData, ownerId);

    console.log(ratingData);
    await post(endpoints.rateMovie, ratingData);

}

export async function deleteRating (ratingId) {
    await del(endpoints.deleteRatingById + ratingId);
}
