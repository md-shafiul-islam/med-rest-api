import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
  UpdateDateColumn,
} from "typeorm";
import { News } from "./News";
import { Post } from "./Post";
import { Medicine } from "./Medicine";
import { User } from "./User";

@Entity({ name: "comment" })
@Tree("closure-table", {
  closureTableName: "comment_closure",
  ancestorColumnName: (column) => "parent" + column.propertyName,
  descendantColumnName: (column) => "children" + column.propertyName,
})
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "content", type: "text" })
  content: string;

  @ManyToOne(() => User, (user: User) => user.id)
  @JoinColumn({ name: "author", referencedColumnName: "id" })
  author: User;

  @ManyToOne(() => User, (user: User) => user.id)
  @JoinColumn({ name: "approve_user", referencedColumnName: "id" })
  approveUser: User;

  @ManyToOne(() => Medicine, (medicine: Medicine) => medicine.id)
  @JoinColumn({ name: "product", referencedColumnName: "id" })
  medicine: Medicine;

  @ManyToOne(() => News, (news: News) => news.id)
  @JoinColumn({ name: "news", referencedColumnName: "id" })
  news: News;

  @ManyToOne(() => Post, (post: Post) => post.id)
  @JoinColumn({ name: "post", referencedColumnName: "id" })
  post: Post;

  @TreeChildren()
  children: Comment[];

  @TreeParent()
  parent: Comment;

  @CreateDateColumn({ name: "create_date" })
  createDate: Date;

  @UpdateDateColumn({ name: "update_date" })
  updateDate: Date;
}
