
import { getSpecificComments, postComment } from "../data/comments.js";
import { getMovieById } from "../data/movie.js";
import { html } from "../lib/lit-html.js";
import { createRatingObject, createSubmiteHandler } from "../util.js";
import { repeat } from '../lib/directives/repeat.js'
import { classMap } from '../lib/directives/class-map.js'
import { deleteRating, getMovieRatingsById, postRating } from "../data/movieRating.js";

const detailTemplate = (onComment, onRate, movie, currentComments, ratingObject) => html`
    <h1>${movie.name}</h1>
    <h3>${movie.year}</h3>
    <h3>${movie.rating}</h3>
    <p>${movie.description}</p>
    <p class="rating holder" id="${ratingObject.ratingId}">
        Movie Rating: ${!isNaN(ratingObject.average) ? ratingObject.average: "-"} / 5 (${ratingObject.length})
    </p>
    <br>

    <form @submit=${onRate}>
        <label for="rating">Rate this movie</label>

        ${ratingObject.hasRated ? html `
        <p>Your Rating: ${ratingObject.currentUserRating}</p>
        ` : html `
        <select id="rating" name="rating">
            <option calue="1">1</option>
            <option calue="2">2</option>
            <option calue="3">3</option>
            <option calue="4">4</option>
            <option calue="5">5</option>
        </select>
        `}
        
        ${ratingObject.hasRated ? html `
        <button>Unrate</button>
        ` : html `
        <button>Rate</button>
        `}
        
    </form>
    <br>

    <form @submit="${onComment}">
        <input name="commentText" placeholder="Enter your comment"></input>
        <button>Comment!</button>
    </form>

    ${currentComments.length > 0 ?
        html`
        <ul>
            ${repeat(currentComments, c => c.objectId, commentCard)}
        </ul>
        `
        :
        html`No comments yet!`}

`;

const commentCard = (comment) => html`
<li class=${classMap({ 'owner-comment': comment.isOwnerOfMovie })}>
    ${comment.owner.username}: ${comment.commentText}
</li> 
`;


export async function showDetails(ctx) {

    console.log(ctx.params);
    const id = ctx.params.id;
    const movie = await getMovieById(id);

    const result = await getSpecificComments(id);
    const currentComments = result.results;

    currentComments.map(c => c.isOwnerOfMovie = Boolean(c.owner.objectId == movie.owner.objectId));

    console.log(currentComments);

    let allRatings = await getMovieRatingsById(id);
    allRatings = allRatings.results;
    console.log(allRatings);

    const ratingObject = createRatingObject(allRatings, ctx.user?.objectId);
    console.log(ratingObject);

    ctx.render(detailTemplate(createSubmiteHandler(onCommentCreate), createSubmiteHandler(onRate),
    movie, currentComments, ratingObject));

    async function onCommentCreate({ commentText }) {

        if (commentText == '') {
            return alert('Cannot submit empty comment :(')
        }

        if (!ctx.user) {
            return alert("You have to be logged in to post a comment!")
        }

        console.log(ctx.user);
        const currentUserId = ctx.user?.objectId;
        console.log(commentText);

        const commentData = {
            commentText,
        }

        console.log(commentData);

        await postComment(commentData, currentUserId, id);

        ctx.page.redirect(`/catalog/${id}`);

    }

    async function onRate({ rating }, rateEvent) {

        let button;
        
        for (let element of rateEvent.children) {
            if (element.tagName == 'BUTTON') {
                button = element;
                break;
            }
        }
        console.log(button.textContent);

        if (button.textContent == 'Rate') {
            const ratingData = {
                rating: Number(rating),
            }
    
            if (ctx.user?.objectId == undefined) {
                return alert('You must be logged in to rate this!')
            }
    
            await postRating(ratingData, id, ctx.user.objectId);
        } else {
            const currentRatingId = document.getElementsByClassName('rating holder')[0].id;
            console.log(currentRatingId);
            await deleteRating(currentRatingId);
        }

        ctx.page.redirect(`/catalog/${id}`);

    }

}

