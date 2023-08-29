import "reflect-metadata"
import { DataSource } from "typeorm"
import  { Todos } from "../migrations/entities/Todos"
import { Users } from "migrations/entities/Users"
require('dotenv').config();

const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
const DB_NAME = process.env.DB_NAME;

DB_HOST
export const AppDataSource = new DataSource({
    type: "mysql",
    host: DB_HOST,
    port: 3306,
    username: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    synchronize: true,
    logging: false,
    entities: [Todos, Users],
    migrations: [],
    subscribers: [],
})