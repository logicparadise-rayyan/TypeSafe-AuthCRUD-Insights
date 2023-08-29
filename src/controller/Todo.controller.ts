import { NextFunction, Request, Response } from 'express';
// import { AppDataSource } from '../Database/database';
// import { Todos } from '../migrations/entities/Todos';
import TodoServices from '@services/Todo.Services';

export default class TodoController{
    public todoServices = new TodoServices();
  /** 
   * 
   * @param req 
   * @param res 
   * @param next 
   * 
   */
  //GET TODOS CONTROLLER
  public getTodos = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    
    try{
      const getTodos = await this.todoServices.getTodos( res);
      res.status(200).json(getTodos);
    }catch(error){
      next(error);
    } 
  }

  //CREATE TODO CONTROLLER
  public createTodo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
   
    try{
      const newTodo = {
        title:req.body.title,
        description:req.body.description
      }
      const createTodo = await this.todoServices.createTodo(newTodo.title,newTodo.description, res);
      res.status(200).json({"todoCreated":true});

    }catch(error){
      next(error);
    }
  }

  //UPDATE TODO CONTROLLER
  public updateTodo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    try{
      const updateTodo = await this.todoServices.updateTodo(res, req);
      res.status(200).json(updateTodo);

    }catch(error){
      next(error);
    }
  }

  //DELETE TODO
  public deleteTodo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try{
      
      const deleteTodo = await this.todoServices.deleteTodo(res, req);
      res.status(200).json(deleteTodo);

    }catch(error){
      next(error);
    }
  }

  //GET TODO CONTROLLER
  public getTodo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    
    try{
      const getTodo = await this.todoServices.getTodo( req, res);
      res.status(200).json(getTodo);

    }catch(error){
      next(error);
    }
  }

  //DELETE TODOS
   public deleteTodos = async (req:Request, res: Response,  next: NextFunction): Promise<void> => {
    
    try{
      const deleteTodos = await this.todoServices.deleteTodos(res, req);
      res.status(200).json(deleteTodos);
      
    }catch(error){
      next(error);
    }
  }
}






