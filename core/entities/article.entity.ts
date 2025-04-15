import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn, type Relation } from "typeorm";
import { Category, Comment, Tag, User } from ".";

@Entity({ schema: process.env.DB_MAIN_SCHEMA, name: "articles" })
export class Article extends BaseEntity {
    @PrimaryGeneratedColumn({ name: "id", type: "bigint" })
    id: number;

    @Column({ name: "title", type: "varchar", length: 255 })
    title: string;

    @Column({ name: "slug", type: "varchar", unique: true, length: 255 })
    slug: string;

    @Column({ name: "content", type: "text" })
    content: string;

    @Column({ name: "cover", type: "varchar", nullable: true })
    cover?: string | null;

    @ManyToOne(() => Category, (category) => category.articles)
    @JoinColumn()
    category: Relation<Category>;

    @ManyToMany(() => Tag, ({ articles }) => articles)
    @JoinTable()
    tags: Relation<Tag[]>;

    @OneToMany(() => Comment, (comment) => comment.article, { nullable: true, onDelete: "CASCADE", onUpdate: "CASCADE" })
    comments: Relation<Comment[]>;

    @ManyToOne(() => User, (user) => user.articles)
    @JoinColumn()
    author: Relation<User>;

    @CreateDateColumn({ name: "created_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    updatedAt: Date;

    @DeleteDateColumn({ name: "deleted_at", type: "timestamp", default: null, nullable: true })
    deletedAt: Date;
}
