
// imports 
import { render, html} from './lib/lit-html.js';
import { until } from './lib/directives/until.js'
import page from './lib/page.mjs'
import { addRender } from './middleware/render.js';
import { showHome } from './views/home.js';
import { addSession } from './middleware/session.js';
import { getUserData } from './util.js';
import { addUserNav } from './middleware/navRender.js';
import { navTemplate, secondNavTemplate } from './views/nav.js';
import { loginView } from './views/login.js';
import { onLogout } from './views/logout.js';
import { registerView } from './views/register.js';
import { create, getAllMovies } from './data/movie.js';
import { createMovieView } from './views/create.js';
import { catalogView } from './views/catalog.js';
import { authRequiredGuard } from './middleware/guards.js';
import { showDetails } from './views/details.js';
import { addQuery } from './middleware/parseQuery.js';


// middlewares added, loading ctx
page(addRender(document.getElementById('main'), document.querySelector('nav')));
page(addSession(getUserData));
// page(addUserNav(navTemplate));
page(addUserNav(secondNavTemplate));
// 20230325 -> loading the middleware, which loads ctx with any querystring params
page(addQuery());

// navigation 
page('/', showHome);
page('/login', loginView);
page('/register', registerView);
page('/logout', onLogout);
page('/catalog', catalogView);
// page('/test', () => console.log('test111??'));
// page('/test/:id', () => console.log('id test??'));
page('/catalog/:id', showDetails);
page('/create', authRequiredGuard(), createMovieView);

// starting the app
page.start();

window.create = create;
window.getAllMovies = getAllMovies;
