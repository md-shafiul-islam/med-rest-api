import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:"rate_key"})
export class RateKey{

    @PrimaryGeneratedColumn()
    id:number;

    @Column({name:"name"})
    name:string;

    @Column({name:"value"})
    value:string;
}