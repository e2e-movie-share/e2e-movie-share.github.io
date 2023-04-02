import { addMoviePointerToObject, addOwnerPointerToObject, encodeObject, filterRelation } from "../util.js";
import { get, post } from "./api.js";


const endpoints = {
    'comments': '/classes/Comment',
    'commentsForCurrentMovie': (movieId) => '/classes/Comment?where=' + encodeObject(filterRelation('moviePointer', "Movie", movieId)) + '&include=owner',
}

export async function getAllComments () {
    
    const data = await get(endpoints.comments);
    return data;

}

export async function getSpecificComments(movieId) {
    
    const data = await get(endpoints.commentsForCurrentMovie(movieId));
    return data;

}

export async function postComment (commentData, userId, movieId) {
    
    commentData = addOwnerPointerToObject(commentData, userId);
    commentData = addMoviePointerToObject(commentData, movieId);

    console.log(commentData);

    await post(endpoints.comments, commentData);
}

