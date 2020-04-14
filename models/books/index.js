const { collections, ObjectID, Tables } = require('../../services/mongo')
const Scheme = require('./scheme')
const nameTable = Tables.books

const Model = {
    create : async (data) =>{
        data.created_on = new Date()
        let result = await collections(nameTable).insertOne(data);
        return result;
    },
    updateOne : async (data) =>{
        let result = await collections(nameTable).findOneAndUpdate(
            {_id:new ObjectID(data._id)},
            {$set:{
                name                : data.name,
                enabled             : data.enabled,
                updated_on          : new Date()
            }},{returnOriginal:false});
        return result;
    },
    deleteOne : async (id) =>{
        let result = await collections(nameTable).findOneAndDelete({_id:new ObjectID(id)});
        return result;
    },
    getAll : async () => {
        let result = await collections(nameTable).find({}).toArray();
        return result;
    },
    getByName : async (name) =>{
        let result = await collections(nameTable).findOne({name});
        return result;
    },
    getById : async (id) =>{
        let result = await collections(nameTable).findOne({_id:new ObjectID(id)});
        return result;
    }
}

module.exports = {Model, Scheme}