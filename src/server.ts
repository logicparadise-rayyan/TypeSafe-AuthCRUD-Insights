import AuthRoute from '@routes/Auth.route';
import App from './app';
import TodoRoute from "./routes/Todo.route"
import validateEnv from '@utils/ValidateEnv';
import AdminRoute from '@routes/Admin.route';


validateEnv();
const app = new App([
    new TodoRoute(),
    new AuthRoute(),
    new AdminRoute

]);

app.listen();