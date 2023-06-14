const Cryptr = require('cryptr')
const bcrypt = require('bcrypt')
const userService = require('../user/user.service')
const logger = require('../../services/logger.service')
const cryptr = new Cryptr(process.env.SECRET1 || 'Secret-Puk-1234')

module.exports = {
    signup,
    login,
    getLoginToken,
    validateToken
}

async function login(userName, password) {
    logger.debug(`auth.service - login with username: ${userName}`)

    const user = await userService.getByUsername(userName)
    console.log('user:',user)
    if (!user) return Promise.reject('Invalid userName or password')
    // TODO: un-comment for real login
    // const match = await bcrypt.compare(password, user.password)
    // if (!match) return Promise.reject('Invalid username or password')

    delete user.password
    user._id = user._id.toString()
    return user
}
   

async function signup({userName, password, fullName, email}) {
    const saltRounds = 10

    logger.debug(`auth.service - signup with username: ${userName}, fullName: ${fullName}`)
    if (!userName || !password || !fullName || !email)  return Promise.reject('Missing required signup information')

    const userExist = await userService.getByUsername(userName)
    if (userExist) return Promise.reject('Username already taken')

    const hash = await bcrypt.hash(password, saltRounds)
    return userService.add({ userName, password: hash, fullName, email })
}


function getLoginToken(user) {
    const userInfo = {_id : user._id, fullName: user.fullName}
    return cryptr.encrypt(JSON.stringify(userInfo))    
}

function validateToken(loginToken) {
    try {
        const json = cryptr.decrypt(loginToken)
        const loggedinUser = JSON.parse(json)
        return loggedinUser
    } catch(err) {
        console.log('Invalid login token')
    }
    return null
}
