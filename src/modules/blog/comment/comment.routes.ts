import { FastifyInstance } from "fastify";
import { AuthHooks, CommentController, Route } from "src";

/**s
 * Registers the routes for the CommentController.
 *
 * The routes are:
 * - GET /comments - Gets all comments and returns them along with the total count.
 * - GET /comments/:id - Gets a comment by its id.
 * - POST /comments - Handles the creation of a new comment.
 * - DELETE /comments/:id - Removes a comment by its id using a soft remove operation.
 * - DELETE /comments/force/:id - Removes a comment by its id using a force remove operation.
 * - PUT /comments/:id - Handles the update of an existing comment.
 */
export const CommentRoutes: Route = (fastify: FastifyInstance) => {
    fastify.get('/', CommentController.getAllComments);

    fastify.get('/:id', CommentController.getComment);

    fastify.post('/', {
        preHandler: [AuthHooks.auth]
    }, CommentController.postComment);

    fastify.delete('/:id', {
        preHandler: [AuthHooks.auth]
    }, CommentController.removeComment);

    fastify.delete('/force/:id', {
        preHandler: [AuthHooks.auth]
    }, CommentController.forceRemoveComment);

    fastify.put('/:id', {
        preHandler: [AuthHooks.auth]
    }, CommentController.updateComment);
}