const bcrypt = require('bcryptjs')
const {Model, Scheme} = require('../../models/accounts')
const logger = require('../../config/logger').getLogger('api')
const Logdb = require('../../models/log')

const controller = {
    postAccount : async (req, res) =>{
        try {
            logger.info(`POST NEW ACCOUNT`)
            logger.info(req.body)

            //VALIDA SCHEME
            let {error, value} = Scheme.Valid(req.body)
            if(error){
                logger.error("Error de validacion en los datos enviados")
                logger.error(error)
                return res.status(400).send({success:false, message:"Error en los datos enviados", error})
            }

            //VALIDA SI EXISTE USERNAME
            let exists = await Model.checkUsername(value.username)
            if(exists){
                logger.error("Cuenta ya existe!")
                return res.status(200).send({success:false, message:"Nombre de usuario ya existe"})
            }

            //HASH PASSWORD
            let passHash = bcrypt.hashSync(value.password, 8)
            
            //CREATE USER
            let result = await Model.createAccount(value, passHash)
            if(result.error){
                logger.warn(`Error al crear usuario en base de datos`)
                logger.warn(result)
                return res.status(400).send({success:false, message:`Error al guardar usuario`, code:120})
            }

            res.status(200).send({success:true, message:`Usuario creado correctamente`, data:result.ops[0]});
            Logdb.createLog(2, value.username, req.user, req.ipInfo)
        } catch (err) {
            logger.fatal(`Error al crear Usuario - ` + err)
            res.status(500).send({success:false, message:'Lo sentimos hubo un problema con los servicios', code:121})
        }
    },

    editAccount : async (req, res) =>{
        try {
            logger.info(`EDIT ACCOUNT`)
            logger.info(req.body)

            //VALIDA SCHEME
            let {error, value} = Scheme.Valid(req.body)
            if(error){
                logger.error("Error de validacion en los datos enviados")
                logger.error(error)
                return res.status(400).send({success:false, message:"Error en los datos enviados", error})
            }

            //EDIT ACCOUNT
            let result = await Model.editAccount(value)
            if(result.error || !result.value){
                logger.warn(`Error al edit Usuario en base de datos`)
                logger.warn(result)
                return res.status(400).send({success:false, message:`Error al editar cuenta`, code:137})
            }

            result.value.password = ''
            res.status(200).send({success:true, message:`Cuenta actualizada correctamente`, data:result.value});
            
            Logdb.createLog(3, result.value.username, req.user, req.ipInfo)
        } catch (err) {
            logger.fatal(`Error al editar Usuario - ` + err)
            res.status(500).send({success:false, message:'Lo sentimos hubo un problema con los servicios', code:138})
        }
    },

    getAll : async (req, res) =>{
        try {
            logger.info(`GET ALL ACCOUNTS`)
            
            let result = await Model.findAll()
            if(result.error){
                logger.warn(`Error al obtener cuentas avl en base de datos`)
                logger.warn(result)
                return res.status(400).send({success:false, message:`Error al obtener cuentas`, code:125})
            }

            res.status(200).send({success:true, result});

        } catch (err) {
            logger.fatal(`Error al obtener cuentas - ` + err)
            res.status(500).send({success:false, message:'Lo sentimos hubo un problema con los servicios', code:126})
        }
    },

    removeOne : async (req, res) =>{
        try {
            logger.info(`DELETE ONE ACCOUNT`)
            logger.info(req.params)
            
            let {error, value} = Scheme.ID(req.params.id)
            if(error){
                logger.error("Error de validacion en los datos enviados")
                logger.error(error)
                return res.status(400).send({success:false, message:"Error en los datos enviados", error})
            }
            let result = await Model.deleteAccount(value)
            if(result.error || !result.value){
                logger.warn(`Error al borrar cuenta avl en base de datos`)
                logger.warn(result)
                return res.status(400).send({success:false, message:`Error al borrar cuenta`, code:129})
            }

            res.status(200).send({success:true, message:"Cuenta borrada correctamente"});
        
            Logdb.createLog(4, result.value.username, req.user, req.ipInfo)
        } catch (err) {
            logger.fatal(`Error al obtener cuentas de avl - ` + err)
            res.status(500).send({success:false, message:'Lo sentimos hubo un problema con los servicios', code:130})
        }
    },

    setPass : async (req, res) =>{
        try {
            logger.info(`UPDATE PASS ACCOUNT`)
            logger.info(req.body)
            
            //VALIDA SCHEME
            let {error, value} = Scheme.SchemePass(req.body)
            if(error){
                logger.error("Error de validacion en los datos enviados")
                logger.error(error)
                return res.status(400).send({success:false, message:"Error en los datos enviados", error})
            }
            
            //HASH NEW PASSWORD
            let passHash = bcrypt.hashSync(value.password, 8)

            let result = await Model.setPass(value._id, passHash)
            if(result.error || !result.value){
                logger.warn(`Error al modificar password en base de datos`)
                logger.warn(result)
                return res.status(400).send({success:false, message:`Error al cambiar contraseña.`, code:133})
            }

            res.status(200).send({success:true, message:"Contraseña actualizada correctamente"});
            
            Logdb.createLog(5, result.value.username, req.user, req.ipInfo)
        } catch (err) {
            logger.fatal(`Error al cambiar contraseña cuenta - ` + err)
            res.status(500).send({success:false, message:'Lo sentimos hubo un problema con los servicios', code:134})
        }
    }


}
module.exports = controller