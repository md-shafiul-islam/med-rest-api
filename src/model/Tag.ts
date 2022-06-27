import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { News } from "./News";
import { Post } from "./Post";
import { Medicine } from "./Medicine";
import { Generic } from "./Generic";

@Entity({ name: "tag" })
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type:"mediumtext"})
  name: string;

  @Column("mediumtext")
  value: string;

  @ManyToMany(() => Medicine, (medicine: Medicine) => medicine.tags)
  medicines: Medicine[];

  @ManyToMany(() => Generic, (generic:Generic)=>generic.tags)
  generics: Generic[];

  @ManyToMany(() => Post, (post: Post) => post.tags)
  posts: Post[];

  @ManyToMany(() => News, (news: News) => news.tags)
  news: News[];
}
