import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
  TreeLevelColumn,
} from "typeorm";
import { News } from "./News";
import { Post } from "./Post";
import { Medicine } from "./Medicine";
import { Generic } from "./Generic";

@Entity({ name: "category" })
@Tree("closure-table", {
  closureTableName: "category_closure",
  ancestorColumnName: (column) => "parent" + column.propertyName,
  descendantColumnName: (column) => "children" + column.propertyName,
})
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    type: "text",
  })
  description: string;

  @TreeChildren()
  children: Category[];

  @TreeParent()
  parent: Category;

  @OneToMany(() => Generic, (generic: Generic) => generic.category)
  generics: Generic[];

  @OneToMany(() => Post, (post: Post) => post.category)
  posts: Post[];

  @OneToMany(() => News, (news: News) => news.category)
  news: News[];
}
