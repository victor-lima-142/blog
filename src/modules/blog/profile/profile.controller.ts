import { Controller } from "src";
import { ProfileService } from "./profile.service";

export const ProfileController: Controller = {

    /**
     * Gets the profile of a user.
     * @param request The request object containing the query parameters.
     * @param reply The Fastify reply object used to send the response.
     * @returns A promise that resolves to an object containing the profile.
     * @throws Error if the query parameters are invalid or if there is an error during the request.
     */
    getProfile: async ({ query: { id } }, reply) => {
        try {
            const profile = await ProfileService.getProfile(+id);
            reply.code(200).send({ profile });
        } catch (error) {
            reply.code(400).send(error);
        }
    },

    /**
     * Gets the profile of the currently logged in user.
     * @param request The request object containing the query parameters.
     * @param reply The Fastify reply object used to send the response.
     * @returns A promise that resolves to an object containing the profile.
     * @throws Error if the query parameters are invalid or if there is an error during the request.
     */
    getMe: async ({ query: { id } }, reply) => {
        try {
            const profile = await ProfileService.getMe(+id);
            reply.code(200).send({ profile });
        } catch (error) {
            reply.code(400).send(error);
        }
    },

    /**
     * Deletes the profile of the currently logged in user.
     * @param request The request object containing the query parameters.
     * @param reply The Fastify reply object used to send the response.
     * @returns A promise that resolves to an object containing the profile.
     * @throws Error if the query parameters are invalid or if there is an error during the request.
     */
    deleteProfile: async ({ query: { id } }, reply) => {
        try {
            const profile = await ProfileService.deleteProfile(+id);
            reply.code(200).send({ profile });
        } catch (error) {
            reply.code(400).send(error);
        }
    },

}