

export function addUserNav(navTemplate) {

    let hasUser = null;

    return function (ctx, next) {

        if (Boolean(ctx.user) !== hasUser) {
            hasUser = ctx.user;
            ctx.renderNav(navTemplate(hasUser));
            const menu = document.querySelector('#mobile-menu');
            const menuLinks = document.querySelector('.navbar-menu-2');
            if (menu.getAttribute('listener') == null) {
                menu.addEventListener('click', onNavBarClick);
                menu.setAttribute('listener', 'true');
                console.log('setting');
            }
            
            function onNavBarClick () {
                menu.classList.toggle('is-active');
                menuLinks.classList.toggle('active');
            }

        }
        next();

    }

}

