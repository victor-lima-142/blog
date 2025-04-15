import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne, type Relation } from "typeorm";
import { Article, Base, Comment, EntityPropsWithoutTimestamps, Profile } from ".";

@Entity({ schema: process.env.DB_USER_SCHEMA, name: "users" })
export class User extends Base {
    @Column({ name: "email", type: "varchar", unique: true, length: 255 })
    email!: string

    @Column({ name: "password", type: "varchar", length: 255 })
    password!: string

    @Column({ name: "username", type: "varchar", length: 255 })
    username!: string

    @OneToOne(() => Profile, (profile) => profile.user)
    profile!: Relation<Profile>

    @OneToMany(() => Article, (article) => article.author)
    @JoinColumn()
    articles: Relation<Article[]>

    @OneToMany(() => Comment, (comment) => comment.author)
    comments: Relation<Comment[]>

    @ManyToMany(() => User, user => user.followers, { nullable: true, onDelete: "CASCADE", onUpdate: "CASCADE" })
    @JoinTable({
        name: "user_following",
        joinColumn: {
            name: "followerId",
            referencedColumnName: "id",
        },
        inverseJoinColumn: {
            name: "followingId",
            referencedColumnName: "id",
        },
    })
    following: Relation<User[]>

    @ManyToMany(() => User, user => user.following, { nullable: true, onDelete: "CASCADE", onUpdate: "CASCADE" })
    followers: Relation<User[]>
}

export type UserWithoutPassword = Omit<EntityPropsWithoutTimestamps<User>, "password">