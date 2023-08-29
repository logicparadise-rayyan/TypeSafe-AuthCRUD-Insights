import { NextFunction, Request, Response } from 'express';
import HttpException from '../exceptions/HttpException';
import AuthServices from '../services/Auth.Services';
require('dotenv').config();

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authorization: string = req.headers['authorization'] || '';
    const token: string = authorization ? authorization.split('Bearer ')[1] : '';
    if (token) {
      const authService = new AuthServices();
      const authenticated = await authService.verifyToken(token);
      // console.log(authenticated, "middddllleee")
      if (authenticated) {
        req['authenticated'] = authenticated; 
        // Set authenticated data directly to req object
        next();
      } else {
        next(new HttpException(401, 'Wrong authentication token'));
      }
    } else {
      next(new HttpException(404, 'Authentication token missing'));
    }
  } catch (error) {
    next(new HttpException(401, 'Wrong authentication token'));
  }
};

export default authMiddleware;
