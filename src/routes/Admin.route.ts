import { Router } from 'express';
import AdminController from 'controller/Admin.controller';
import Route from '../interfaces/routes.interface';
import authMiddleware from '../middlewares/auth.middleware';
import AdminMiddleware from '@middlewares/admin.middleware';



class AdminRoute implements Route{
    public path = '/admin/';
    public router = Router();
    public adminController = new AdminController();

    constructor() {
        this.initializeRoutes();
      }

      private initializeRoutes() {
        // this.router.post(`${this.path}login`, this.adminController.existingUser)
        this.router.get(`${this.path}signups/:days`,authMiddleware,AdminMiddleware,this.adminController.getSignups);
        this.router.get(`${this.path}users`,authMiddleware,AdminMiddleware,this.adminController.getUsers);
        this.router.delete(`${this.path}user/:id`,authMiddleware,AdminMiddleware,this.adminController.deleteUser);
        this.router.put(`${this.path}user/:id`,authMiddleware,AdminMiddleware,this.adminController.updateUser);
        this.router.get(`${this.path}users/active`,authMiddleware,AdminMiddleware,this.adminController.activeUsers);
        this.router.get(`${this.path}users/inactive`,authMiddleware,AdminMiddleware,this.adminController.inactiveUsers);
        this.router.get(`${this.path}user/:id`,authMiddleware,AdminMiddleware,this.adminController.getUser);
        this.router.post(`${this.path}import`, authMiddleware,AdminMiddleware, this.adminController.importUsers);
        this.router.get(`${this.path}export`,authMiddleware,AdminMiddleware, this.adminController.exportUsers);





       
      }
}
export default AdminRoute;