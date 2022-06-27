import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { RateKey } from "./RateKey";
import { Rating } from "./Rating";


@Entity({name:"rating_item"})
export class RatingItem {

    @PrimaryGeneratedColumn()
    id:number;

    @ManyToOne(()=>RateKey, (rateKey:RateKey)=>rateKey.id)
    @JoinColumn({name:"rate_key", referencedColumnName:"id"})
    rateKey:RateKey;

    @ManyToOne(()=>Rating, (rating:Rating)=>rating.id)
    @JoinColumn({name:"rating", referencedColumnName:"id"})
    rating:Rating;

    @Column({name:"max_value"})
    maxValue:number;

    @Column({name:"min_value"})
    minValue:number;

    @Column({name:"input_value"})
    inValue:number;

    @Column({name:"description"})
    description:string;
}