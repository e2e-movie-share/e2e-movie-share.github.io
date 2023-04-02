import { create } from "../data/movie.js";
import { repeat } from "../lib/directives/repeat.js";
import { html } from "../lib/lit-html.js";
import { createSubmiteHandler, getUserData, movieOptions } from "../util.js";


const createMovieTemplate = (onMovieCreate, options) => html`
    <div class="form-wrapper">
        <h3>Add a new movie to discuss to the website!</h3>
        <form @submit=${onMovieCreate} class="create-movie-form"> 
            <input name="name" placeholder="name"></input>    
            <input name="year" placeholder="Release date" type="number"></input>    
            <select name="rating">
                ${repeat(options, optionsCard)}
            </select>    
            <textarea name="description" placeholder="Description" rows=10 cols=10></textarea>  
            <input name="imageUrl" placeholder="Image URL"></input>
            <button>Create</button>    
        </form>
    </div>
`;

const optionsCard = (option) => html `
<option value="${option[0]}">${option[1]}</option>
`

export async function createMovieView (ctx) {

    const options = Object.entries(movieOptions);
    console.log(options)

    ctx.render(createMovieTemplate(createSubmiteHandler(onMovieCreate), options));

    async function onMovieCreate ({ name, year, rating, description, imageUrl }) {

        if (name == '' || year == '' || rating == '' || description == '') {
            return alert ('Please fill in all the the fields!');
        }

        if (Number(year) < 1895) {
            return alert('Please enter a valid year!');
        }

        year = Number(year);

        const movieData = {
            name,
            year, 
            rating, 
            description, 
            imageUrl
        }
        
        const currentUserId = ctx.user?.objectId;

        await create(movieData, currentUserId);
        ctx.page.redirect('/');

    }

}


