import { getUserData, removeUserData, setUserData } from "./utils/utilsAuth.js";

import { 
    addCommentPointerToObject, 
    addMoviePointerToObject, 
    addOwnerPointerToObject, 
    createPointer, encodeObject, 
    filterRelation 
} from "./utils/utilsCommDB.js";

import { authPlaceholderValues, movieCategories, movieOptions } from "./utils/utilsConstants.js";

import { createRatingObject, createSubmiteHandler } from "./utils/utilsHelpers.js";

//
// 2023-05-01 -> this file will be kept as a centralized exporter for util functions due to legacy reasons,
// It will import utils from utils folder and export them
//

// Auth utils
export { 
    setUserData, 
    getUserData, 
    removeUserData 
}

// General helper utils
export { 
    createSubmiteHandler, 
    createRatingObject 
}

// URL and general DB communication functions utils
export {
    createPointer,
    addOwnerPointerToObject,
    addMoviePointerToObject,
    addCommentPointerToObject,
    filterRelation,
    encodeObject
}

// Data constants utils
export { 
    movieCategories, 
    movieOptions, 
    authPlaceholderValues 
}
