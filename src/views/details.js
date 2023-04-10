
import { getSpecificComments, postComment } from "../data/comments.js";
import { getMovieById } from "../data/movie.js";
import { html } from "../lib/lit-html.js";
import { createRatingObject, createSubmiteHandler, movieCategories, movieOptions } from "../util.js";
import { repeat } from '../lib/directives/repeat.js'
import { classMap } from '../lib/directives/class-map.js'
import { deleteRating, getMovieRatingsById, postRating } from "../data/movieRating.js";

const detailTemplate = (
    onComment, onRate, movie, currentComments, ratingObject, movieOptions, movieCategories
    ) => html`
    <div class="details-wrapper">

        <div class="details-content">
            <div class="details-text">
                <h1>${movie.name}</h1>
                <h3>${movie.year}</h3>
                <h3>${movieCategories[movie.category]}</h3>
                <h3>${movieOptions[movie.rating]}</h3>
                <p>${movie.description}</p>
                <p class="rating holder" id="${ratingObject.ratingId}">
                    Movie Rating: ${!isNaN(ratingObject.average) ? ratingObject.average: "-"} / 5 (${ratingObject.length})
                </p>
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
            </div>
            <div class="details-image">
                ${movie.imageUrl ? html `
                <img src=${movie.imageUrl} class="catalog-img">
                `: html `
                <img src="../../static/images/default.jpeg" class="catalog-img">
                `}
            </div>
            <br>
        </div>


        
        <div class="comments">
            <form @submit="${onComment}" class="comment-submit-form">
                <input name="commentText" placeholder="Enter your comment"></input>
                <button type="submit" class="comment-submit-button">Comment</button>
                <button type="button" class="comment-submit-button cancel">Cancel</button>
            </form>

            <div class="comment-line-div">
            </div>

            ${currentComments.length > 0 ?
                html`
                <ul>
                    ${repeat(currentComments, c => c.objectId, commentCard)}
                </ul>
                `
                :
                html`<p>Be the first one to comment!</p>`}
        </div>  
    </div>    
`;

const commentCard = (comment) => html`
<li class=${classMap({ 'owner-comment': comment.isOwnerOfMovie })}>
    ${comment.owner.username}: ${comment.commentText}
</li> 
`;


export async function showDetails(ctx) {

    const id = ctx.params.id;
    const movie = await getMovieById(id);

    const result = await getSpecificComments(id);
    const currentComments = result.results;

    currentComments.map(c => c.isOwnerOfMovie = Boolean(c.owner.objectId == movie.owner.objectId));


    let allRatings = await getMovieRatingsById(id);
    allRatings = allRatings.results;

    const ratingObject = createRatingObject(allRatings, ctx.user?.objectId);

    ctx.render(detailTemplate(createSubmiteHandler(onCommentCreate, true), createSubmiteHandler(onRate),
    movie, currentComments, ratingObject, movieOptions, movieCategories));

    const commentInput = document.getElementsByTagName('input')[0];
    commentInput.addEventListener('focusin', revealButtons);
    commentInput.addEventListener('input', onCommentInput)
    const buttons = document.getElementsByClassName('comment-submit-button');
    const submitButton = buttons[0];
    const cancelButton = buttons[1];
    cancelButton.addEventListener('click', hideButtons);

    function revealButtons (event) {
        for (let button of buttons) {
            button.style.display = 'inline-block'
        }
    }

    function hideButtons (event) {
        for (let button of buttons) {
            button.style.display = 'none';
        }
        commentInput.value = '';
        if (submitButton.classList.contains('blue-btn')) {
            submitButton.classList.remove('blue-btn');
        } 
    }

    function onCommentInput (event) {
        if (event.target.value == '') {
            if (submitButton.classList.contains('blue-btn')) {
                submitButton.classList.remove('blue-btn');
            }
        } else {
            if (!submitButton.classList.contains('blue-btn')) {
                submitButton.classList.add('blue-btn');
            }
        }
    }

    async function onCommentCreate({ commentText }) {

        if (commentText == '') {
            return alert('Cannot submit empty comment :(')
        }

        if (!ctx.user) {
            return alert("You have to be logged in to post a comment!")
        }

        const currentUserId = ctx.user?.objectId;

        const commentData = {
            commentText,
        }

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
            await deleteRating(currentRatingId);
        }

        ctx.page.redirect(`/catalog/${id}`);

    }

}

