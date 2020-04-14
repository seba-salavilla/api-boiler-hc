const { Router } = require('express');
var router = Router(); 

const privateRoutes = require('./private')

privateRoutes.forEach( route =>{
    router.use(route)
})

module.exports = router
