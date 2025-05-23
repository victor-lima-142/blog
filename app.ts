import fastifyJwt from '@fastify/jwt';
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { execSync } from 'child_process';
import { DataSource } from 'core';
import Fastify from "fastify";
import { ApiReply, ApiRequest, BaseHooks, BlogRoutes } from 'src';

const port = process.env.APP_PORT ? Number(process.env.APP_PORT) : 8080;
const host = process.env.APP_HOST ?? "127.0.0.1";

// Function to kill process on port 8080
const killProcessOnPort = async () => {
    try {
        if (process.platform === "win32") {
            const pid = execSync(`netstat -ano | findstr :${port}`)
                .toString()
                .split("\n")
                .filter(line => line.includes("LISTENING"))
                .map(line => line.trim().split(/\s+/).pop())[0];

            if (pid) {
                execSync(`taskkill /PID ${pid} /F`);
            }
        } else {
            execSync(`lsof -ti:${port} | xargs kill -9`);
        }
    } catch (error) {
    }
};

const fastify = Fastify({ logger: true }).withTypeProvider<TypeBoxTypeProvider>();

fastify.register(fastifyJwt, {
    secret: {
        public: process.env.JWT_SECRET ?? "",
        private: process.env.JWT_SECRET ?? ""
    }
});

fastify.addHook("preValidation", async (request: ApiRequest, reply: ApiReply) => BaseHooks.base(request, reply));

/**
 * Starts the server.
 *
 * @remarks
 * This function will start the server, register all the controllers and initialize the database.
 * If there is an error, it will log the error and exit the process.
 */
const start = async () => {
    try {
        await killProcessOnPort();

        if (DataSource.isInitialized) {
            await DataSource.destroy();
        }

        await fastify.register(BlogRoutes, { prefix: "/blog" });

        await DataSource.initialize();

        await fastify.listen({ port, host });
    } catch (err) {
        throw err;
    }
};

start()
    .then(() =>
        console.log(`Server started on http://${host}:${port}`)
    )
    .catch(err => {
        fastify.log.error(err);
        fastify.close();
        process.exit(1);
    });
