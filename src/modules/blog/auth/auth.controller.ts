import { Controller } from "src";
import { AuthService } from "./auth.service";

const getDateExpires = () => new Date(Date.now() + 1000 * 60 * 60 * 24 * Number(process.env.JWT_DAYS ?? 1));

export const AuthController: Controller = {
    /**
     * Handles the creation of a new category.
     * @param body - The request body containing the user login data.
     * @param code - The Fastify reply object used to send the response.
     * @returns A promise that resolves to the user logged.
     * @throws Error if the category could not be created.
     */
    async login({ body }, reply) {
        try {
            const user = await AuthService.login({ email: body.email, pass: body.password });
            if (!user) return reply.code(401).send({ error: 'Invalid credentials' });
            const token = await reply.jwtSign({
                id: user.id,
                email: user.email,
                expires: getDateExpires()
            });
            await reply.code(200).send({ token, user });
        } catch (error) {
            await reply.code(400).send(error);
        }
    },

    /**
     * Handles the creation of a new category.
     * @param body - The request body containing the user register data.
     * @param code - The Fastify reply object used to send the response.
     * @returns A promise that resolves to the user to be register.
     * @throws Error if the category could not be created.
     */
    async register({ body }, reply) {
        try {
            const user = await AuthService.register(body);
            if (!!user && user?.id && user?.email) {
                const token = await reply.jwtSign({
                    id: user.id,
                    email: user.email,
                    expires: getDateExpires()
                });
                await reply.code(201).send({ ...user, token, message: 'User registered successfully' });
            }
            throw new Error("User registration failed");
        } catch (error) {
            await reply.code(400).send(error);
        }
    }
}