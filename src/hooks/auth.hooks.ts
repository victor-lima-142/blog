import { ApiReply, ApiRequest } from "src";

export const AuthHooks = {
    auth: async (request: ApiRequest, reply: ApiReply) => {
        try {
            await request.jwtVerify();
        } catch (error) {
            reply.code(401).send({ error: 'Unauthorized' });
        }
    }
}