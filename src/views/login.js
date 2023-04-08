
import { login } from '../data/user.js';
import { html } from '../lib/lit-html.js';
import { authPlaceholderValues, createSubmiteHandler } from '../util.js';


const loginTemplate = (onLogin, placeholderValueObject) => html`

    <div class="auth-wrapper">
        <div class="auth-container">
            <div class="auth-message">
                <h3>Sign In to MovieShare</h3>
                <h5>Don't have an account? <a href="/register">Sign Up</a></h5>
                <p class="login-error-message">Error placeholder</p>
            </div>
            <form @submit=${onLogin} class="login-form">
            <input placeholder="${placeholderValueObject.email}" name="email"></input>
            <input placeholder="${placeholderValueObject.password}" name="password" type="password"></input>
            <br>
            <button class="login-form-button">SignIn</button>
            </form>
        </div>
    </div>
`;

export async function loginView(ctx) {

    const placeholderValueObject = authPlaceholderValues;

    ctx.render(loginTemplate(createSubmiteHandler(onLogin), placeholderValueObject));

    let inputs = document.getElementsByTagName('input');

    for (let input of inputs) {
        input.addEventListener('focusin', onInputFocus);
        input.addEventListener('focusout', onInputUnfocus);
    }

    function onInputFocus(event) {
        event.target.placeholder = '';
    }

    function onInputUnfocus(event) {

        // when a field is red due to being submitted unfilled, and the user fills it,
        // indicate that by removing the red color; the same as in register
        if (event.target.style.borderColor == 'red') {
            if (event.target.value != '') {
                event.target.style.borderColor = 'black';
            }
        }

        event.target.placeholder = placeholderValueObject[event.target.name];
    }


    async function onLogin({ email, password }) {

        const errorMessage = document.querySelector(".login-error-message");

        if (email == '' || password == '') {
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
        try {
            await login(email, password);
            ctx.page.redirect('/');
        } catch (err) {

            const errorObject = JSON.parse(err.message);

            if (errorObject.code == 101) {
                
                errorMessage.textContent = `${errorObject.error}!`;
                errorMessage.style.display = "block";
                let inputs = document.querySelectorAll('input');
                for (let input of inputs) {
                    input.style.borderColor = "red";
                }
            }

            // old error handling
            // alert (err.message);    
        }



    }

}
