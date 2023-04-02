import { logout } from "../data/user.js";
import { secondNavTemplate } from "./nav.js";


export function onLogout (ctx) {

    logout();
    ctx.page.redirect('/');

}
