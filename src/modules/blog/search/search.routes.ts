import { FastifyInstance } from "fastify";
import { Route } from "src";
import { SearchController } from "./search.controller";

/**
 * Registers the routes for the SearchController.
 *
 * @param fastify - The Fastify instance to register the routes with.
 *
 * @remarks
 * The routes are:
 * - GET / - Gets the search of anything.
 */
export const SearchRoutes: Route = (fastify: FastifyInstance) => {
    fastify.get("/:token", SearchController.getSearch);
}