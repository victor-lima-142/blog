import { FastifyInstance } from "fastify";
import { AuthHooks, CategoryController, Route } from "src";

/**
 * Registers the routes for the CategoryController.
 *
 * @param fastify - The Fastify instance to register the routes with.
 *
 * @remarks
 * The routes are:
 * - GET /categories - Gets all categories and returns them along with the total count.
 * - GET /categories/:id - Gets a category by its id.
 * - POST /categories - Handles the creation of a new category.
 * - DELETE /categories/:id - Removes a category by its id using a soft remove operation.
 * - DELETE /categories/force/:id - Removes a category by its id using a force remove operation.
 * - PUT /categories/:id - Handles the update of an existing category.
 * - GET /categories/from/article/:id - Gets the category associated with a specific article.
 * - GET /categories/articles/:id - Gets all articles associated with a specific category.
 */
export const CategoryRoutes: Route = (fastify: FastifyInstance) => {
    fastify.get('/', CategoryController.getAllCategories);

    fastify.get('/:id', CategoryController.getCategory);

    fastify.get('/from/article/:id', CategoryController.getCategoryFromArticle);

    fastify.get('/articles/:id', CategoryController.getArticlesFromCategory);

    fastify.post('/', {
        preHandler: [AuthHooks.auth]
    }, CategoryController.postCategory);

    fastify.delete('/:id', {
        preHandler: [AuthHooks.auth]
    }, CategoryController.removeCategory);

    fastify.delete('/force/:id', {
        preHandler: [AuthHooks.auth]
    }, CategoryController.forceRemoveCategory);

    fastify.put('/:id', {
        preHandler: [AuthHooks.auth]
    }, CategoryController.updateCategory);
}