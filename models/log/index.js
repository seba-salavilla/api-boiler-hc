const { collections, ObjectID, Tables } = require('../../services/mongo')
const nameTable = Tables.log

const log_code = [
    "Acción no identificada",//0
    "Nuevo inicio de sesión",//1
    "Nueva cuenta de usuario",//2
    "Cuenta modificada",//3
    "Cuenta eliminada",//4
    "Contraseña cuenta modificada",//5
    
    "Nuevo libro",//6
    "Libro modificado",//7
]

const Model = {
    createLog : async (code, object, user, ip) =>{
        collections(nameTable).insertOne({
            code: code,
            action:`${log_code[code]} (${object})`,
            user: {
                username: user.username, 
                name: user.name,
                rol:user.rol,
                _id:user._id
            },
            ip_address: ip,
            date : new Date()
        });
    }
}

module.exports = Model