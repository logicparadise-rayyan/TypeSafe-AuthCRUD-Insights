import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Users } from "./Users";

@Index("testing", ["userId"], {})
@Entity("todos", { schema: "todolist" })
export class Todos {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "user_id" })
  userId: number;

  @Column("varchar", { name: "title", length: 200 })
  title: string;

  @Column("varchar", { name: "description", length: 200 })
  description: string;

  @Column("datetime", {
    name: "inserted_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  insertedAt: Date;

  @ManyToOne(() => Users, (users) => users.todos, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: Users;
}
