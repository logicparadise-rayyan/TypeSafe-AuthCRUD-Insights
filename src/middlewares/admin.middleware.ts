import { NextFunction, Request, Response } from 'express';
require('dotenv').config();

const AdminMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const signupType = req['authenticated']?.user.signupType;
    if (signupType!=="admin"){
        return res.status(200).json({ Status: "Fail", Message: "No admin found" });
    }
    next();
  } catch (error) {
    res.status(500).json({ Status: "Fail", Message: "Error fetching the admin" });
  }
};
export default AdminMiddleware;
