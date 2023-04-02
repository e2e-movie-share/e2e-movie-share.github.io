
import { register } from '../data/user.js';
import { html } from '../lib/lit-html.js';
import { createSubmiteHandler } from '../util.js';

const registerTemplate = (onRegister) => html `
<h3>Sign Up</h3>
<form @submit=${onRegister}>
<input placeholder="username" name="username"></input>
<input placeholder="email" name="email"></input>
<input placeholder="password" name="password" type="password"></input>
<input placeholder="password" name="repass" type="password"></input>
<button>SignUp</button>
</form>
`;

export async function registerView (ctx) {

    ctx.render(registerTemplate(createSubmiteHandler(onRegister)));

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

