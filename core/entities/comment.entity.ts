import { Column, Entity, JoinColumn, ManyToOne, OneToMany, type Relation } from "typeorm";
import { Article, Base, User } from ".";

@Entity({ schema: process.env.DB_MAIN_SCHEMA, name: "comments" })
export class Comment extends Base {
    @Column({ name: "content", type: "text" })
    content: string;

    @ManyToOne(() => Article, (article) => article.comments)
    @JoinColumn()
    article!: Relation<Article>;

    @ManyToOne(() => Comment, (comment) => comment.comments)
    comment!: Relation<Comment>;

    @OneToMany(() => Comment, (comment) => comment.comment, { nullable: true, onDelete: "CASCADE", onUpdate: "CASCADE" })
    @JoinColumn()
    comments: Relation<Comment[]>;

    @ManyToOne(() => User, (user) => user.comments, { nullable: true, onDelete: "CASCADE", onUpdate: "CASCADE" })
    @JoinColumn()
    author: Relation<User>;
}
