import { DataSource as TypeORMDataSource } from "typeorm";
import { ArticleTag } from "./entities/article-tag.entity";
import { Article } from "./entities/article.entity";
import { Category } from "./entities/category.entity";
import { Comment } from "./entities/comment.entity";
import { Profile } from "./entities/profile.entity";
import { Tag } from "./entities/tag.entity";
import { User } from "./entities/user.entity";
import { Migration1744051444374 } from "./migrations/1744051444374-migration";

const Datasource = new TypeORMDataSource({
    type: String(process.env.DB_TYPE ?? "postgres") as "postgres" | "mysql" | "sqlite" | "mariadb",
    database: String(process.env.DB_DATABASE ?? "articles"),
    host: String(process.env.DB_HOST ?? "localhost"),
    port: 5432,
    username: String(process.env.DB_USERNAME ?? "postgres"),
    password: String(process.env.DB_PASSWORD ?? "CYvr9tNwEbalWAZPsMiC"),
    logging: ["error", "log", "warn"],
    entities: [
        ArticleTag,
        Article,
        Category,
        Comment,
        Profile,
        Tag,
        User
    ],
    migrations: [Migration1744051444374]
})

export default Datasource