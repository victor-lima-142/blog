import { Article, ArticleRepository, CategoryRepository, CommentRepository, TagRepository, UserRepository } from "core";
import { JWTPayload } from "src/base";
import { FindOptionsWhere, In } from "typeorm";
import { ProfileService } from "../profile/profile.service";
import { PostArticleDto, PostCommentDto, UpdateArticleDto } from "./article.dto";

export const ArticleService = {
    /**
     * Gets all articles and returns them along with the total count
     * @returns a promise of a tuple, where the first element is an array of Article objects,
     * and the second element is the total count of articles
     */
    async getAllArticles(where?: FindOptionsWhere<Article>): Promise<[Article[], number]> {
        return await ArticleRepository.findAndCount({
            where,
            relations: {
                category: true
            },
            order: {
                id: "ASC"
            },
            take: 20
        });
    },

    /**
     * Gets an article by its id
     * @param articleIdOrSlug The id of the article to retrieve
     * @returns A promise of the Article object
     * @throws Error if the article does not exist
     */
    async getArticle(where: FindOptionsWhere<Article>, user?: JWTPayload) {
        const article = await ArticleRepository.findOneOrFail({
            where,
            relations: {
                category: true,
                tags: true,
                author: {
                    profile: true
                },
                comments: {
                    author: {
                        profile: true
                    }
                }
            }
        });
        try {
            delete (article as any).author.password;
        } catch {
            console.log("Don't exclude password");
        }

        const authorInfo = await ProfileService.getAuthorForArticlePage(article.author.id, user);

        article.comments = article.comments.map(comment => {
            try {
                delete (comment as any).author.password;
            } catch {
                console.log("Don't exclude password");
            }
            return comment;
        })

        return { ...article, author: { ...authorInfo } };
    },


    /**
     * Handles the creation of a new article.
     * @param postArticle - The article data to be created.
     */
    async postArticle(postArticle: PostArticleDto) {
        const author = await UserRepository.findOneOrFail({
            where: { id: typeof postArticle.userId == "string" ? Number(postArticle.userId) : postArticle.userId },
            relations: {
                profile: true
            }
        })
        const category = await CategoryRepository.findOneOrFail({ where: { id: postArticle.categoryId } });
        const slug = postArticle.slug ?? postArticle.title.toLowerCase().replace(/ /g, '-').replaceAll("?", "").replaceAll("&", "");
        const tags = await TagRepository.findBy({ id: In(postArticle.tags) });
        const article = ArticleRepository.create({ ...postArticle, author, category, tags: tags ?? [], slug });
        await article.save();
        article.id = Number(article.id);
        return await this.getArticle({ id: +article.id });
    },

    /**
     * Removes an article by its id using a soft remove operation.
     * @param articleId - The id of the article to be removed.
     * @returns A promise that resolves to the soft-removed Article object.
     * @throws Error if the article does not exist.
     */
    async removeArticle(articleId: number) {
        return await ArticleRepository.softDelete({ id: articleId });
    },

    /**
     * Removes an article by its id using a force remove operation.
     * @param articleId - The id of the article to be removed.
     * @returns A promise that resolves to the removed Article object.
     * @throws Error if the article does not exist.
     */
    async forceRemoveArticle(articleId: number) {
        return await ArticleRepository.delete({ id: articleId });
    },

    /**
     * Handles the update of an existing article.
     * @param putArticle - The article data to be updated.
     * @param articleId - The id of the article to be updated.
     */
    async updateArticle(dto: UpdateArticleDto, articleId: number) {
        const { categoryId } = dto;

        const category = await CategoryRepository.findOneOrFail({ where: { id: categoryId } });
        const article = await ArticleRepository.findOneOrFail({ where: { id: articleId } });
        const tags = await TagRepository.findBy({ id: In(dto.tags) });

        const updated = await ArticleRepository.save({ ...article, ...dto, category, tags });

        return await this.getArticle({ id: +updated.id });
    },

    /**
     * Handles the creation of a new comment.
     * @param {object} commentData - The comment data to be created.
     * @param {number} articleId - The id of the article to which the comment belongs.
     * @returns A promise that resolves to the newly created Comment object.
     * @throws Error if the comment could not be created.
     */
    async postComment({ authorId, content }: PostCommentDto, articleId: number) {
        const article = await ArticleRepository.findOneOrFail({ where: { id: articleId } });
        const author = await UserRepository.findOneOrFail({ where: { id: authorId } });
        await CommentRepository.create({
            author, content, article
        }).save();
        return await this.getArticle({ id: +articleId });
    }
}