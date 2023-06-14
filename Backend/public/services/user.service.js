import { storageService } from './async-storage.service.js'
// import { httpService } from './http.service.js'

const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'

export const userService = {
    login,
    logout,
    signup,
    getLoggedinUser,
    saveLocalUser,
    query,
    getById,
    remove,
    update
}

window.userService = userService


function query() {
    return storageService.query('user')
    // return httpService.get(`user`)
}


async function getById(userId) {
    const user = await storageService.get('user', userId)
    // const user = await httpService.get(`user/${userId}`)
    return user
}
function remove(userId) {
    return storageService.remove('user', userId)
    // return httpService.delete(`user/${userId}`)
}

async function update(user) {
    await storageService.put('user', user)
    // user = await httpService.put(`user/${user._id}`, user)
    // Handle case in which admin updates other user's details
    if (getLoggedinUser()._id === user._id) saveLocalUser(user)
    return user
}

async function login(userCred) {
    const users = await storageService.query('user')
    const user = users.find(user => user.userName === userCred.userName)
    // const user = await httpService.post('auth/login', userCred)
    if (user) {
        // socketService.login(user._id)
        return saveLocalUser(user)
    }
}
async function signup(userCred) {
    const user = await storageService.post('user', userCred)
    // const user = await httpService.post('auth/signup', userCred)
    // socketService.login(user._id)
    return saveLocalUser(user)
}
async function logout() {
    sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
    socketService.logout()
    // return await httpService.post('auth/logout')
}


function saveLocalUser(user) {
    user = {_id: user._id, username: user.userName}
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
    return user
}

function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
}

