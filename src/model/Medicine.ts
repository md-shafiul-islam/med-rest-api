import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Company } from "./Company";
import { Category } from "./Category";
import { ImageGallery } from "./ImageGallery";
import { MetaDeta } from "./MetaData";
import { User } from "./User";
import { Generic } from "./Generic";

@Entity({ name: "medicine" })
export class Medicine {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "public_id", unique: true, length: 105 })
  publicId: string;

  @Column({ name: "alias_name", nullable: true })
  aliasName: string;

  @Index("medicine_name_idx")
  @Column({ name: "name" })
  name: string;

  @Column()
  form: string;

  @Column({ name: "strength", type: "mediumtext" })
  strength: string;

  @Column({ name: "price", length: 155 })
  price: string;

  @Column({ name: "use_for", length: 105 })
  useFor: string;

  @Column({ name: "dra", type: "text", nullable: true })
  dra: string;

  @ManyToOne(() => Category, (category: Category) => category.id)
  @JoinColumn({ name: "category" })
  category: Category;

  @ManyToOne(() => Generic, (generic: Generic) => generic.id)
  @JoinColumn({ name: "generic" })
  generic: Generic;

  @ManyToOne(() => User, (user: User) => user.id)
  @JoinColumn({ name: "user" })
  user: User;

  @ManyToMany(() => ImageGallery, (image: ImageGallery) => image.id)
  @JoinTable({
    name: "medicins_images",
    joinColumn: { name: "medicine", referencedColumnName: "id" },
    inverseJoinColumn: { name: "image", referencedColumnName: "id" },
  })
  images: ImageGallery[];

  @ManyToMany(() => MetaDeta, (metadata: MetaDeta) => metadata.medicines, {
    cascade: true,
  })
  @JoinTable({
    name: "medicine_meta",
    joinColumn: { name: "medicine", referencedColumnName: "id" },
    inverseJoinColumn: { name: "meta", referencedColumnName: "id" },
  })
  metaDatas: MetaDeta[];

  @ManyToOne(() => Company, (company: Company) => company.id)
  @JoinColumn({ name: "company" })
  company: Company;

  @CreateDateColumn({
    name: "create_date",
    nullable: true,
  })
  createDate: Date;

  @UpdateDateColumn({ name: "update_date", nullable: true })
  updateDate: Date;

  addMetaData(meta: MetaDeta) {
    if (!Array.isArray(this.metaDatas)) {
      this.metaDatas = new Array<MetaDeta>();
    }
    this.metaDatas.push(meta);
  }

  addImage(image: ImageGallery) {
    if (!Array.isArray(this.images)) {
      this.images = new Array<ImageGallery>();
    }

    this.images.push(image);
  }

  addAllMetaData(metas: MetaDeta[]) {
    if (!Array.isArray(this.metaDatas)) {
      this.metaDatas = new Array<MetaDeta>();
    }
    this.metaDatas.push.apply(this.metaDatas, metas);
  }

  addAllImage(imgs: ImageGallery[]) {
    if (!Array.isArray(this.images)) {
      this.images = new Array<ImageGallery>();
    }

    this.images.push.apply(this.images, imgs);
  }
}
