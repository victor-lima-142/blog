import type { FastifyBaseLogger, FastifyInstance, FastifyReply, FastifyTypeProviderDefault, FastifyRequest as IFastifyRequest, FastifySchema as IFastifySchema, RawServerDefault, RouteGenericInterface } from "fastify";
import { IncomingMessage } from "http";

type FastifyRequest<
    RouteGeneric extends RouteGenericInterface = RouteGenericInterface,
    Schema extends FastifySchema = FastifySchema,
    TypeProvider extends FastifyTypeProviderDefault = FastifyTypeProviderDefault,
    Logger extends FastifyBaseLogger = FastifyBaseLogger
> = IFastifyRequest<
    RouteGeneric,
    RawServerDefault,
    IncomingMessage,
    Schema,
    TypeProvider,
    any,
    Logger,
    any
>;

interface RouteGeneric extends RouteGenericInterface {
    Params: {
    };
    Querystring: {
    };
    Body: {
    };
    Reply: {
    };
    User: {
    };
}

interface FastifySchema extends IFastifySchema {
    params: {
        type: 'object';
    };
    querystring: {
        type: 'object';
    };
    body: {
        type: 'object';
    };
    user: {
        type: 'any';
    }
    response: {
        200: {
            type: 'any'
        }
    }
}

export type ApiRequest = FastifyRequest<RouteGeneric, FastifySchema> & {};
export type ApiReply = FastifyReply;

export type Controller = {
    [key: string | number | symbol]: (request: ApiRequest, reply: ApiReply) => Promise<void>;
}

export type Hook = {
    [key: string | number | symbol]: (request: ApiRequest, reply: ApiReply) => Promise<void>;
}
export type Route = (fastify: FastifyInstance) => void;

export type JWTPayload = { id: number, email: string };

declare module "@fastify/jwt" {
    interface FastifyJWT {
        payload: JWTPayload
        user: User
    }
}