// =============== STORE TOKEN AT LOCALSTORAGE ================
export const saveToken = (key, value) => {
    localStorage.setItem(key, value);
}
// =============== STORE USER AT LOCALSTORAGE ==================
export const saveUser = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
}
// =============== GET TOKEN FROM LOCALSTORAGE =================
export const getToken = (key) => {
    const data = localStorage.getItem(key);
    return data
}
// =============== GET USER FROM LOCALSTORAGE ==================
export const getUser = (key) => {
    const data = localStorage.getItem(key);
    const user = JSON.parse(data)
    return user
}
// =============== REMOVE USER FROM LOCALSTORAGE ================
export const removeUser = (key) => {
    localStorage.removeItem(key);
}