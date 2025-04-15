import { Article, Category, Comment, DataSource, Profile, Tag, User } from "core";
import { Repository } from "typeorm";

export const ArticleRepository: Repository<Article> = DataSource.getRepository(Article);
export const CategoryRepository: Repository<Category> = DataSource.getRepository(Category);
export const CommentRepository: Repository<Comment> = DataSource.getRepository(Comment);
export const TagRepository: Repository<Tag> = DataSource.getRepository(Tag);
export const UserRepository: Repository<User> = DataSource.getRepository(User);
export const ProfileRepository: Repository<Profile> = DataSource.getRepository(Profile);