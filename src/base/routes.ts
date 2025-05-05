import { FastifyInstance } from "fastify";
import { ArticleRoutes, AuthRoutes, CategoryRoutes, CommentRoutes, ProfileRoutes, SearchRoutes, TagRoutes } from "src";

export const BlogRoutes = async (fastify: FastifyInstance) => {
    await fastify.register(ArticleRoutes, { prefix: '/article' });
    await fastify.register(TagRoutes, { prefix: '/tag' });
    await fastify.register(CategoryRoutes, { prefix: '/category' });
    await fastify.register(CommentRoutes, { prefix: '/comment' });
    await fastify.register(AuthRoutes, { prefix: '/auth' });
    await fastify.register(ProfileRoutes, { prefix: '/profile' });
    await fastify.register(SearchRoutes, { prefix: '/search' });
}