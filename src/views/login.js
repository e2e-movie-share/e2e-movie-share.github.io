
import { login } from '../data/user.js';
import { html } from '../lib/lit-html.js';
import { createSubmiteHandler } from '../util.js';


const loginTemplate = (onLogin) => html `

    <div class="auth-wrapper">
        <div class="auth-container">
            <div class="auth-message">
                <h3>Sign In to MovieShare</h3>
                <h5>Don't have an account? <a href="/register">Sign Up</a></h5>
            </div>
            <form @submit=${onLogin} class="login-form">
            <input placeholder="email" name="email"></input>
            <input placeholder="password" name="password" type="password"></input>
            <br>
            <button class="login-form-button">SignIn</button>
            </form>
        </div>
    </div>
`;

export async function loginView(ctx) {

    ctx.render(loginTemplate(createSubmiteHandler(onLogin)));

    let inputs = document.getElementsByTagName('input');

    for (let input of inputs) {
        input.addEventListener('focusin', onInputFocus);
        input.addEventListener('focusout', onInputUnfocus);
    }

    function onInputFocus (event) {
        event.target.placeholder = '';
    }

    function onInputUnfocus (event) {
        event.target.placeholder = event.target.name;
    }


    async function onLogin ({ email, password }) {

        if (email == '' || password == '' ) {
            return alert('All fields must be filled in!');
        }

        await login(email, password);
        ctx.page.redirect('/');

    }

}
