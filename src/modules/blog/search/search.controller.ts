import { Controller } from "src";
import { SearchService } from "./search.service";

export const SearchController: Controller = {
    /**
     * Gets the search of a user.
     * @param request The request object containing the query parameters.
     * @param reply The Fastify reply object used to send the response.
     * @returns A promise that resolves to an object containing the search.
     * @throws Error if the query parameters are invalid or if there is an error during the request.
     */
    getSearch: async ({ query, params }, reply) => {
        try {
            const token = query.token ?? params.token;
            const search = await SearchService.getSearch(token);
            reply.code(200).send(search);
        } catch (error) {
            reply.code(400).send(error);
        }
    }
}