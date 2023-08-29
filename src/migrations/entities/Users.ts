import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Todos } from "./Todos";

@Entity("users", { schema: "todolist" })
export class Users {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", length: 200 })
  name: string;

  @Column("varchar", { name: "username", length: 200 })
  username: string;

  @Column("varchar", { name: "email", length: 200 })
  email: string;

  @Column("varchar", { name: "password", length: 200 })
  password: string;

  @Column("datetime", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column("varchar", { name: "signup_type", length: 200 })
  signupType: string;

  @Column("varchar", { name: "status", length: 200 })
  status: string;

  @OneToMany(() => Todos, (todos) => todos.user)
  todos: Todos[];
}
