const config = require('./index')
const logger = require('./logger').getLogger('api')
const jwt = require('jsonwebtoken')
const {Model} = require('../models/accounts')

let guard = {
    //MIDDLEWARE GUARD SECURITY
    ShieldRoute : async (req, res, next) => {
        try {
            logger.info(JSON.stringify(req.headers))
            
            var token = req.headers['authorization']
            if (!token || !token.startsWith("Bearer ")){
                logger.warn("GUARD AVL NO TOKEN PROVIDED!")
                return res.status(403).send({ success: false, message: 'La autentificación es requerida.' });
            } 
            token = token.slice(7, token.length);
            jwt.verify(token, config.TOKEN_KEY_AVL, async function(err, decoded) {
                try {
                    if (err){
                        logger.error("ATENCION! Token invalido "+ err)
                        return res.status(403).send({ success: false, message: 'La sesión ha expirado.' });
                    }
                    logger.info(decoded)
                    let user = await Model.getAccountByID(decoded._id)
                    logger.info(user)
                    if (!user || user.error) {
                        logger.error("ATENCION! error al obtener usuario ", user)
                        return res.status(403).send({success:false, message:'Usuario no encontrado.'});
                    }
                    if(!user.enabled){
                        logger.error("ATENCION! usuario está deshabilitado ")
                        return res.status(403).send({success:false, message:'La cuenta ha sido bloqueada.'});
                    }
                    
                    user.password = ''
                    req.user = user
                    next()
                } catch (err) {
                    logger.fatal("Error en decodificar token, Code: 7300 "+err)
                    res.status(500).send({success:false, message:'Error en los servicios, código: 7300', code:7300})
                }
            })
        } catch (err) {
            logger.fatal("Error en verificar login, Code: 7301 "+err)
            res.status(500).send({success:false, message:'Error en los servicios, código:7301', code:7301})
        }
    },

    AdminAccess : async (req, res, next) => {
        try {
            if (req.user && req.user.rol <= 0) {
                next()
            }else{
                logger.warn(`ATENCION! usuario: ${req.user.username}  rol: ${req.user.rol} con permisos insuficientes`)
                return res.status(403).send({success:false, message:'Permisos insuficientes para realizar esta acción'});

            }
        } catch (err) {
            logger.fatal("Error de admin acceso , Code: 7400 "+err)
            res.status(500).send({success:false, message:'Error en los servicios, código: 7400', code:7400})
        }
    },

    OperadorAccess : async (req, res, next) => {
        try {
            if (req.user && req.user.rol <= 1) {
                next()
            }else{
                logger.warn(`ATENCION! usuario: ${req.user.username}  rol: ${req.user.rol} con permisos insuficientes`)
                return res.status(403).send({success:false, message:'Permisos insuficientes para realizar esta acción'});

            }
        } catch (err) {
            logger.fatal("Error operador acceso , Code: 7401 "+err)
            res.status(500).send({success:false, message:'Error en los servicios, código: 7401', code:7401})
        }
    },
    BasicAccess : async (req, res, next) => {
        try {
            if (req.user && req.user.rol <= 2) {
                next()
            }else{
                logger.warn(`ATENCION! usuario: ${req.user.username}  rol: ${req.user.rol} con permisos insuficientes`)
                return res.status(403).send({success:false, message:'Permisos insuficientes para realizar esta acción'});

            }
        } catch (err) {
            logger.fatal("Error operador acceso , Code: 7401 "+err)
            res.status(500).send({success:false, message:'Error en los servicios, código: 7401', code:7401})
        }
    }
}

module.exports = guard

