
export function setUserData (data) {
    sessionStorage.setItem('userData', JSON.stringify(data));
}

export function getUserData () {

    const data = JSON.parse(sessionStorage.getItem('userData'));
    return data;

}

export function removeUserData () {
    sessionStorage.removeItem('userData');
}


export function createSubmiteHandler(callback) {

    return function (event) {

        event.preventDefault();
        const eventData = new FormData(event.target);
        const data = Object.fromEntries([...eventData].map(([k, v])=>[k, v.trim()]));
        const children = event.target.children;

        for (let child of children) {
            console.log(child.tagName)
            if (child.tagName=="INPUT") {
                child.value = '';
            }
        }

        callback(data, event.target);

    }

}


export function createPointer (className, objectId) {
    return {
        __type: 'Pointer',
        className,
        objectId,
    }
}


export function addOwnerPointerToObject (object, ownerId) {

    const data = Object.assign({}, object);
    data.owner = createPointer('_User', ownerId);
    return data;

}

export function addMoviePointerToObject (object, movieId) {

    const data = Object.assign({}, object);
    data.moviePointer = createPointer('Movie', movieId);
    return data;

}


export const movieOptions = {
    'G': 'General Audiences [G]',
    'PG': 'Parental Guidance [PG]',
    'PG-13': 'Strong Parental Guidance [PG-13]',
    'R': 'Restricted [R]',
    'NC-17': 'No One 17 and Under [NC-17]',
}

export function filterRelation (field, collection, objectId) {

    const relation = {
        [field]: createPointer(collection, objectId)
    }
    return relation;

}

export function encodeObject(object) {
    return encodeURIComponent(JSON.stringify(object));
}


// function which takes the list of ratings returned when accessing the detail page of a movie,
// and returns an object containing the necessary properties -> average, number of ratings,
// and if the current user has rated
// 20230325 -> and the current RATING id, so that a delete request can easily be sent;
// and also the rating of the current user
export function createRatingObject (listOfRatings, currentUser) {

    let result = {

    }

    const length = listOfRatings.length;
    let sum = 0;
    let hasRated = false;
    let ratingId;
    let currentUserRating;

    for (let rating of listOfRatings) {
        sum += rating.rating;
        if (rating.owner.objectId == currentUser) {
            hasRated = true;
            ratingId = rating.objectId;
            currentUserRating = rating.rating;
        }
    }

    const average = (sum / length).toFixed(2);

    result.hasRated = hasRated;
    result.length = length;
    result.average = average;
    result.ratingId = ratingId;
    result.currentUserRating = currentUserRating;

    return result;

}
