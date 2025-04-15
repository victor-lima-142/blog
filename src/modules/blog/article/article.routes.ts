import { FastifyInstance } from "fastify";
import { ArticleController, Route } from "src";

/**
 * Registers the routes for the ArticleRoutes.
 *
 * @param fastify - The Fastify instance to register the routes with.
 *
 * @remarks
 * The routes are:
 * - GET /articles - Gets all articles and returns them along with the total count.
 * - GET /articles/:id - Gets an article by its id.
 * - POST /articles - Handles the creation of a new article.
 * - DELETE /articles/:id - Removes an article by its id using a soft remove operation.
 * - DELETE /articles/force/:id - Removes an article by its id using a force remove operation.
 * - PUT /articles/:id - Handles the update of an existing article.
 */
export const ArticleRoutes: Route = (fastify: FastifyInstance) => {
    fastify.get('/', ArticleController.getAllArticles);

    fastify.get('/:id', ArticleController.getArticle);

    fastify.post('/', ArticleController.postArticle);

    fastify.delete('/:id', ArticleController.removeArticle);

    fastify.delete('/force/:id', ArticleController.forceRemoveArticle);

    fastify.put('/:id', ArticleController.updateArticle);
}