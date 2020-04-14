var controller = require('../../controllers/private/AccountController')
const router= require('express').Router();

router
.post('/account', controller.postAccount)
.get('/account', controller.getAll)
.put('/account', controller.editAccount)
.delete('/account/:id', controller.removeOne)

.put('/account/pass', controller.setPass)

module.exports = router;