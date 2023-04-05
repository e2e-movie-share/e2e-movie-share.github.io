
import { register } from '../data/user.js';
import { html } from '../lib/lit-html.js';
import { authPlaceholderValues, createSubmiteHandler } from '../util.js';

const registerTemplate = (onRegister, placeholderValueObject) => html `

<div class="auth-wrapper">
    <div class="auth-container">
        <div class="auth-message">
            <h3>Sign Up here</h3>
            <h5>Already have an account? <a href="/login">Sing In</a></h5>
        </div>
        
        <form @submit=${onRegister} class="login-form">
            <input placeholder="${placeholderValueObject.username}" name="username"></input>
            <input placeholder="${placeholderValueObject.email}" name="email"></input>
            <input placeholder="${placeholderValueObject.password}" name="password" type="password"></input>
            <input placeholder="${placeholderValueObject.repass}" name="repass" type="password"></input>
            <button class="login-form-button">SignUp</button>
        </form>
    </div>
</div>

`;

export async function registerView (ctx) {

    const placeholderValueObject = authPlaceholderValues;

    ctx.render(registerTemplate(createSubmiteHandler(onRegister), placeholderValueObject));

    let inputs = document.getElementsByTagName('input');

    for (let input of inputs) {
        input.addEventListener('focusin', onInputFocus);
        input.addEventListener('focusout', onInputUnfocus);
    }

    function onInputFocus (event) {
        event.target.placeholder = '';
    }

    function onInputUnfocus (event) {
        event.target.placeholder = placeholderValueObject[event.target.name];
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

