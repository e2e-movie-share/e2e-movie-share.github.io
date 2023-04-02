

export function addUserNav(navTemplate) {

    let hasUser = null;

    return function (ctx, next) {

        if (Boolean(ctx.user) !== hasUser) {
            hasUser = ctx.user;
            ctx.renderNav(navTemplate(hasUser));
            const menu = document.querySelector('#mobile-menu');
            const menuLinks = document.querySelector('.navbar-menu-2');

            menu.addEventListener('click', function () {
                menu.classList.toggle('is-active');
                menuLinks.classList.toggle('active');
            })
        }
        next();

    }

}

