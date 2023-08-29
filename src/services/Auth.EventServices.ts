import { Request, Response } from 'express';
import { AppDataSource } from '../Database/database';
import { Todos } from '../migrations/entities/Todos';
import { Validate, validate } from 'class-validator';
import Validation from '../validation/validation.AuthEventServices';
import multer from 'multer';
import fs from 'fs';
import csvParser from 'csv-parser';
import { stringify } from 'csv-stringify';
import fileUpload from 'express-fileupload';
import { ValidationError } from 'express-validation';


export default class AuthEventServices{

    //GET TODO WITH VERIFIED USER
    public async getUserTodo(req:Request, res:Response, userId:number):Promise<any>{

        try{
            const todoRepository = AppDataSource.getRepository(Todos)
            const todoToGet = await todoRepository.findBy({userId});
           res.status(201).json({ Status:"Success", Data: todoToGet})

           if (!todoToGet) {
            return res.status(404).json({ Status: "Fail", Message:"Todo Not Found" });
           }
        }catch(error){
                res.status(500).json({ Status: "Fail", Message: "Failed to get todo." });    
        }
    }

    //CREATE TODO WITH VERIFIED USER
    public async createUserTodo(req:Request, res:Response, userId:number):Promise<any>{
         
        try{
            const validation = new Validation(req.body);
            // validation.title = req.body.title;
            // validation.description = req.body.description;

            const validationErrors = await validate(validation);
            if (validationErrors.length > 0) {
              return res.status(400).json({  Status: "Fail", Message: "Validation Failed", Errors: validationErrors });
            }

            const todoRepository = AppDataSource.getRepository(Todos)
            const todoToGet = await todoRepository.findBy({userId});
            // console.log(todoToGet,"from service")
            // res.status(201).json(todoToGet)
           if (!todoToGet) {
            return res.status(404).json({  Status: "Fail", Message: "Validation Failed", Error: "Todo/s of the user not found"});
           }
            //CREATE TODO
            const todo = new Todos()
            todo.title = validation.title;
            todo.description = validation.description ;
            todo.userId = userId;
            await AppDataSource.manager.save(todo)
            res.status(200).json({ Status: "Success", Message:"Todo of the User Created"})
        }catch(res){
            res.status(500).json({  Status: "Fail", Message: "Failed to create todo of the user." });    
        }
    }

    //UPDATE TODO WITH VERIFIED USER
    public async updateUserTodo(req: Request, res: Response, userId: number): Promise<any> {
        try {
          const validation = new Validation(req.body);
          const validationErrors = await validate(validation);
          if (validationErrors.length > 0) {
            return res.status(400).json({  Status: "Fail", Message: "Validation Error.", Errors: validationErrors });
          }
          const id = parseInt(req.params.id);
      
          const todoRepository = AppDataSource.getRepository(Todos);
          const todoToUpdate = await todoRepository.findOne({ where: { id, userId} });
      
          if (!todoToUpdate) {
            return res.status(404).json({ Status: "Fail", Message: "Todo not found" });
          }
      
          todoToUpdate.title = validation.title;
          todoToUpdate.description = validation.description;
          await todoRepository.save(todoToUpdate);
          res.status(200).json({ Status:"Success", Message:"Todo Updated" });

        } catch (error) {

          res.status(500).json({ Status:"Fail", Message: "Failed to update todo." });
        }
      }

      //DELETE TODO WITH VERIFIED USER
      public async deleteUserTodo(req: Request, res: Response, userId: number): Promise<any> {
        try {
          const id = parseInt(req.params.id);
      
          const todoRepository = AppDataSource.getRepository(Todos);
          const todoToRemove = await todoRepository.findOne({ where: { id, userId } });
      
          if (!todoToRemove) {
            return res.status(404).json({ Status:"Fail", Message: "Todo to be deleted not found for the user." });
           }
    
           await todoRepository.remove(todoToRemove)
             res.status(201).json({ Status:"Success", Message: "Todo Deleted" });

        } catch (error) {

          res.status(500).json({ Status:"Fail", Message: "Failed to Delete todo." });
        }

      }


      //IMPORT TODO WITH VERIFIED USER
     private upload = multer({ dest: '../uploads' });

     public async importTodos(req: Request, res: Response, userId: number): Promise<any> {
      try {
        
        this.upload.single('file')(req, res, async (err) => {
          if (err) {
            return res.status(500).json({ Status:"Fail", Message: 'Failed to upload the CSV file.' });
          }

          const { path } = req.file;

          const data: any[] = [];
          fs.createReadStream(path)
            .pipe(csvParser())
            .on('data', (row) => {
              data.push(row);
            })
            .on('end', async () => {
              try {
                const savedTodos: Todos[] = [];
                const failedRows: any[] = [];

                const todosRepository = AppDataSource.getRepository(Todos);
                for (const item of data) {
                  console.log(item)
                  try{
                    const validation = new Validation(item);
                    const ValidationError = await validate(validation);
                    
                    if (ValidationError.length > 0) {
                      failedRows.push({
                        Status:"Fail",
                        Message: "Partial Insertion failure",
                        errors: ValidationError.map((err) => err.constraints),
                        row: item,
                      
                      });
                    }else{
                        const todo = new Todos();
                        todo.title = item.title;
                        todo.description = item.description;
                        todo.userId = userId;
                        const savedTodo = await todosRepository.save(todo);
                        savedTodos.push(savedTodo);
                        
                      };
                    }catch(error){
                      console.error(`Error processing row: ${JSON.stringify(item)}`);
                      console.error(error);
                      failedRows.push({
                      Status:"Fail",
                      Message: 'Error processing row',
                      row: item,
                  
                    });
                  }
                }
                fs.unlinkSync(path);

                const response = {
                  insertedCount: savedTodos.length,
                  notInsertedCount: failedRows.length,
                  failedRows,
                };
                res.status(201).json({ Status:"Success", Message: 'Data inserted',response});

              } catch (error) {
                console.error('Error saving CSV data:', error);
                res.status(500).json({ Status:"Fail", Message: 'Failed to save CSV data to the database.' });
              }
            });
        });
      } catch (error) {
        console.error('Error processing CSV file:', error);
        res.status(500).json({ Status:"Fail", Message: 'Failed to process CSV file.' });
      }
    }
    
    //EXPORT TODO WITH VERIFIED USER
    public async exportTodos(req: Request, res: Response, userId): Promise<any> {
      try{
        const todoRepository = AppDataSource.getRepository(Todos);
        const todosToExport = await todoRepository.findBy({ userId });
      
          if (!todosToExport || !todosToExport.length) {
            return res.status(400).json({Status:"Fail", message: 'No User Found In The Database'})
          }

        const data: any[] = todosToExport.map((todo) => ({
          title: todo.title,
          description: todo.description,
        }));
        const csvOptions = { header: true, columns: Object.keys(data[0]) };
        const csvString = await new Promise<string>((resolve, reject) => {
          stringify(data, csvOptions, (err, output) => {
            if (err) {
              reject(err);
            } else {
              resolve(output);
            }
          });
        });
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=todos.csv');
        res.send(csvString);
          
      }catch(error){
        console.error('Error exporting todos:', error);
        res.status(500).json({ Status:"Fail", Message: 'Failed to export todos.' });
      }
    }
  }
      
      
    

    
   