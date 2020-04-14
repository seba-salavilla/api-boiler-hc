const {Model} = require('../../models/accounts')
const Logdb = require('../../models/log')
const config = require('../../config')
const logger = require('../../config/logger').getLogger('api')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')


const AuthController = {
    Authentication : async (req, res) => {
        try {
            logger.info(`INICIO DE SESION`)
            logger.info(req.body)
            let user = await Model.getAccount(req.body.username)
            if (!user) return res.status(403).send({ success: false, message: "Nombre de usuario/contraseña incorrectos" })
            if (user.error) return res.status(500).send({success:false, message:'Error en los servicios. Code: 7000', code:7000})
            if(!user.enabled) return res.status(403).send({ success: false, message: "Lo sentimos permisos insuficientes" })

            var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
            if (!passwordIsValid) return res.status(403).send({ success: false, message: "Nombre de usuario/contraseña incorrectos" });
            
            var token = jwt.sign({ _id: user._id }, config.TOKEN_KEY_AVL, {
                expiresIn: 86400 // expires in 24 hours
            })
            user.password = ''
            console.log("SETLASTLOGIN",typeof user._id)
            Model.setLastLogin(user._id)

            Logdb.createLog(1, 'API', user, req.ipInfo)
            res.status(200).send({ success:true, token, user })
        } catch (err) {
            logger.fatal(`Error en inicio de sesion Code: 7001 ${err}`)
            res.status(500).send({success:false, message:'Error en los servicios. Code: 7001', code:7001})
        }
    },
    verifyLogin : async (req, res, next) => {
        try {
            logger.info("VERIFICANDO LOGIN")
            logger.info(JSON.stringify(req.headers))

            var token = req.headers['authorization']
            if (!token || !token.startsWith("Bearer ")){
                logger.warn("NO TOKEN PROVIDED VERIFICANDO LOGIN!")
                return res.status(403).send({ success: false, message: 'No ha iniciado sesión.' });
           } 
            token = token.slice(7, token.length);
            jwt.verify(token, config.TOKEN_KEY_AVL, async function(err, decoded) {
                try {
                    if (err){
                        logger.error("ATENCION! Token invalido "+ err)
                        return res.status(403).send({ success: false, message: 'La sesión ha expirado.' });
                    }
                    //logger.info(decoded)
                    let user = await Model.getAccountByID(decoded._id)
                    logger.info(user)
                    if (!user || user.error) {
                        logger.error("ATENCION! error al obtener usuario ", user)
                        return res.status(403).send({success:false, message:'Error usuario no encontrado.'});
                    }
                    if(!user.enabled){
                        logger.error("ATENCION! usuario está deshabilitado ")
                        return res.status(403).send({success:false, message:'No tienes los permisos suficientes.'});
                    }
                    
                    user.password = ''
                    res.status(200).send({ success:true, user })
                } catch (err) {
                    logger.fatal("Error en decodificar token, Code: 7200 "+err)
                    res.status(500).send({success:false, message:'Error en los servicios, código: 7200', code:7200})
                }
            })
        } catch (err) {
            logger.fatal("Error en verificar login, Code: 7201 "+err)
            res.status(500).send({success:false, message:'Error en los servicios, código: 7201', code:7201})
        }
    }
}

module.exports = AuthController