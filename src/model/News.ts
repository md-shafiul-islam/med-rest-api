import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Company } from "./Company";
import { Category } from "./Category";
import { MetaDeta } from "./MetaData";
import { ImageGallery } from "./ImageGallery";
import { User } from "./User";

@Entity({ name: "news" })
export class News {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "news_alias" })
  newsAlias: string;

  @Column({ length: 205 })
  title: string;

  @ManyToOne(() => User, (user: User) => user.id)
  @JoinColumn({ name: "user" })
  user: User;

  @ManyToMany(() => MetaDeta, (meta: MetaDeta) => meta.news)
  @JoinTable({
    name: "news_metadata",
    joinColumn: { name: "news", referencedColumnName: "id" },
    inverseJoinColumn: { name: "meta_data", referencedColumnName: "id" },
  })
  metaDatas: MetaDeta[];

  @Column({ type: "text" })
  content: string;

  @Column({ name: "short_content", type: "text" })
  shortContent: string;

  @ManyToMany(() => ImageGallery, (img: ImageGallery) => img.news)
  @JoinTable({
    name: "news_images",
    joinColumn: { name: "news", referencedColumnName: "id" },
    inverseJoinColumn: { name: "image", referencedColumnName: "id" },
  })
  images: ImageGallery[];

  @ManyToOne(() => Company, (company: Company) => company.id)
  @JoinColumn({ name: "company", referencedColumnName: "id" })
  company: Company;

  @ManyToOne(() => Category, (cat: Category) => cat.id)
  @JoinColumn({ name: "category", referencedColumnName: "id" })
  category: Category;

  @CreateDateColumn()
  crateDate: Date;

  @Column({ name: "update_date", type: "datetime", nullable: true })
  updateDate: Date;

  addImage(image: ImageGallery) {
    if (!Array.isArray(this.images)) {
      this.images = new Array<ImageGallery>();
    }
    this.images.push(image);
  }

  addAllImage(imgs: ImageGallery[]) {
    if (!Array.isArray(this.images)) {
      this.images = new Array<ImageGallery>();
    }
    this.images.push.apply(this.images, imgs);
  }

  addMetaData(meta: MetaDeta) {
    if (!Array.isArray(this.metaDatas)) {
      this.metaDatas = new Array<MetaDeta>();
    }
    this.metaDatas.push(meta);
  }

  addAllMeta(metas: MetaDeta[]) {
    if (!Array.isArray(this.metaDatas)) {
      this.metaDatas = new Array<MetaDeta>();
    }
    this.metaDatas.push.apply(this.metaDatas, metas);
  }
}
