export function createSubmiteHandler(callback, shouldClear) {

    return function (event) {

        event.preventDefault();
        const eventData = new FormData(event.target);
        const data = Object.fromEntries([...eventData].map(([k, v]) => [k, v.trim()]));
        const children = event.target.children;

        if (shouldClear) {
            for (let child of children) {
                console.log(child.tagName)
                if (child.tagName == "INPUT") {
                    child.value = '';
                }
            }
        }

        callback(data, event.target);

    }

};

// function which takes the list of ratings returned when accessing the detail page of a movie,
// and returns an object containing the necessary properties -> average, number of ratings,
// and if the current user has rated
// 20230325 -> and the current RATING id, so that a delete request can easily be sent;
// and also the rating of the current user
export function createRatingObject(listOfRatings, currentUser) {

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