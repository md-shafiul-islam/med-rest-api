import {
  Column,
  Entity,
  JoinColumn,
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

  @Column({ length: 155, nullable:true  })
  name: string;

  @Column({ name: "alt_tag", length: 105, nullable:true  })
  altTag: string;

  @Column({ length: 105, nullable:true  })
  title: string;

  @Column({ length: 205, nullable:true  })
  location: string;

  @Column({ name: "image_url", length: 250, nullable:true  })
  imageUrl: string;

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
