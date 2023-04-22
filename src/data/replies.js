import { 
    addCommentPointerToObject, 
    addMoviePointerToObject, 
    addOwnerPointerToObject, 
    encodeObject, 
    filterRelation 
} from "../util.js";
import { get, post } from "./api.js";


const replyBase = '/classes/Reply';

const endpoints = {
    'replies': replyBase,
    'repliesForCurrentMovie': (movieId) => replyBase + '?where=' + encodeObject(
        filterRelation('moviePointer', "Movie", movieId)
        ) + '&include=owner',
}   


export async function getSpecificReplies(movieId) {
    
    const data = await get(endpoints.repliesForCurrentMovie(movieId));
    return data;

}

export async function postReply (replyData, userId, movieId, commentId) {
    
    replyData = addOwnerPointerToObject(replyData, userId);
    replyData = addMoviePointerToObject(replyData, movieId);
    replyData = addCommentPointerToObject(replyData, commentId)

    await post(endpoints.replies, replyData);
}
