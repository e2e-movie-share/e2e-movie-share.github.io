
import { html } from '../lib/lit-html.js'

const homeTemplate = (currUser) => html `
<div class="home-page">
    <div class="home-container-wrapper">
        <div class="home-inner-container">
            <div class="home-image-greet">
                ${currUser?html `
                <h2>Welcome back, ${currUser.username}</h2>
                ` : html `
                <h2>Welcome to MovieShare</h2>
                </p><a href="/login">Sign In</a> or <a href="/register">Sign Up</a> if you want to experience the beautiful world of movies</p>
                `}
            </div>
        </div>
    </div>
</div>
`;

// <img src="${'./static/images/cinema.jpeg'}">

export async function showHome (ctx) {

    const currUser = ctx.user;
    ctx.render(homeTemplate(currUser));

}

