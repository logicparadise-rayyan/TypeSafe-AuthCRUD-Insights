import { Router } from 'express';
import AuthController from '../controller/Auth.controller';
import Route from '../interfaces/routes.interface';
// import { validate, ValidationError, Joi } from 'express-validation';
import AuthServices from '@services/Auth.Services';
import authMiddleware from '../middlewares/auth.middleware';
// import signupRedundancyCheckMiddleware from "../middlewares/signup.redundancyCheck.middleware"

// const loginValidation = {
//     body: Joi.object({
//       username: Joi.string().required(),
//       password: Joi.string()
//         .regex(/[a-zA-Z0-9]{3,30}/)
//         .required(),
//     }),
//   };

class AuthRoute implements Route{
    public path = '/users/';
    public router = Router();
    public authController = new AuthController();

    constructor() {
        this.initializeRoutes();
      }

      private initializeRoutes() {
        this.router.post(`${this.path}signup`, this.authController.createUser);
        this.router.post(`${this.path}login`, this.authController.existingUser);
        this.router.get(`${this.path}getUserTodo`,authMiddleware, this.authController.getUserTodo);
        this.router.post(`${this.path}createUserTodo`,authMiddleware, this.authController.createUserTodo);
        this.router.put(`${this.path}updateUserTodo/:id`,authMiddleware, this.authController.updateUserTodo);
        this.router.delete(`${this.path}deleteUserTodo/:id`,authMiddleware, this.authController.deleteUserTodo);
        this.router.post(`${this.path}import`, authMiddleware, this.authController.importTodos);
        this.router.get(`${this.path}export`,authMiddleware, this.authController.exportTodos);
        this.router.post(`${this.path}forgetPassword`, this.authController.forgetPassword)
  

        // this.router.get(`${this.path}token`, this.authController.getByToken);
        // this.router.post(`${this.path}accessTodos`, this.authController.decodeToken);
      }
}
export default AuthRoute;