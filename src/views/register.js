
import { register } from '../data/user.js';
import { html } from '../lib/lit-html.js';
import { authPlaceholderValues, createSubmiteHandler } from '../util.js';

const registerTemplate = (onRegister, placeholderValueObject) => html`

<div class="auth-wrapper">
    <div class="auth-container">
        <div class="auth-message">
            <h3>Sign Up here</h3>
            <h5>Already have an account? <a href="/login">Sing In</a></h5>
            <p class="register-error-message"></p>
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

export async function registerView(ctx) {

    const placeholderValueObject = authPlaceholderValues;

    ctx.render(registerTemplate(createSubmiteHandler(onRegister), placeholderValueObject));

    let inputs = document.getElementsByTagName('input');

    for (let input of inputs) {
        input.addEventListener('focusin', onInputFocus);
        input.addEventListener('focusout', onInputUnfocus);
    }

    function onInputFocus(event) {
        event.target.placeholder = '';
    }

    function onInputUnfocus(event) {
        event.target.placeholder = placeholderValueObject[event.target.name];
    }

    async function onRegister({ username, email, password, repass }) {

        const errorMessage = document.querySelector(".register-error-message");

        for (let input of document.querySelectorAll('input')) {
            if (input.value != '' && input.style.borderColor == 'red') {
                console.log(`Changing color - ${input.name}`)
                input.style.borderColor = 'black';
            }
        }

        if (email == '' || username == '' || password == '' || repass == '') {
            for (let input of document.querySelectorAll('input')) {
                if (input.value == '') {
                    input.style.borderColor = "red";
                } else {
                    input.style.borderColor = "black"
                }
            }
            errorMessage.textContent = `Please fill in all the fields!`;
            errorMessage.style.display = "block";
            return;
        }

        if (password !== repass) {
            errorMessage.textContent = `Passwords do not match!`;
            errorMessage.style.display = "block";
            document.querySelector('[name="password"]').style.borderColor = "red";
            document.querySelector('[name="repass"]').style.borderColor = "red";
            return;
        }
        try {
            await register(email, username, password);
            ctx.page.redirect('/');
        } catch (err) {
            const errorObject = JSON.parse(err.message);

            if (errorObject.code == 203) {
                errorMessage.textContent = `${errorObject.error}!`;
                errorMessage.style.display = "block";
                document.querySelector('[name="email"]').style.borderColor = "red";
            }

            console.log(errorObject.code);
        }
        

    }

}

