
import { login } from '../data/user.js';
import { html } from '../lib/lit-html.js';
import { createSubmiteHandler } from '../util.js';


const loginTemplate = (onLogin) => html `
    <h3>Sign In</h3>
    <form @submit=${onLogin}>
    <input placeholder="email" name="email"></input>
    <input placeholder="password" name="password" type="password"></input>
    <button>SignIn</button>
    </form>
`;

export async function loginView(ctx) {

    ctx.render(loginTemplate(createSubmiteHandler(onLogin)));


    async function onLogin ({ email, password }) {

        if (email == '' || password == '' ) {
            return alert('All fields must be filled in!');
        }

        await login(email, password);
        ctx.page.redirect('/');

    }

}
