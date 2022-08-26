import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";

@Entity({ name: "credential" })
export class Credential {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user: User) => user.id)
  @JoinColumn({ name: "user" })
  user: User;

  @Column({ name: "password" })
  password: string;

  @Column({ name: "active", type: "boolean" })
  isActive: boolean;

  @CreateDateColumn({ name: "created_date" })
  createDate: Date;
}
