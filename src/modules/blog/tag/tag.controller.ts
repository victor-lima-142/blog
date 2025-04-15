import { Controller } from "src";
import { TagService } from "./tag.service";

export const TagController: Controller = {
    /**
     * Gets all tags and returns them along with the total count.
     * @param request - The request object containing the query parameters.
     * @param reply - The Fastify reply object used to send the response.
     * @returns A promise that resolves to an object containing the data and count of the tags.
     * @throws Error if the query parameters are invalid.
     */
    async getAllTags(_, reply) {
        try {
            const [data, count] = await TagService.getAllTags();
            reply.code(200).send({ data, count });
        } catch (error) {
            reply.code(400).send(error);
        }
    },

    /**
     * Gets a tag by its id.
     * @param request - The request object containing the query parameters.
     * @param reply - The Fastify reply object used to send the response.
     * @returns A promise that resolves to an object containing the data and count of the tags.
     * @throws Error if the query parameters are invalid.
     */
    async getTag({ params: { id } }, reply) {
        try {
            const data = await TagService.getTag(+id);
            reply.code(200).send({ data });
        } catch (error) {
            reply.code(400).send(error);
        }
    },

    /**
     * Handles the creation of a new tag.
     * @param request - The request object containing the query parameters.
     * @param reply - The Fastify reply object used to send the response.
     * @returns A promise that resolves to an object containing the data and count of the tags.
     * @throws Error if the query parameters are invalid.
     */
    async postTag({ body: { name } }, reply) {
        try {
            const data = await TagService.postTag(name);
            reply.code(201).send({ data });
        } catch (error) {
            reply.code(400).send(error);
        }
    },

    /**
     * Removes an tag by its id using a soft remove operation.
     * @param request - The request object containing the query parameters.
     * @param reply - The Fastify reply object used to send the response.
     * @returns A promise that resolves to an object containing the data and count of the tags.
     * @throws Error if the query parameters are invalid.
     */
    async removeTag({ params: { id } }, reply) {
        try {
            const data = await TagService.removeTag(+id);
            reply.code(200).send({ data });
        } catch (error) {
            reply.code(400).send(error);
        }
    },

    /**
     * Removes an tag by its id using a force remove operation.
     * @param request - The request object containing the query parameters.
     * @param reply - The Fastify reply object used to send the response.
     * @returns A promise that resolves to an object containing the data and count of the tags.
     * @throws Error if the query parameters are invalid.
     */
    async forceRemoveTag({ params: { id } }, reply) {
        try {
            const data = await TagService.forceRemoveTag(+id);
            reply.code(200).send({ data });
        } catch (error) {
            reply.code(400).send(error);
        }
    },

    /**
     * Handles the update of an existing tag.
     * @param request - The request object containing the query parameters.
     * @param reply - The Fastify reply object used to send the response.
     * @returns A promise that resolves to an object containing the data and count of the tags.
     * @throws Error if the query parameters are invalid.
     */
    async updateTag({ body: { name }, params: { id } }, reply) {
        try {
            const data = await TagService.updateTag(+id, name);
            reply.code(200).send({ data });
        } catch (error) {
            reply.code(400).send(error);
        }
    },

    /**
     * Gets all tags associated with a specific article.
     * @param request - The request object containing the query parameters.
     * @param reply - The Fastify reply object used to send the response.
     * @returns A promise that resolves to an object containing the data and count of the tags.
     * @throws Error if the query parameters are invalid.
     */
    async getTagsFromArticle({ params: { id } }, reply) {
        try {
            const data = await TagService.getTagsFromArticle(+id);
            reply.code(200).send({ data });
        } catch (error) {
            reply.code(400).send(error);
        }
    },

    /**
     * Gets all articles associated with a specific tag.
     * @param request - The request object containing the query parameters.
     * @param reply - The Fastify reply object used to send the response.
     * @returns A promise that resolves to an object containing the data and count of the tags.
     * @throws Error if the query parameters are invalid.
     */
    async getArticlesFromTag({ params: { id } }, reply) {
        try {
            const data = await TagService.getArticlesFromTag(+id);
            reply.code(200).send({ data });
        } catch (error) {
            reply.code(400).send(error);
        }
    }
}