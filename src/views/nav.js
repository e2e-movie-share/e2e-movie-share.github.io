
import { html } from '../lib/lit-html.js';


export const navTemplate = (hasUser) => html `

    <div class="navbar-container">
        <a href="/" class="first-nav"> <i class="fa-solid fa-ticket"></i>  Home</a>
        <div class="navbar-menu">
            
            <a href="/catalog" class="nav-item">All Movies</a>
            ${hasUser ? html `
            <a href="/profile" class="nav-item">Profile</a>
            <a href="/create" class="nav-item">Create</a>
            <a href="/logout" class="nav-item">Logout</a>
            ` : html `
            <a href="/register" class="nav-item">Sign Up</a>
            <a href="/login" class="nav-item">Sign In</a>
            `}
        </div>
    </div>

`;

export const secondNavTemplate = (hasUser) => html `

        <div class="navbar-container-2">
            <a href="/" id="navbar-logo"> <i class="fa-solid fa-ticket"></i>  Home</a>
            <div class="navbar-toggle" id="mobile-menu">
                <span class="bar"></span>
                <span class="bar"></span>
                <span class="bar"></span>
            </div>
            <ul class="navbar-menu-2">
                <li class="navbar-item">
                    <a href="/catalog" class="navbar-links">
                        View Movies
                    </a>
                </li>
                ${hasUser ? html `
                <li class="navbar-item">
                    <a href="/create" class="navbar-links">
                        Create
                    </a>
                </li>
                <li class="navbar-item">
                    <a href="/" class="navbar-links">
                        Your Profile
                    </a>
                </li>
                <li class="navbar-item">
                    <a href="/logout" class="navbar-links">
                        Logout
                    </a>
                </li>
                ` : html `
                <li class="navbar-item">
                    <a href="/register" class="navbar-links">
                        Sign Up
                    </a>
                </li>
                <li class="navbar-item">
                    <a href="/login" class="navbar-links">
                        Sign In
                    </a>
                </li>
                `}
            </ul>
        </div>

`
