const Joi = require('joi');

// Validation Schemas
const postSchema = Joi.object({
    title: Joi.string().required(),
    content: Joi.string().min(10).max(500).required(),
    tags: Joi.array().items(Joi.string())
});

const registerSchema = Joi.object({
    firstName: Joi.string().min(3).max(30).required(),
    lastName: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(30).required(),
    confirmPassword: Joi.ref('password'),
    role: Joi.string().valid('admin', 'user').default('user') 
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(30).required(),
});

// Middleware Functions
exports.postValidation = (req, res, next) => {
    validate(postSchema, req, res, next);
};

exports.registerValidation = (req, res, next) => {
    const { error } = registerSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

exports.loginValidation = (req, res, next) => {
    validate(loginSchema, req, res, next);
};

function validate(schema, req, res, next) {
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
}