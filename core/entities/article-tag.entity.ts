import { BaseEntity, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, type Relation } from "typeorm";
import { Article, Tag } from ".";

@Entity({ schema: process.env.DB_MAIN_SCHEMA, name: "article_tag" })
export class ArticleTag extends BaseEntity {
    @PrimaryGeneratedColumn({ name: "id", type: "bigint" })
    id: number;

    @ManyToOne(() => Article, (article) => article.tags)
    @JoinColumn()
    article: Relation<Article>;

    @ManyToOne(() => Tag, (tag) => tag.articles)
    @JoinColumn()
    tag: Relation<Tag>;
}
