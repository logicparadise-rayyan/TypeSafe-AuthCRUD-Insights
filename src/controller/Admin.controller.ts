import { Request, Response, Router, NextFunction } from 'express';
import { AppDataSource } from 'Database/database';
import { Users } from 'migrations/entities/Users';
import signUpValidation from 'validation/signUp.validation';
import { Validate, validate } from 'class-validator';
import forgetPasswordValidation from 'validation/forgetPass.validation';
import AdminServices from '@services/Admin.Services';


export default class AdminController{
    public adminServices = new AdminServices();
    public getSignups = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        // const getUserTodo = req['authenticated'];
      //   const userId = req['authenticated']?.user.id;
        try {
          const getSignups = await this.adminServices.getSignupsForDays(req, res, );
          res.status(200).json(getSignups);
    
        } catch (error) {
          next(error)
        }
      }

      public getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        // const getUserTodo = req['authenticated'];
        // const userId = req['authenticated']?.user.id;
        try {
          const getUsers = await this.adminServices.getUsers(req, res, );
          res.status(200).json(getUsers);
    
        } catch (error) {
          next(error)
        }
      }

      public deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
          const deleteUser = await this.adminServices.deleteUser(req, res, next);
          res.status(200).json(deleteUser);
          // res.status(200).json({"Status":"Success", "Message":"the user has been deleted"});
    
        } catch (error) {
          next(error)
        }
      }

      public updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
          const updateUser = await this.adminServices.updateUser(req, res, );
          res.status(200).json(updateUser);
          // res.status(200).json({"Status":"Success", "Message":"the user has been deleted"});
    
        } catch (error) {
          next(error)
        }
      }

      
      public activeUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
          const activeUsers = await this.adminServices.activeUsers(req, res, );
          res.status(200).json(activeUsers);
          // res.status(200).json({"Status":"Success", "Message":"the user has been deleted"});
    
        } catch (error) {
          next(error)
        }
      }

      public inactiveUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
          const inactiveUsers = await this.adminServices.inactiveUsers(req, res, );
          res.status(200).json(inactiveUsers);
          // res.status(200).json({"Status":"Success", "Message":"the user has been deleted"});
    
        } catch (error) {
          next(error)
        }
      }
    public getUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      // const getUserTodo = req['authenticated'];
      // const userId = req['authenticated']?.user.id;
      try {
        const getUser = await this.adminServices.getUser(req, res, );
        res.status(200).json(getUser);

      } catch (error) {
        next(error)
      }
    }

    public importUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      // const me = req['authenticated'];
      // const userId = req['authenticated']?.user.id;
      try {
        // console.log(me)
        // console.log(userId)
        // console.log(req);
         await this.adminServices.importUsers(req, res);
  
      } catch (error) {
        next(error)
      }
    }
  
    public exportUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      // const me = req['authenticated'];
      // const userId = req['authenticated']?.user.id;
      try {
        // console.log(me)
        // console.log(userId)
        // console.log(req);
         await this.adminServices.exportUsers(req, res);
  
      } catch (error) {
        next(error)
      }
    }
}