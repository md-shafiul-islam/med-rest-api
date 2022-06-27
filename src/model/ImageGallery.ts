import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { News } from "./News";
import { Post } from "./Post";
import { Medicine } from "./Medicine";

@Entity("image_gallery")
export class ImageGallery {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 155 })
  name: string;

  @Column({ name: "alt_tag", length: 105 })
  altTag: string;

  @Column({ length: 105 })
  title: string;

  @Column({ length: 205 })
  location: string;

  @ManyToOne(() => Medicine, (medicine: Medicine) => medicine.images, {
    nullable: true,
  })
  @JoinColumn({ name: "medicine" })
  medicines: Medicine;

  @ManyToMany(() => Post)
  posts: Post[];

  @ManyToMany(() => News)
  news: News;
}
