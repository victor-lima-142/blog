import { Column, Entity, JoinColumn, OneToMany, type Relation } from "typeorm";
import { ArticleTag, Base } from ".";

@Entity({ schema: process.env.DB_MAIN_SCHEMA, name: "tags" })
export class Tag extends Base {
    @Column({ name: "name", type: "varchar" })
    name!: string;

    @OneToMany(() => ArticleTag, (articleTag) => articleTag.tag)
    @JoinColumn()
    articles: Relation<ArticleTag[]>;
}
