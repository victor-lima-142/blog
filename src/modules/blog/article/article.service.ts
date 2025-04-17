import { Article, ArticleRepository, CategoryRepository, CommentRepository, TagRepository, UserRepository } from "core";
import { FindOptionsWhere, In } from "typeorm";
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
    async getArticle(articleIdOrSlug: number | string) {
        const where = typeof articleIdOrSlug === "string" ? { slug: articleIdOrSlug } : { id: articleIdOrSlug };
        const article = await ArticleRepository.findOneOrFail({
            where,
            relations: {
                category: true,
                tags: true,
                author: true
            }
        });

        const category = article.category;

        const author = await UserRepository.findOneOrFail({
            where: {
                id: article.author.id
            },
            relations: {
                profile: true,
            }
        });

        const commentsArr = await CommentRepository.find({
            where: {
                article: { id: article.id }
            },
            relations: {
                author: {
                    profile: true,
                }
            },
            order: { createdAt: "DESC" }
        });
        const comments: any[] = commentsArr.map(({ author, ...comment }) => ({
            ...comment,
            author: {
                email: author.email,
                avatar: author.profile.avatar,
                cover: author.profile.cover,
                name: author.profile.name,
                username: author.username,
                id: author.id,
                profileId: author.profile.id
            }
        }))

        return {
            ...article, category,
            author: {
                email: author.email,
                avatar: author.profile.avatar,
                cover: author.profile.cover,
                name: author.profile.name,
                username: author.username,
                id: author.id,
                profileId: author.profile.id
            },
            comments
        };
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
        return await this.getArticle(+article.id);
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

        return await this.getArticle(+updated.id);
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
        return await this.getArticle(+articleId);
    }
}