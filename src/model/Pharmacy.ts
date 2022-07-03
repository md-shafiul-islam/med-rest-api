import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Rating } from "./Rating";
import { Review } from "./Review";

@Entity("pharmacy")
export class Pharmacy {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "name", nullable: true })
  name: string;

  @Column({ name: "owner_name", nullable: true })
  ownerName: string;

  @Column({ name: "alias_name", nullable: true })
  aliasName: string;

  @Column({ name: "phone_no", nullable: true })
  phoneNo: string;

  @Column({ name: "country", nullable: true })
  country: string;

  @Column({ name: "division", nullable: true })
  division: string;

  @Column({ name: "district", nullable: true })
  district: string;

  @Column({ name: "details", type: "mediumtext", nullable: true })
  details: string;

  @Column({ name: "police_station", nullable: true })
  policeStation: string;

  @Column({ name: "post_office", nullable: true })
  postOffice: string;

  @Column({ name: "village_town", nullable: true })
  villageOrTown: string;

  @Column({ name: "license_no", nullable: true })
  licenseNo: string;

  @Column({ name: "new_license_no", nullable: true })
  newLicenseNo: string;

  @Column({ name: "renewal", nullable: true })
  renewal: string;

  @Column({ name: "valid_upto", nullable: true })
  validUpto: string;

  @Column({ name: "upazila_name", nullable: true })
  upazilaName: string;

  @OneToMany(() => Rating, (rating: Rating) => rating.pharmacy)
  ratings: Rating[];

  @OneToMany(() => Review, (review: Review) => review.pharmacy)
  reviews: Review[];
}
