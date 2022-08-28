import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Medicine } from "./Medicine";
import { MetaDeta } from "./MetaData";

@Entity({ name: "generic" })
export class Generic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "generic_key", type: "mediumtext", nullable: true })
  key: string;
  
  @ManyToMany(() => MetaDeta, (metadata: MetaDeta) => metadata.generics, {
    cascade: true,
  })
  @JoinTable({
    name: "generic_meta",
    joinColumn: { name: "generic", referencedColumnName: "id" },
    inverseJoinColumn: { name: "meta", referencedColumnName: "id" },
  })
  metaDatas: MetaDeta[];

  @OneToMany(() => Medicine, (medicine: Medicine) => medicine.generic)
  medicines: Medicine[];

  @Column({ name: "name", type: "mediumtext", nullable: true })
  name: string;

  @Column({ name: "composition", type: "mediumtext", nullable: true })
  composition: string;

  @Column({ name: "alias_name", type: "mediumtext", nullable: true })
  aliasName: string;

  @Column({ name: "indication", type: "mediumtext", nullable: true })
  indication: string;

  @Column({ name: "pharmacology", type: "mediumtext", nullable: true })
  pharmacology: string;

  @Column({ name: "dosage_administration", type: "mediumtext", nullable: true })
  dosageAdministration: string;

  @Column({ name: "interaction", type: "mediumtext", nullable: true })
  interaction: string;

  @Column({ name: "contraindication", type: "mediumtext", nullable: true })
  contraindication: string;

  @Column({ name: "side_effect", type: "mediumtext", nullable: true })
  sideEffect: string;

  @Column({ name: "pregnancy_lactation", type: "mediumtext", nullable: true })
  pregnancyLactation: string;

  @Column({ name: "precaution_warning", type: "mediumtext", nullable: true })
  precautionWarning: string;

  @Column({ name: "overdose_effect", type: "mediumtext", nullable: true })
  overdoseEffect: string;

  @Column({ name: "therapeutic_class", type: "mediumtext", nullable: true })
  therapeuticClass: string;

  @Column({ name: "storage_condition", type: "mediumtext", nullable: true })
  storageCondition: string;

  @Column({
    name: "use_in_specific_population",
    type: "mediumtext",
    nullable: true,
  })
  useInSpecificPopulation: string;

  @Column({ name: "duration_of_treatment", type: "mediumtext", nullable: true })
  durationOfTreatment: string;

  @Column({ name: "reconstitution", type: "mediumtext", nullable: true })
  reconstitution: string;

  addMetaData(meta: MetaDeta) {
    if (!Array.isArray(this.metaDatas)) {
      this.metaDatas = new Array<MetaDeta>();
    }
    this.metaDatas.push(meta);
  }

  addAllMetaData(metas: MetaDeta[]) {
    if (!Array.isArray(this.metaDatas)) {
      this.metaDatas = new Array<MetaDeta>();
    }
    this.metaDatas.push.apply(this.metaDatas, metas);
  }
}
