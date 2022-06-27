import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { News } from "./News";
import { Post } from "./Post";
import { Medicine } from "./Medicine";
import { Generic } from "./Generic";


@Entity({name:"meta_data"})
export class MetaDeta{

    @PrimaryGeneratedColumn()
    id:number

    @Column({length:105})
    name:string

    @Column({type:"mediumtext", default:null})
    content:string

    @ManyToMany(()=>Generic, (generic:Generic)=>generic.metaDatas)
    generics:Generic[]

    @ManyToMany(()=>Medicine)
    medicines:Medicine[]

    @ManyToMany(()=>Post)
    posts:Post[]

    @ManyToMany(()=>News)
    news:News[]


}