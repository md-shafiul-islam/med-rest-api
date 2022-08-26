import {
  Column,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Comment } from "./Comment";
import { News } from "./News";
import { Post } from "./Post";
import { Medicine } from "./Medicine";
import { Credential } from "./Credential";

@Entity({ name: "user" })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "public_id", unique: true })
  @Generated("uuid")
  publicId: string;

  @Column({ name: "first_name" })
  firstName: string;

  @Column({ name: "last_name" })
  lastName: string;

  @Column({ name: "user_name" })
  userName: string;

  @Column({ name: "email" })
  email: string;

  @Column({ name: "role" })
  role: string;

  @OneToMany(() => Medicine, (medicine: Medicine) => medicine.user)
  medicines: Medicine[];

  @OneToMany(() => Credential, (credential: Credential) => credential.user)
  credentials: Credential[];

  @OneToMany(() => Post, (post: Post) => post.user)
  posts: Post[];

  @OneToMany(() => News, (news: News) => news.user)
  news: News[];

  @OneToMany(() => Comment, (comment: Comment) => comment.author)
  comments: Comment[];

  @OneToMany(() => Comment, (comment: Comment) => comment.approveUser)
  approveComments: Comment[];

  @Column({ name: "is_active", default: false })
  isActive: boolean;

  addCredential(credential: Credential) {
    if (Array.isArray(this.credentials)) {
      this.credentials.push(credential);
    } else {
      this.credentials = new Array();
      this.credentials.push(credential);
    }
  }
}
