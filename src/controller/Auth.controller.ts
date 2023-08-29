import { Request, Response, Router, NextFunction } from 'express';
import AuthServices from '../services/Auth.Services';
import AuthEventServices from '@services/Auth.EventServices';
import { AppDataSource } from 'Database/database';
import { Users } from 'migrations/entities/Users';
import signUpValidation from 'validation/signUp.validation'
import { Validate, validate } from 'class-validator';
import forgetPasswordValidation from 'validation/forgetPass.validation';
import HttpException from '@exceptions/HttpException';


export default class AuthController{
  public authServices = new AuthServices();
  public authEventServices = new AuthEventServices();
    
  public getUserTodo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // const getUserTodo = req['authenticated'];
    const userId = req['authenticated']?.user.id;
    try {
      // console.log(me)
      // console.log(userId)
      // console.log(req);
      const getTodo = await this.authEventServices.getUserTodo(req, res, userId);
      res.status(200).json(getTodo);

    } catch (error) {
      next(error)
    }
  }

    public createUserTodo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      // const me = req['authenticated'];
      const userId = req['authenticated']?.user.id;
      try {
        // console.log(me)
        // console.log(userId)
        // console.log(req);
        const getTodo = await this.authEventServices.createUserTodo(req, res, userId);
        res.status(200).json(getTodo);
  
      } catch (error) {
        next(error)
      }
  };

  public updateUserTodo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // const me = req['authenticated'];
    const userId = req['authenticated']?.user.id;
    try {
      // console.log(me)
      // console.log(userId)
      // console.log(req);
      const getTodo = await this.authEventServices.updateUserTodo(req, res, userId);
      // res.status(200).json(getTodo);

    } catch (error) {
      next(error)
    }
  }

  public deleteUserTodo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // const me = req['authenticated'];
    const userId = req['authenticated']?.user.id;
    try {
      // console.log(me)
      // console.log(userId)
      // console.log(req);
      const getTodo = await this.authEventServices.deleteUserTodo(req, res, userId);

    } catch (error) {
      next(error)
    }
  }

  public importTodos = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // const me = req['authenticated'];
    const userId = req['authenticated']?.user.id;
    try {
      // console.log(me)
      // console.log(userId)
      // console.log(req);
       await this.authEventServices.importTodos(req, res, userId);

    } catch (error) {
      next(error)
    }
  }

  public exportTodos = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // const me = req['authenticated'];
    const userId = req['authenticated']?.user.id;
    try {
      // console.log(me)
      // console.log(userId)
      // console.log(req);
       await this.authEventServices.exportTodos(req, res, userId);

    } catch (error) {
      next(error)
    }
  }
    
  
    
      // public getByToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      //   try {
      //     const token = req.body.token;
      //     const authenticatedUser = await this.authServices.verifyToken(token);
      //     // res.status(200).json(authenticatedUser);
      //   } catch (error) {
      //     next(error);
      //   }
      // };

    
    /** 
     * 
     * @param req 
     * @param res 
     * @param next 
     * 
     */
    
    public existingUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      
        try{
          let { email, password} = req.body;
          let status = "active";
          const userRepository = AppDataSource.getRepository(Users);
          const findUser = await userRepository.findOneBy({ email });


          if (findUser.password !== password){
            throw new HttpException(400, "user  not found (INCORRECT LOGIN DETAILS)");
          }
          const authenticated = await this.authServices.existingUser(email,password, status);

          res.status(200).json(authenticated);
          

          }catch(error){
            next(error);
          }  
    }

    public createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
       
        const signupValidation = new signUpValidation(req.body);
        const validationErrors = await validate(signupValidation);
        if (validationErrors.length > 0) {
          res.status(400).json({ Status: "Fail", Message: "Validation Failed", Errors: validationErrors });
          return;
        }
    
        const userRepository = AppDataSource.getRepository(Users);
        const findUser = await userRepository.findBy({ email: req.body.email });
    
        if (findUser.length > 0) {

          res.status(200).json({ Status: "Fail", Message: "email/Username Already Exists in DB" });
          return;
        }
    
        const { username, password, name, email } = req.body; 
        const authenticated = await this.authServices.createUser(username, password, name, email, res, next);
        res.status(200).json(authenticated);
      } catch (error) {
        next(error);
      }
  
  } 
  
  public forgetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      
      const emailValidation = new forgetPasswordValidation(req.body);
      const validationErrors = await validate(emailValidation);
      if (validationErrors.length > 0) {
        res.status(400).json({ Status: "Fail", Message: "Provide email", Errors: validationErrors });
        return;
      }
  
      const userRepository = AppDataSource.getRepository(Users);
      const findUser = await userRepository.findBy({ email: req.body.email });
  
      if (findUser.length === 0) {

        res.status(200).json({ Status: "Fail", Message: "no user found with these credentials" });
        return;
      }
  
      const { email } = req.body; 
      const authenticated = await this.authServices.forgetPassword( email, res, next);
      res.status(200).json(authenticated);
    } catch (error) {
      next(error);
    }

}  

}