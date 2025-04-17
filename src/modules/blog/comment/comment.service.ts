import { ArticleRepository, Comment, CommentRepository, UserRepository } from "core";
import { PostCommentDto } from "./comment.dto";

export class CommentService {
    /**
     * Gets all comments and returns them along with the total count
     * @returns a promise of a tuple, where the first element is an array of Comment objects,
     * and the second element is the total count of comments
     */
    static async getAllComments(): Promise<[Comment[], number]> {
        return await CommentRepository.findAndCount();
    }

    /**
     * Gets an comment by its id
     * @param commentId The id of the comment to retrieve
     * @returns A promise of the Comment object
     * @throws Error if the comment does not exist
     */
    static async getComment(commentId: number) {
        return await CommentRepository.findOneOrFail({ where: { id: commentId } });
    }

    /**
     * Handles the creation of a new comment.
     * @param content - The content of the comment to be created.
     * @param articleId - The id of the article to which the comment belongs.
     * @param commentId - The id of the parent comment, if any.
     * @returns A promise that resolves to the newly created Comment object.
     * @throws Error if the comment could not be created.
     */
    static async postComment(dto: PostCommentDto) {
        const { content, articleId, commentId, userId } = dto;

        const author = await UserRepository.findOneOrFail({ where: { id: Number(userId) } });
        if (!articleId && !commentId) throw new Error("Article or comment id is required");

        const comment = CommentRepository.create({ author, content });
        if (articleId) {
            const article = await ArticleRepository.findOneOrFail({ where: { id: +articleId } });
            comment.article = article;
        } else {
            let parentComment = await CommentRepository.findOneOrFail({ where: { id: +commentId } });
            comment.comment = parentComment;
        }

        return await comment.save();
    }

    /**
     * Removes an comment by its id using a soft remove operation.
     * @param commentId - The id of the comment to be removed.
     * @returns A promise that resolves to the soft-removed Comment object.
     * @throws Error if the comment does not exist.
     */
    static async removeComment(commentId: number) {
        return await CommentRepository.delete({ id: commentId });
    }

    /**
     * Removes an comment by its id using a force remove operation.
     * @param commentId - The id of the comment to be removed.
     * @returns A promise that resolves to the removed Comment object.
     * @throws Error if the comment does not exist.
     */
    static async forceRemoveComment(commentId: number) {
        return await CommentRepository.softDelete({ id: commentId });
    }

    /**
     * Handles the update of an existing comment.
     * @param content - The new content of the comment.
     * @param commentId - The id of the comment to be updated.
     * @returns A promise that resolves to the updated Comment object.
     * @throws Error if the comment does not exist.
     */
    static async updateComment(content: string, commentId: number) {
        const comment: Comment = await CommentRepository.findOneOrFail({ where: { id: commentId } });
        comment.content = content;
        return await comment.save();
    }
}