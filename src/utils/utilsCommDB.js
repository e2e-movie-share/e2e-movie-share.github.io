export function createPointer(className, objectId) {
    return {
        __type: 'Pointer',
        className,
        objectId,
    }
}

export function addOwnerPointerToObject(object, ownerId) {

    const data = Object.assign({}, object);
    data.owner = createPointer('_User', ownerId);
    return data;

}

export function addMoviePointerToObject(object, movieId) {

    const data = Object.assign({}, object);
    data.moviePointer = createPointer('Movie', movieId);
    return data;

}

export function addCommentPointerToObject(object, commentId) {

    const data = Object.assign({}, object);
    data.originalComment = createPointer('Comment', commentId);
    return data;

}

export function filterRelation(field, collection, objectId) {

    const relation = {
        [field]: createPointer(collection, objectId)
    }
    return relation;

}

export function encodeObject(object) {
    return encodeURIComponent(JSON.stringify(object));
}
