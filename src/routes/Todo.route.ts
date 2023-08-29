import { Router } from 'express';
import TodoController from '../controller/Todo.controller';
import Route from '../interfaces/routes.interface';
// import authMiddleware from '@middlewares/auth.middleware';

class TodoRoute implements Route{
    public path = '/';
    public router = Router();
    public todoController = new TodoController();

    constructor() {
        this.initializeRoutes();
      }

      private initializeRoutes() {
        this.router.get(`${this.path}`, this.todoController.getTodos);
        this.router.get(`${this.path}:id`, this.todoController.getTodo);
        this.router.post(`${this.path}`, this.todoController.createTodo);
        this.router.put(`${this.path}:id`, this.todoController.updateTodo);
        this.router.delete(`${this.path}:id`, this.todoController.deleteTodo);
        this.router.delete(`${this.path}`, this.todoController.deleteTodos);
      }
}
export default TodoRoute;