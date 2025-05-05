import { FastifyInstance } from "fastify";
import { AuthHooks, Route } from "src";
import { ProfileController } from "./profile.controller";

/**
 * Registers the routes for the ProfileController.
 *
 * @param fastify - The Fastify instance to register the routes with.
 *
 * @remarks
 * The routes are:
 * - GET / - Gets the profile of a user by id.
 * - GET /me - Gets the profile of the currently logged in user.
 * - DELETE /me - Deletes the profile of the currently logged in user.
 */
export const ProfileRoutes: Route = (fastify: FastifyInstance) => {
    fastify.get("/", ProfileController.getProfile);
    fastify.get("/me", ProfileController.getProfile);
    fastify.delete("/me", {
        preHandler: [AuthHooks.auth]
    }, ProfileController.deleteProfile);
    fastify.post("/unfollow/:id", async (req, res) => {
        const response = ProfileController.unfollowProfile(req as any, res)
        return response;
    });
    fastify.post("/follow/:id", async (req, res) => {
        const response = ProfileController.followProfile(req as any, res)
        return response;
    });
}