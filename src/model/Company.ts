import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { News } from "./News";
import { Medicine } from "./Medicine";

@Entity({ name: "company" })
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 205, nullable: true })
  name: string;

  @Column({ name: "alias_name" })
  aliasName: string;

  @Column({ name: "company_key", nullable: true })
  companyKey: string;

  @Column({ name: "description", type: "text", nullable: true })
  description: string;

  @Column({ name: "tag_line", length: 175, nullable: true })
  tagLine: string;

  @Column({ name: "logo_url", length: 205, nullable: true })
  logoUrl: string;

  @Column({ name: "web_url", length: 105, nullable: true })
  website: string;

  @OneToMany(() => Medicine, (medicine: Medicine) => medicine.company)
  medicines: Medicine[];

  @OneToMany(() => News, (news: News) => news.company)
  news: News[];
}
