import { body, validationResult } from "express-validator";


export const registerValidationRules = [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
];

export const loginValidationRules = [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required")
];

export const eventValidationRules = [
    body("source").notEmpty().withMessage("Source is required"),
    body("type").notEmpty().withMessage("Type is required"),
    body("time").notEmpty().withMessage("Time is required").isISO8601().withMessage("Time must be a valid ISO date"),
    body("ra").notEmpty().withMessage("RA is required").isFloat({ min: 0, max: 360 }),
    body("dec").notEmpty().withMessage("DEC is required").isFloat({ min: -90, max: 90 })
];

export const validateAuth = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};
