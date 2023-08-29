import { Request, Response , NextFunction} from 'express';
import { AppDataSource } from '../Database/database';
import { Todos } from '../migrations/entities/Todos';
import { Validate, validate } from 'class-validator';
import Validation from '../validation/validation.AuthEventServices';
import { Users } from '../migrations/entities/Users';
import { Between} from 'typeorm';
import { subDays, startOfDay, endOfDay } from 'date-fns';
import { email } from 'envalid';
import multer from 'multer';
import fs from 'fs';
import csvParser from 'csv-parser';
import { stringify } from 'csv-stringify';
import userValidation from 'validation/user.validation';
import HttpException from '@exceptions/HttpException';

export default class AdminServices {

  //GET WEEKLY SIGNUPS
  public async getSignupsForDays(req: Request, res: Response): Promise<any> {
    try {
      const days  = parseInt(req.params.days); 
      if (!days || isNaN(days)) {
        return res.status(400).json({ Status: "Fail", Message: "Invalid number of days provided." });
      }

      const userRepository = AppDataSource.getRepository(Users);
      const today = new Date();
      const startOfDateRange = subDays(today, days);
      const endOfToday = endOfDay(today);

      const signupsForDays = await userRepository.find({
        where: {
          createdAt: Between(startOfDay(startOfDateRange), endOfToday),
        },
      });

      res.status(200).json({ Status: "Success", Data: signupsForDays });
    } catch (error) {
      res.status(500).json({ Status: "Fail", Message: "Failed to get signups for the specified days." });
    }
  }

  //GET ALL THE USERS
  public async getUsers(req: Request, res: Response): Promise<any> {
    try {
      const userRepository = AppDataSource.getRepository(Users);
      const getUsers = await userRepository.find();
      res.status(201).json(getUsers);
      if (!getUsers) {
        return res.status(404).json({ error: "no users found" });
      }

    } catch (error) {
      res.status(500).json({ Status: "Fail", Message: "Failed to get users" });
    }
  }

  
  
  //DELETE A  USER
  public async deleteUser(req: Request, res: Response, next:NextFunction): Promise<any> {
    try {
      const usersRepository = AppDataSource.getRepository(Users)
      const userToRemove = await usersRepository.findOneBy({
       id:parseInt(req.params.id)
     })
     const userToRemoveId = userToRemove.id;
     const userTypeId = req['authenticated']?.user.id;

     if(userTypeId===userToRemoveId){
      
      return next(new HttpException(501,"cannot delete admin"))
     }
     await usersRepository.remove(userToRemove)
    //  console.log(userToRemove)
     res.status(201).json({Status: "Success", Message:"User has been deleted" });
      if (!userToRemove) {
        return res.status(404).json({ error: " user not found" });
      }

    } catch (error) {
      res.status(500).json({ Status: "Fail", Message: "Failed to remove users" });
    }
  }


   //UPDATE A  USER
   public async updateUser(req: Request, res: Response): Promise<any> {
    try {
      const usersRepository = AppDataSource.getRepository(Users)
      const userToUpdate= await usersRepository.findOneBy({
       id:parseInt(req.params.id)
     })
      if (!userToUpdate) {
            return res.status(404).json({ error: "Todo to be updated not found." });
          }
        const {username, password, status, name, signup_type, email} = req.body
        userToUpdate.username = username;
        userToUpdate.name = name;
        userToUpdate.password = password;
        userToUpdate.status = status
        userToUpdate.signupType = signup_type;
        userToUpdate.email = email;

      
        await usersRepository.save(userToUpdate)
      res.status(201).json({Status: "Success", Message:"User has been Updated" });
      if (!userToUpdate) {
        return res.status(404).json({ error: " user not found" });
      }

    } catch (error) {
      res.status(500).json({ Status: "Fail", Message: "Failed to update users" });
    }
  }
  //GET ACTIVE USERS
  public async activeUsers(req: Request, res: Response): Promise<any> {
    try {
      const usersRepository = AppDataSource.getRepository(Users)
      const activeUsers= await usersRepository.find({ where: { status: "active" } } )
      if (!activeUsers) {
            return res.status(404).json({ error: "Active users not found." });
          }

      res.status(201).json({Status: "Success", activeUsers});
      if (!activeUsers) {
        return res.status(404).json({ error: " users not found" });
      }

    } catch (error) {
      res.status(500).json({ Status: "Fail", Message: "Failed to process active users" });
    }
  }

   //GET INACTIVE USERS
   public async inactiveUsers(req: Request, res: Response): Promise<any> {
    try {
      const usersRepository = AppDataSource.getRepository(Users)
      const inactiveUsers= await usersRepository.find({ where: { status: "inactive" } } )
      if (!inactiveUsers) {
            return res.status(404).json({ error: "inActive users not found." });
          }

      res.status(201).json({Status: "Success", inactiveUsers});
      if (!inactiveUsers) {
        return res.status(404).json({ error: " inactive users not found" });
      }

    } catch (error) {
      res.status(500).json({ Status: "Fail", Message: "Failed to process inactive users" });
    }
  }

   //GET ALL THE USER
   public async getUser(req: Request, res: Response): Promise<any> {
    try {
      const userRepository = AppDataSource.getRepository(Users);
      const getUser = await userRepository.findOneBy({id:parseInt(req.params.id)});
      res.status(201).json(getUser);
      if (!getUser) {
        return res.status(404).json({ error: "no user found" });
      }

    } catch (error) {
      res.status(500).json({ Status: "Fail", Message: "Failed to get user" });
    }
  }

  
      //IMPORT USERS BY VERIFIED ADMIN
      private upload = multer({ dest: '../uploads' });

      public async importUsers(req: Request, res: Response): Promise<any> {
       try {
         
         this.upload.single('users')(req, res, async (err) => {
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
                 const savedUsers: Users[] = [];
                 const failedRows: any[] = [];
 
                 const usersRepository = AppDataSource.getRepository(Users);
                
                 for (const item of data) {
                   try{
                     const uservalidation = new userValidation(item);
                     const ValidationError = await validate(uservalidation);
                     
                     if (ValidationError.length > 0) {
                       failedRows.push({
                         Status:"Fail",
                         Message: "Partial Insertion failure",
                         errors: ValidationError.map((err) => err.constraints),
                         row: item,
                       
                       });
                     }else{
                         const user = new Users();
                         user.name = item.name;
                        user.password = item.password;
                        user.username = item.username;
                        user.email = item.email;
                         const saveduser = await usersRepository.save(user);
                         savedUsers.push(saveduser);
                         
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
                   insertedCount: savedUsers.length,
                   notInsertedCount: failedRows.length,
                   failedRows,
                 };
                 res.status(201).json({ Status:"Success", Message: 'Users inserted',response});
 
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
     
     //EXPORT USERS BY VERIFIED ADMIN
     public async exportUsers(req: Request, res: Response): Promise<any> {
       try{
         const usersRepository = AppDataSource.getRepository(Users);
         const usersToExport = await usersRepository.find();
       
           if (!usersToExport || !usersToExport.length) {
             return res.status(400).json({Status:"Fail", message: 'No User Found In The Database'})
           }
 
         const data: any[] = usersToExport.map((user) => ({
           name: user.name,
           username: user.username,
           email:user.email,
           password:user.password,
           createdAt:user.createdAt,
           signupType:user.signupType,
           status:user.status
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
