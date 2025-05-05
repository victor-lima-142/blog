import { Article, ArticleRepository, Tag, TagRepository } from "core";

type TagSummary = (Tag & { articlesCount?: number });

export const TagService = {
    /**
     * Gets all tags and returns them along with the total count
     * @returns a promise of a tuple, where the first element is an array of Tag objects,
     * and the second element is the total count of tags
     */

    async getAllTags(): Promise<[TagSummary[], number]> {
        const response: [TagSummary[], number] = await TagRepository.findAndCount();
        const mainTags = [...response[0]];
        if (mainTags && !!mainTags.length) {
            const final = mainTags.map(async tag => {
                const counter = await ArticleRepository.count({ where: { tags: { id: tag.id } } });
                tag.articlesCount = Number(counter);
                return tag;
            })
            response[0] = await Promise.all(final);
        }
        return response satisfies [TagSummary[], number];
    },

    /**
     * Gets an tag by its id
     * @param tagId The id of the tag to retrieve
     * @returns A promise of the Tag object
     * @throws Error if the tag does not exist
     */
    async getTag(tagId: number) {
        return await TagRepository.findOneOrFail({ where: { id: tagId } });
    },

    /**
     * Handles the creation of a new tag.
     * @param name - The name of the tag to be created.
     */
    async postTag(name: string) {
        return await TagRepository.save({ name });
    },

    /**
     * Removes an tag by its id using a soft remove operation.
     * @param tagId - The id of the tag to be removed.
     * @returns A promise that resolves to the soft-removed Tag object.
     * @throws Error if the tag does not exist.
     */
    async removeTag(tagId: number) {
        return await TagRepository.softDelete({ id: tagId });
    },

    /**
     * Removes an tag by its id using a force remove operation.
     * @param tagId - The id of the tag to be removed.
     * @returns A promise that resolves to the removed Tag object.
     * @throws Error if the tag does not exist.
     */
    async forceRemoveTag(tagId: number) {
        return await TagRepository.delete({ id: tagId });
    },

    /**
     * Handles the update of an existing tag.
     * @param req - The Fastify request object containing the tag data.
     * @param reply - The Fastify reply object used to send the response.
     */
    async updateTag(tagId: number, name: string) {
        const tag = await TagRepository.findOneOrFail({ where: { id: tagId } });
        tag.name = name;
        return await tag.save();
    },

    /**
     * Retrieves all tags associated with a specific article.
     * @param articleId - The id of the article whose tags are to be retrieved.
     * @returns A promise that resolves to an array of Tag objects associated with the article.
     * @throws Error if the article does not exist.
     */
    async getTagsFromArticle(articleId: number): Promise<Tag[]> {
        const article = await ArticleRepository.findOneOrFail({ where: { id: articleId } });
        return article.tags.map(tag => tag);
    },

    /**
     * Retrieves all articles associated with a specific tag.
     * @param tagId - The id of the tag whose articles are to be retrieved.
     * @returns A promise that resolves to an array of Article objects associated with the tag.
     * @throws Error if the tag does not exist.
     */
    async getArticlesFromTag(tagId: number): Promise<Article[]> {
        const tag = await TagRepository.findOneOrFail({ where: { id: tagId } });
        return tag.articles.map(article => article);
    }
}