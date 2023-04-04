
import { register } from '../data/user.js';
import { html } from '../lib/lit-html.js';
import { createSubmiteHandler } from '../util.js';

const registerTemplate = (onRegister) => html `

<div class="auth-wrapper">
    <div class="auth-container">
        <div class="auth-message">
            <h3>Sign Up here</h3>
            <h5>Already have an account? <a href="/login">Sing In</a></h5>
        </div>
        
        <form @submit=${onRegister} class="login-form">
            <input placeholder="username" name="username"></input>
            <input placeholder="email" name="email"></input>
            <input placeholder="password" name="password" type="password"></input>
            <input placeholder="password" name="repass" type="password"></input>
            <button class="login-form-button">SignUp</button>
        </form>
    </div>
</div>

`;

export async function registerView (ctx) {

    ctx.render(registerTemplate(createSubmiteHandler(onRegister)));

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

    async function onRegister ({ username, email, password, repass }) {

        if (email == '' || username == '' || password == '' ) {
            return alert('All fields must be filled in!');
        }

        if (password !== repass) {
            return alert('Password do not match!');
        }

        await register(email, username, password);
        ctx.page.redirect('/');

    }

}

