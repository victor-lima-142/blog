import { Controller } from "src";
import { CommentService } from "./comment.service";

export const CommentController: Controller = {
    /**
     * Gets all comments and returns them along with the total count.
     * @param request - The request object containing the query parameters.
     * @param reply - The Fastify reply object used to send the response.
     * @returns A promise that resolves to an object containing the data and count of the comments.
     * @throws Error if the query parameters are invalid.
     */
    async getAllComments(_, reply) {
        try {
            const [data, count] = await CommentService.getAllComments();
            reply.code(200).send({ data, count });
        } catch (error) {
            reply.code(400).send(error);
        }
    },

    /**
     * Gets a comment by its id.
     * @param request - The request object containing the query parameters.
     * @param reply - The Fastify reply object used to send the response.
     * @returns A promise that resolves to an object containing the data and count of the comments.
     * @throws Error if the query parameters are invalid.
     */
    async getComment({ params: { id } }, reply) {
        try {
            const data = await CommentService.getComment(+id);
            reply.code(200).send({ data });
        } catch (error) {
            reply.code(400).send(error);
        }
    },

    /**
     * Handles the creation of a new comment.
     * @param request - The request object containing the query parameters.
     * @param reply - The Fastify reply object used to send the response.
     * @returns A promise that resolves to an object containing the data and count of the comments.
     * @throws Error if the query parameters are invalid.
     */
    async postComment({ body }, reply) {
        try {
            const data = await CommentService.postComment(body);
            reply.code(200).send({ data });
        } catch (error) {
            reply.code(400).send(error);
        }
    },

    /**
     * Removes a comment by its id using a soft remove operation.
     * @param request - The request object containing the query parameters.
     * @param reply - The Fastify reply object used to send the response.
     * @returns A promise that resolves to an object containing the data and count of the comments.
     * @throws Error if the query parameters are invalid.
     */
    async removeComment({ params: { id } }, reply) {
        try {
            const data = await CommentService.removeComment(+id);
            reply.code(200).send({ data });
        } catch (error) {
            reply.code(400).send(error);
        }
    },

    /**
     * Removes a comment by its id using a force remove operation.
     * @param request - The request object containing the query parameters.
     * @param reply - The Fastify reply object used to send the response.
     * @returns A promise that resolves to an object containing the data and count of the comments.
     * @throws Error if the query parameters are invalid.
     */
    async forceRemoveComment({ params: { id } }, reply) {
        try {
            const data = await CommentService.forceRemoveComment(+id);
            reply.code(200).send({ data });
        } catch (error) {
            reply.code(400).send(error);
        }
    },

    /**
     * Handles the update of an existing comment.
     * @param request - The request object containing the query parameters.
     * @param reply - The Fastify reply object used to send the response.
     * @returns A promise that resolves to an object containing the data and count of the comments.
     * @throws Error if the query parameters are invalid.
     */
    async updateComment({ body, params: { id } }, reply) {
        try {
            const data = await CommentService.updateComment(body, +id)
            reply.code(200).send({ data });
        } catch (error) {
            reply.code(400).send(error);
        }
    },
}