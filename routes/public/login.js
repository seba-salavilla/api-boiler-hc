var loginDashboard = require('../../controllers/login')
const router= require('express').Router();

router
.post('/auth', loginDashboard.Authentication)
.get('/verify', loginDashboard.verifyLogin)

module.exports = router;