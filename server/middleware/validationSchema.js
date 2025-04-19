import { body } from "express-validator";

const validateSignUp = () => {
  return [
    body("firstName")
      .notEmpty()
      .trim()
      .isLength({ min: 3 })
      .withMessage("firstName is required, must be at least 3 characters long"),
    body("lastName")
      .notEmpty()
      .trim()
      .isLength({ min: 3 })
      .withMessage("lastName is required, must be at least 3 characters long"),
    body('email')
      .isEmail()
      .withMessage('Invalid email format'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
  ];
};

const validateSignIn = () => {
  return [
    body('email')
      .isEmail()
      .withMessage('Invalid email format'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
  ];
};


export {
  validateSignUp,
  validateSignIn
};