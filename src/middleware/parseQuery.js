
// 20230325 -> loading ctx with a query object , which is flled with different key-value pairs,
// based on needs: search, filter, etc.
export function addQuery () {

    return function (ctx, next) {
        ctx.query = {
            
        }
        if (ctx.querystring) {
            const query = Object.fromEntries(ctx.querystring
                .split('&')
                .map(e => e.split('=')))
            Object.assign(ctx.query, query);
        }
    
        next();
    }
}

