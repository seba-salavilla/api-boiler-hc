const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const Scheme = Joi.object().keys({
    _id                 : Joi.objectId(),
    name                : Joi.string().trim().required(),
    anabled             : Joi.boolean().default(false)
})

const IDScheme = Joi.objectId().required()


module.exports = {
    Valid : (data)=>{
        return Joi.validate(data, Scheme);
    },
    ID : (id)=>{
        return Joi.validate(id, IDScheme);
    }
}
