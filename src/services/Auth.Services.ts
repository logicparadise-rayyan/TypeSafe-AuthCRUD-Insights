import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../Database/database';
import { Users } from '../migrations/entities/Users';
import { isEmpty } from 'class-validator';
import * as jwt from 'jsonwebtoken';
import HttpException from '../exceptions/HttpException';
require('dotenv').config();

export default class AuthServices{
    //log USER
    public async existingUser(email:string, password:string, status:string):Promise<any>{
        if (isEmpty(email)) throw new HttpException(400, 'Missing email');
        if (isEmpty(password)) throw new HttpException(400, 'Missing password');
    
        // get user
        const userRepository = AppDataSource.getRepository(Users);
        const findUser: Users = await userRepository
        .createQueryBuilder('user')
        .where('user.email = :email', { email })
        .andWhere('user.status = :status', {status})
        .getOne();
        
        // .findOne({ where: { email:email}  });
        
        if (!findUser) throw new HttpException(409, 'The users account has been deactivated by ADMIN.');
    
        // user id
        const userPassword = findUser?.password;
        
        // verify password
        // TODO: use password encyption
        if (findUser.password !== password) throw new HttpException(409, 'Incorrect login details');
        // username
        const userId = findUser?.id;
        const userEmail = findUser?.email;

       
        // get authenticated user payload
        const authenticated = await this.authenticatedPayload(userId);
        // generate token
        const token = this.token(userId, userEmail);
        // return
        return { ...authenticated, token };
    }

  /**
   *
   * @param userId number
   */
  public async authenticatedPayload(userId: number) {
    // get user
    const user: Users = await this.one(userId);
    // const id: number = user?.id;
    // console.log(id)
    return { user };
  }



  token(userId, userEmail) {
    const payload: any = {};
    payload.userId = userId;
    payload.userEmail = userEmail;
    var token = jwt.sign(payload, process.env.SECRET_KEY);
    return token;
  }

  public async one(userId: number) {
    const userRepository = AppDataSource.getRepository(Users);
    const findUser: Users = await userRepository.findOne({ where: { id: userId} });
    return findUser;
  }


  public async verifyToken(token: string): Promise<any> {
    try {
      const decoded: any = jwt.verify(token, process.env.SECRET_KEY);
      const userId = decoded?.userId;
      console.log(userId)
      return await this.authenticatedPayload(userId);
    } catch (err) {
      throw new HttpException(400, `Token Failed ${err}`);
    }
  }

     //CREATE USER
     public async createUser(username:string, password:string, name:string, email:string, res:Response, next:NextFunction):Promise<any>{ 

        try{
            let user = new Users()
            user.username = username;
            user.password = password;
            user.name = name;
            user.email = email;
            user.signupType="user";
            user.status="active";
            await AppDataSource.manager.save(user)
            res.json(user)

        }catch{
            const error = new Error("failed to insert user")
            return next(error);
        }
    }
    //FORGET PASSWORD RESET LINK LOGIC
    public async forgetPassword(email:string, res:Response, next:NextFunction):Promise<any>{ 

      try{
        res.status(200).json({ Status: "Success", Message: `Reset link sent on ${email}` });

      }catch{
          const error = new Error("failed to send reset link")
          return next(error);
      }
  }
}
