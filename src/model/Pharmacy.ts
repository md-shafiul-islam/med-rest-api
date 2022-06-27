import { Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Rating } from "./Rating";
import { Review } from "./Review";

@Entity("pharmacy")
export class Pharmacy {
    
    @PrimaryGeneratedColumn()
    id:number
    
    name:string

    ownerName:string

    phoneNo:string

    country:string

    division:string

    district:string

    policeStation:string

    postOffice:string

    villageOrTown:string

    @OneToMany(() => Rating, (rating: Rating) => rating.pharmacy)
    ratings:Rating[]

    @OneToMany(()=>Review, (review:Review)=>review.pharmacy)
    reviews:Review[]
} 