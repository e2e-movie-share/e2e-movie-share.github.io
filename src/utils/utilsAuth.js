export function setUserData(data) {
    sessionStorage.setItem('userData', JSON.stringify(data));
}

export function getUserData() {

    const data = JSON.parse(sessionStorage.getItem('userData'));
    return data;

}

export function removeUserData() {
    sessionStorage.removeItem('userData');
}
