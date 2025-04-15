import { Column, Entity, JoinTable, ManyToMany, type Relation } from "typeorm";
import { Article, Base } from ".";

@Entity({ schema: process.env.DB_MAIN_SCHEMA, name: "tags" })
export class Tag extends Base {
    @Column({ name: "name", type: "varchar" })
    name!: string;

    @ManyToMany(() => Article)
    @JoinTable({
        name: "article_tag"
    })
    articles: Relation<Article[]>;
}
