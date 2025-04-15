import { Column, Entity, JoinColumn, OneToMany, type Relation } from "typeorm";
import { Article, Base } from ".";

@Entity({ schema: process.env.DB_MAIN_SCHEMA, name: "categories" })
export class Category extends Base {
    @Column({ name: "name", type: "varchar" })
    name: string;

    @OneToMany(() => Article, (article) => article.category)
    @JoinColumn()
    articles: Relation<Article[]>;
}
