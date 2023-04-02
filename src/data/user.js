import { removeUserData, setUserData } from "../util.js";
import { post } from "./api.js";


export async function register (email, username, password) {

    const { sessionToken, objectId } = await post('/users', { email, username, password });

    const userData = {
        objectId,
        email,
        username,
        sessionToken,
    }

    setUserData(userData);

}


export async function login (email, password) {

    const { sessionToken, objectId, username } = await post('/login', { email, password });

    const userData = {
        objectId,
        email,
        username,
        sessionToken,
    }

    setUserData(userData);

}


export async function logout () {
    // 20230325 -> supposedly, this is everything needed in order to logout, the needed ApplicationId and 
    // JS key are already there, and X-Parse-Session-Token is taken automatically in the request in api.js
    await post('/logout');
    removeUserData();
}
