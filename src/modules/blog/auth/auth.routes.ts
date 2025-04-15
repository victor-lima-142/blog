import { FastifyInstance } from "fastify";
import { AuthController, Route } from "src";

export const AuthRoutes: Route = (fastify: FastifyInstance) => {
    fastify.post('/login', AuthController.login);
    fastify.post('/register', AuthController.register);
}