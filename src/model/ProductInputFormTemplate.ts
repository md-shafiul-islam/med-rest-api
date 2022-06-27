import { Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity({name:"input_template"})
export class ProductInputFormTemplate{

    @PrimaryGeneratedColumn()
    id:number;

    

}