const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const Scheme = Joi.object().keys({
    _id                 : Joi.objectId(),
    name                : Joi.string().trim().required(),
    rol                 : Joi.number().min(1).max(2).required(),//0:admin, 1:supervisor, 2:básico
    username            : Joi.string().trim().required(),
    password            : Joi.string().required(),
    email               : Joi.string().allow('').default(''),
    enabled             : Joi.boolean().required()
})

const setPassScheme = Joi.object().keys({
    _id                 : Joi.objectId().required(),
    //REQUIRED VALUES
    password            : Joi.string().required(),
})

const IDScheme = Joi.objectId().required()


module.exports = {
    Valid : (data)=>{
        return Joi.validate(data, Scheme);
    },
    Pass : (data)=>{
        return Joi.validate(data, setPassScheme);
    },
    ID : (id)=>{
        return Joi.validate(id, IDScheme);
    }
}
