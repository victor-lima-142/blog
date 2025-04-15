import { AuthHooks, Route, TagController } from "src";

/**
 * Registers the routes for the TagController.
 *
 * @param fastify - The Fastify instance to register the routes with.
 *
 * @remarks
 * The routes are:
 * - GET /tags - Gets all tags and returns them along with the total count.
 * - GET /tags/:id - Gets a tag by its id.
 * - POST /tags - Handles the creation of a new tag.
 * - DELETE /tags/:id - Removes an tag by its id using a soft remove operation.
 * - DELETE /tags/force/:id - Removes an tag by its id using a force remove operation.
 * - PUT /tags/:id - Handles the update of an existing tag.
 * - GET /tags/from/article/:id - Gets all tags associated with a specific article.
 * - GET /tags/articles/:id - Gets all articles associated with a specific tag.
 */
export const TagRoutes: Route = (fastify) => {
    fastify.get('/', TagController.getAllTags);

    fastify.get('/:id', TagController.getTag);

    fastify.get('/from/article/:id', TagController.getTagsFromArticle);

    fastify.get('/articles/:id', TagController.getArticlesFromTag);

    fastify.post('/', {
        preHandler: [AuthHooks.auth]
    }, TagController.postTag);

    fastify.delete('/:id', {
        preHandler: [AuthHooks.auth]
    }, TagController.removeTag);

    fastify.delete('/force/:id', {
        preHandler: [AuthHooks.auth]
    }, TagController.forceRemoveTag);

    fastify.put('/:id', {
        preHandler: [AuthHooks.auth]
    }, TagController.updateTag);
}