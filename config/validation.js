const Joi = require('@hapi/joi');

// Register Validation 
const validation = (data) =>{
    const schema = Joi.object({
        name : Joi.string().min(2).required(),
        username : Joi.string().min(6).required(),
        password : Joi.string().min(8).required(),
        email : Joi.string().min(6).required().email(),
        gender : Joi.required(),
        birthday : Joi.required()
    });
    return schema.validate(data);
};

module.exports.validation = validation;