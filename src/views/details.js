
import { getSpecificComments, postComment } from "../data/comments.js";
import { getMovieById } from "../data/movie.js";
import { html } from "../lib/lit-html.js";
import { createRatingObject, createSubmiteHandler, movieCategories, movieOptions } from "../util.js";
import { repeat } from '../lib/directives/repeat.js'
import { classMap } from '../lib/directives/class-map.js'
import { deleteRating, getMovieRatingsById, postRating } from "../data/movieRating.js";

const detailTemplate = (
    onComment, onRate, movie, currentComments, ratingObject, movieOptions, movieCategories, hasUser
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
                <input type="hidden" id="rate-input" name="rating" value="-1"></input>
                <div class="rating-container">
                    <div class="stars">
                        <span class="fas fa-star" id="star-1"></span>
                        <span class="fas fa-star" id="star-2"></span>
                        <span class="fas fa-star" id="star-3"></span>
                        <span class="fas fa-star" id="star-4"></span>
                        <span class="fas fa-star" id="star-5"></span>
                    </div>
                </div>

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
                ${hasUser ? html `
                <button type="submit" class="comment-submit-button" disabled>Comment</button>
                ` : html `
                <button type="submit" class="comment-submit-button disabled" disabled>Comment</button>
                `}
                
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
    const hasUser = ctx.user;

    currentComments.map(c => c.isOwnerOfMovie = Boolean(c.owner.objectId == movie.owner.objectId));


    let allRatings = await getMovieRatingsById(id);
    allRatings = allRatings.results;

    const ratingObject = createRatingObject(allRatings, ctx.user?.objectId);

    ctx.render(detailTemplate(createSubmiteHandler(onCommentCreate, true), createSubmiteHandler(onRate),
    movie, currentComments, ratingObject, movieOptions, movieCategories, hasUser));

    const commentInput = document.getElementsByTagName('input')[0];
    commentInput.addEventListener('focusin', revealButtons);
    commentInput.addEventListener('input', onCommentInput)
    const buttons = document.getElementsByClassName('comment-submit-button');
    const submitButton = buttons[0];
    const cancelButton = buttons[1];
    cancelButton.addEventListener('click', hideButtons);

    const stars = document.getElementsByClassName('fa-star');
    const inputRate = document.getElementById('rate-input');
    let lastStarClicked = -1;

    for (let star of stars) {
        star.addEventListener('click', starClicked);
        star.addEventListener('mouseover', starHovered);
        star.addEventListener('mouseout', starUnhovered);
    }

    function starHovered (event) {
        const hoveredId = event.target.id.split("-")[1];
        if (lastStarClicked < 0) {
            for (let k = 0; k < hoveredId; k++) {
                stars[k].style.color = "yellow";
            }
        }
        
    }

    function starUnhovered (event) {
        const unhoveredId = event.target.id.split("-")[1];
        if (lastStarClicked < 0) {
            for (let k = 0; k < unhoveredId; k++) {
                stars[k].style.color = "black";
            }
        }
        
    }

    function starClicked (event) {
        
        const currentId = event.target.id.split("-")[1];
        inputRate.value = currentId;

        if (lastStarClicked == -1) {
            for (let i = 0; i < currentId; i++) {
                stars[i].classList.add('golden');
                stars[i].style.color = "yellow";
                
            }
            lastStarClicked = currentId;
        } else {
            if (currentId > lastStarClicked) {
                for (let i = lastStarClicked; i < currentId; i++) {
                    stars[i].classList.add('golden');
                    stars[i].style.color = "yellow";
                    
                }
                lastStarClicked = currentId;
            } else if (currentId == lastStarClicked) {
                for (let i = 0; i < currentId; i++) {
                    stars[i].classList.remove('golden');
                    stars[i].style.color = "black";
                    inputRate.value = -1;
                    
                }
                lastStarClicked = -1;
            } else if (currentId < lastStarClicked) {
                for (let i = currentId; i < lastStarClicked; i++) {
                    stars[i].classList.remove('golden');
                    stars[i].style.color = "black";
                    
                }
                lastStarClicked = currentId;
            }
        }
        
    }

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
            submitButton.disabled = true;
            if (submitButton.classList.contains('blue-btn')) {
                submitButton.classList.remove('blue-btn');
            }
        } else {
            if (!submitButton.classList.contains('blue-btn')) {
                submitButton.classList.add('blue-btn');
            }
            if (!submitButton.classList.contains('disabled')) {
                submitButton.disabled = false;
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

        if (rating == -1 || rating == "-1") {
            return
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

