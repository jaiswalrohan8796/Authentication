const express = require("express");
const router = express.Router()
const {getLogin,postLogin,getRegister,postRegister,getDashboard, isAuthMiddleware, postLogout,getReset,postReset,getNewPassword,postNewPassword } = require('../controller/controllers.js')


router.get('/',getLogin)
router.post('/login',postLogin)
router.get('/register',getRegister)
router.post('/register',postRegister)
router.get('/dashboard',isAuthMiddleware,getDashboard)
router.post('/logout', postLogout)
router.get('/reset',getReset)
router.post('/reset',postReset)
router.post('/new-password',postNewPassword)
router.get('/new-password/:token',getNewPassword)

module.exports = router