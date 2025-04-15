import { Column, Entity, JoinColumn, OneToOne, type Relation } from "typeorm";
import { Base, User } from ".";

@Entity({ schema: process.env.DB_USER_SCHEMA, name: "profile" })
export class Profile extends Base {
    @Column({ name: "name", type: "varchar", unique: true, length: 255 })
    name: string;

    @Column({ name: "birthday", type: "date", nullable: true })
    birthday?: Date;

    @Column({ name: "avatar", type: "varchar", nullable: true })
    avatar?: string;

    @Column({ name: "cover", type: "varchar", nullable: true })
    cover?: string;

    @Column({ name: "bio", type: "text", nullable: true })
    bio?: string;

    @OneToOne(() => User, (user) => user.profile)
    @JoinColumn()
    user!: Relation<User>
}