const { collections, ObjectID, Tables } = require('../../services/mongo')
const Scheme = require('./scheme')
const nameTable = Tables.account

const Model = {
    /**
     * FOR ACCOUNT CONTROLLER
     */
    createAccount : async (data, passhash) =>{
        data.created_on = new Date()
        data.password = passhash
        let result = await collections(nameTable).insertOne(data);
        return result;
    },
    deleteAccount : async (id)=>{
        let result = await collections(nameTable).findOneAndDelete({_id: new ObjectID(id)})
        return result
    },
    setPass : async (id, passhash)=>{
        let result = await collections(nameTable).findOneAndUpdate(
            {_id: new ObjectID(id)},
            {$set:{password:passhash,updated_on: new Date()}})
        return result
    },
    editAccount : async (data)=>{
        let result = await collections(nameTable).findOneAndUpdate(
            {_id: new ObjectID(data._id)},
            {$set:{
                name:data.name,
                email: data.email,
                rol: data.rol,
                enabled:data.enabled,
                updated_on: new Date()
            }
            },{returnOriginal:false})
        return result
    },
    findAll : async ()=>{
        let result = await collections(nameTable).find({rol:{
            $lte:2,
            $gte:0
        }}).toArray();
        return result;
    },

    checkUsername : async (username) =>{
        let result = await collections(nameTable).findOne({username});
        return result;
    },

    /**
     * FOR LOGIN CONTROLLER
     */
    getAccount : async (username) =>{
        let result = await collections(nameTable).findOne({username, rol:{$lte:2}});
        return result;
    },

    getAccountByID : async (id) =>{
        let result = await collections(nameTable).findOne({_id:new ObjectID(id)});
        return result;
    },
    
    setLastLogin : async (id) =>{
        collections(nameTable).updateOne({_id:id},{$set:{last_login:new Date()}})
    }
}

module.exports = {Model, Scheme}