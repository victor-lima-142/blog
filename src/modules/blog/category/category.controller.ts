import { Controller } from "src";
import { CategoryService } from "./category.service";

export const CategoryController: Controller = {
    /**
     * Gets all categories and returns them along with the total count.
     * @param request - The request object containing the query parameters.
     * @param reply - The Fastify reply object used to send the response.
     * @returns A promise that resolves to an object containing the data and count of the comments.
     * @throws Error if the query parameters are invalid.
     */
    async getAllCategories(_, reply) {
        try {
            const [data, count] = await CategoryService.getAllCategories();
            await reply.code(200).send({ data, count });
        } catch (error) {
            await reply.code(400).send(error);
        }
    },

    /**
     * Gets a category by its id.
     * @param request - The request object containing the query parameters.
     * @param reply - The Fastify reply object used to send the response.
     * @returns A promise that resolves to an object containing the data and count of the comments.
     * @throws Error if the query parameters are invalid.
     */
    async getCategory({ params: { id } }, reply) {
        try {
            const data = await CategoryService.getCategory(+id);
            await reply.code(200).send({ data });
        } catch (error) {
            await reply.code(400).send(error);
        }
    },

    /**
     * Handles the creation of a new category.
     * @param body - The request body containing the category data.
     * @param code - The Fastify reply object used to send the response.
     * @returns A promise that resolves to the newly created Category object.
     * @throws Error if the category could not be created.
     */
    async postCategory({ body }, reply) {
        try {
            const { name } = body;
            const data = await CategoryService.postCategory(name);
            await reply.code(200).send({ data });
        } catch (error) {
            await reply.code(400).send(error);
        }
    },

    /**
     * Removes a category by its id using a soft remove operation.
     * @param params - The request parameters containing the category id.
     * @param code - The Fastify reply object used to send the response.
     * @returns A promise that resolves to the soft-removed Category object.
     * @throws Error if the category does not exist.
     */
    async removeCategory({ params: { id } }, reply) {
        try {
            const data = await CategoryService.removeCategory(+id);
            await reply.code(200).send({ data });
        } catch (error) {
            await reply.code(400).send(error);
        }
    },

    /**
     * Removes a category by its id using a force remove operation.
     * @param params - The request parameters containing the category id.
     * @param code - The Fastify reply object used to send the response.
     * @returns A promise that resolves to the removed Category object.
     * @throws Error if the category does not exist.
     */
    async forceRemoveCategory({ params: { id } }, reply) {
        try {
            const data = await CategoryService.forceRemoveCategory(+id);
            await reply.code(200).send({ data });
        } catch (error) {
            await reply.code(400).send(error);
        }
    },

    /**
     * Handles the update of an existing category.
     * @param body - The request body containing the category data.
     * @param params - The request parameters containing the category id.
     * @param code - The Fastify reply object used to send the response.
     * @returns A promise that resolves to the updated Category object.
     * @throws Error if the category does not exist.
     */
    async updateCategory({ body: { name }, params: { id } }, reply) {
        try {
            const data = await CategoryService.updateCategory(+id, name);
            await reply.code(200).send({ data });
        } catch (error) {
            await reply.code(400).send(error);
        }
    },

    /**
     * Gets the category associated with a specific article.
     * @param params - The request parameters containing the article id.
     * @param code - The Fastify reply object used to send the response.
     * @returns A promise that resolves to the Category object associated with the article.
     * @throws Error if the article does not exist.
     */
    async getCategoryFromArticle({ params: { id } }, reply) {
        try {
            const data = await CategoryService.getCategoryFromArticle(+id);
            await reply.code(200).send({ data });
        } catch (error) {
            await reply.code(400).send(error);
        }
    },

    /**
     * Gets all articles associated with a specific category.
     * @param params - The request parameters containing the category id.
     * @param code - The Fastify reply object used to send the response.
     * @returns A promise that resolves to an array of Article objects associated with the category.
     * @throws Error if the category does not exist.
     */
    async getArticlesFromCategory({ params: { id } }, reply) {
        try {
            const data = await CategoryService.getArticlesFromCategory(+id);
            await reply.code(200).send({ data });
        } catch (error) {
            await reply.code(400).send(error);
        }
    },
}