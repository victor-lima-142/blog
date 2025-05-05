import { ApiReply, ApiRequest, JWTPayload } from "src";

export const BaseHooks = {

    /**
     * This hook is used to parse the request body and to get the user from the JWT token.
     * If the request body is a string, it is parsed as JSON. If the request body is not empty
     * and it is not possible to parse it as JSON, the request is rejected with a 400 status.
     * The user is obtained from the JWT token and it is added to the request object.
     * If the JWT token is invalid or it is not possible to obtain the user from it, the
     * request is rejected with a 401 status.
     */
    base: async (request: ApiRequest, reply: ApiReply) => {
        if (typeof request.body === 'string') {
            if (request.body !== '') {
                try {
                    request.body = JSON.parse(request.body);
                } catch (err) {
                    reply.code(400).send({ error: 'Invalid JSON' });
                }
            }
        }
        const user = await getUser(request, reply);
        request.user = user;
    },
}
/**
 * Verifies the JWT token and returns the user payload if valid.
 * Returns null if the token is invalid or expired.
 * @param request - The request object containing the JWT token.
 * @param reply - The Fastify reply object used to send the response.
 * @returns A promise that resolves to the user payload if the token is valid, null otherwise.
 */

const getUser = async (request: ApiRequest, reply: ApiReply) => {
    try {
        const user = await request.jwtVerify() as JWTPayload | null | undefined;
        if (user && user?.expires) {
            if (Date.now() > +user.expires) {
                reply.code(401).send({ error: 'Token expired' });
                return null;
            }
        }
        return !user ? null : user;
    } catch (error) {
        return null
    }
}