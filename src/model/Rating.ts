import {
  Column,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Pharmacy } from "./Pharmacy";
import { RatingItem } from "./RatingItem";
import { User } from "./User";

@Entity("rating")
export class Rating {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "public_id", unique: true })
  @Generated("uuid")
  publicId: string;

  @ManyToOne(() => User, (user: User) => user.id, { nullable: true })
  @JoinColumn({ name: "author" })
  author: User;

  @ManyToOne(() => Pharmacy, (pharmacy: Pharmacy) => pharmacy.ratings)
  @JoinColumn({ name: "pharmacy" })
  pharmacy: Pharmacy;

  @ManyToOne(() => User, (user: User) => user.id)
  @JoinColumn({ name: "approve_user" })
  approveUser: User;

  @Column({ name: "tag_line" })
  tagLine: string;

  @Column({ name: "total_rating" })
  totalRating: number;

  @Column({ name: "rate_max_score" })
  rateMaxScore: number;

  @Column({ name: "rate_min_score" })
  rateMinScore: number;

  @Column({ name: "rate_avr_score" })
  rateAvrScore: number;

  @Column({ name: "rate_items_count" })
  rateItemsCount: number;

  @OneToMany(() => RatingItem, (ratingItem: RatingItem) => ratingItem.rating)
  ratingItems: RatingItem[];
}
