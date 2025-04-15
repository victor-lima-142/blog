import { Article } from "core";
import { Controller } from "src";
import { FindOptionsWhere, In } from "typeorm";
import { ArticleService } from "./article.service";

export const ArticleController: Controller = {
    /**
     * Gets all articles and returns them along with the total count.
     * Accepts tags and categories query parameters to filter the results.
     * @param query - The query object containing the tags and categories query parameters.
     * @param reply - The Fastify reply object used to send the response.
     * @returns A promise that resolves to an object containing the data and count of the articles.
     * @throws Error if the query parameters are invalid.
     */
    async getAllArticles({ query }, reply) {
        try {
            let where: FindOptionsWhere<Article> = {};
            const tags = query?.tags ? Array.from(new Set(query.tags.split(','))).map(e => Number(e)) : undefined;
            const categories = query?.categories ? Array.from(new Set(query.categories.split(','))).map(e => Number(e)) : undefined;
            if (tags?.length) {
                where.tags = In(tags);
            }
            if (categories?.length) {
                where.category = In(categories);
            }
            const [data, count] = await ArticleService.getAllArticles(where);
            await reply.code(200).send({ data, count });
        } catch (error) {
            await reply.code(400).send(error);
        }
    },

    /**
     * Retrieves an article by its id.
     * @param params - The request parameters containing the article id.
     * @param code - The Fastify reply object used to send the response.
     * @returns A promise that resolves to the Article object.
     * @throws Error if the article does not exist or if an error occurs during retrieval.
     */
    async getArticle({ params: { id } }, reply) {
        try {
            const data = await ArticleService.getArticle(+id);
            await reply.code(200).send({ data });
        } catch (error) {
            await reply.code(400).send(error);
        }
    },

    /**
     * Handles the creation of a new article.
     * @param body - The request body containing the article data.
     * @param code - The Fastify reply object used to send the response.
     * @returns A promise that resolves to the newly created Article object.
     * @throws Error if the article could not be created.
     */
    async postArticle({ body }, reply) {
        try {
            const data = await ArticleService.postArticle(body);
            await reply.code(200).send({ data });
        } catch (error) {
            await reply.code(400).send(error);
        }
    },

    /**
     * Removes an article by its id using a soft remove operation.
     * @param params - The request parameters containing the article id.
     * @param reply - The Fastify reply object used to send the response.
     * @returns A promise that resolves to the soft-removed Article object.
     * @throws Error if the article does not exist.
     */
    async removeArticle({ params: { id } }, reply) {
        try {
            const data = await ArticleService.removeArticle(+id);
            await reply.code(200).send({ data });
        } catch (error) {
            await reply.code(400).send(error);
        }
    },

    /**
     * Removes an article by its id using a force remove operation.
     * @param params - The request parameters containing the article id.
     * @param code - The Fastify reply object used to send the response.
     * @returns A promise that resolves to the removed Article object.
     * @throws Error if the article does not exist.
     */
    async forceRemoveArticle({ params: { id } }, reply) {
        try {
            const data = await ArticleService.forceRemoveArticle(+id);
            await reply.code(200).send({ data });
        } catch (error) {
            await reply.code(400).send(error);
        }
    },

    /**
     * Updates an existing article by its id.
     * @param body - The request body containing the updated article data.
     * @param params - The request parameters containing the article id.
     * @param code - The Fastify reply object used to send the response.
     * @returns A promise that resolves to the updated Article object.
     * @throws Error if the article could not be updated.
     */
    async updateArticle({ body, params: { id } }, reply) {
        try {
            const data = await ArticleService.updateArticle(body, +id);
            await reply.code(200).send({ data });
        } catch (error) {
            await reply.code(400).send(error);
        }
    },
}