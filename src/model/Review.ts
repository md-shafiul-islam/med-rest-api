import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Pharmacy } from "./Pharmacy";
import { User } from "./User";

@Entity("review")
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user: User) => user.id)
  @JoinColumn({ name: "author" })
  author: User;

  @ManyToOne(() => Pharmacy, (pharmacy: Pharmacy) => pharmacy.reviews)
  @JoinColumn({ name: "pharmacy" })
  pharmacy: Pharmacy;

  @ManyToOne(() => User, (user: User) => user.id, { nullable: true })
  @JoinColumn({ name: "approve_user" })
  approveUser: User;

  @Column("text")
  content: string;

  @CreateDateColumn({ name: "created_date" })
  createdDate: Date;

  @UpdateDateColumn({ name: "update_date" })
  updateDate: Date;
}
