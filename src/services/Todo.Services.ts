import { Request, Response } from 'express';
import { AppDataSource } from '../Database/database';
import { Todos } from '../migrations/entities/Todos';

export default class TodoServices{
    //CREATE TODO
    public async createTodo(title:string, description:string, res:Response):Promise<any>{
        
        const todo = new Todos()
        todo.title = title;
        todo.description = description
        await AppDataSource.manager.save(todo)
        res.json({"createTodo":true})
        
    }

    //UPDATE TODO
    public async updateTodo(res:Response, req:Request):Promise<any>{

        const todoRepository =  AppDataSource.getRepository(Todos);
        const todoToUpdate = await todoRepository.findOneBy({id:parseInt(req.params.id)})

        if (!todoToUpdate) {
            return res.status(404).json({ error: "Todo to be updated not found." });
          }
        const updateTodo = {
            title:req.body.title,
            description:req.body.description
        }
        todoToUpdate.title = updateTodo.title;
        todoToUpdate.description = updateTodo.description;
        await todoRepository.save(todoToUpdate)
        res.json({"todoUpdated":true})
        
    }

    //DELETE TODO
    public async deleteTodo(res:Response, req:Request):Promise<any>{

      try{
        const todoRepository = AppDataSource.getRepository(Todos)
        const todoToRemove = await todoRepository.findOneBy({
         id:parseInt(req.params.id)
       })
       if (!todoToRemove) {
        return res.status(404).json({ error: "Todo to be deleted not found." });
       }

       await todoRepository.remove(todoToRemove)
         res.status(201).json({
           ok: "deleted"
         });
      }catch(error){
        res.status(500).json({ error: "Failed to delete todo." });
      }
        
    }

    //GET TODOS
    public async getTodos(res:Response):Promise<any>{
        try{
            const todoRepository =  AppDataSource.getRepository(Todos);
            const getTodos = await todoRepository.find();
            res.status(201).json(getTodos);

            if (!getTodos) {
            return res.status(404).json({ error: "no todos found" });
          }
        }catch(error){
            res.status(500).json({ error: "Failed to get todos." });
        }
        
        
    }

    //GET TODO
    public async getTodo(req:Request, res:Response):Promise<any>{

        try{
            const todoRepository = AppDataSource.getRepository(Todos)
            const todoToGet = await todoRepository.findOneBy({
             id:parseInt(req.params.id)
           });
           res.status(201).json(todoToGet)

           if (!todoToGet) {
            return res.status(404).json({ error: "Todo not found" });
           }
        }catch(error){
                res.status(500).json({ error: "Failed to get todo." });    
        }
    }

    //DELETE TODOS
    public async deleteTodos(res:Response, req:Request):Promise<any>{

        try{
            const todoRepository = AppDataSource.getRepository(Todos)
            const todoToRemove = await todoRepository.find();
            if (!todoToRemove) {
            return res.status(404).json({ error: "Todo to be deleted not found." });
            }
    
            await todoRepository.remove(todoToRemove)
            res.status(201).json({
                ok: "deleted All Todos"
            });
        }catch(error){
            res.status(500).json({ error: "Failed to delete todos." });
        }
            
    }



}
