import { ProfileRepository } from "core";

export const ProfileService = {
    /**
     * Retrieves a profile by its id.
     * @param id The id of the profile to retrieve.
     * @returns A promise that resolves to the Profile object.
     * @throws Error if the profile does not exist.
     */
    async getProfile(id: number) {
        return await ProfileRepository.findOneOrFail({ where: { id } });
    },

    /**
     * Retrieves the profile of a user, along with their associated user object.
     * @param id The id of the profile to retrieve.
     * @returns A promise that resolves to the Profile object, with the user object attached.
     * @throws Error if the profile does not exist.
     */
    async getMe(id: number) {
        const profile = await ProfileRepository.findOneOrFail({ where: { id }, relations: { user: true } });
        delete (profile as any).user.password;
        return profile;
    },

    /**
     * Deletes a profile by its id, as well as all associated articles and comments.
     * @param id The id of the profile to delete.
     * @returns A promise that resolves to an empty object, or throws an error if the profile does not exist.
     * @throws Error if the profile does not exist.
     */
    async deleteProfile(id: number) {
        const profile = await ProfileRepository.findOneOrFail({ where: { id } });
        const removeArticles = profile?.user?.articles?.map(({ softRemove }) => softRemove)
        const removeCommentsOfArticles = profile?.user?.articles?.map(({ comments }) => comments.map(({ softRemove }) => softRemove));
        const removeComments = profile?.user?.comments?.map(({ softRemove }) => softRemove);
        await Promise.all([...removeArticles, ...removeCommentsOfArticles, ...removeComments]);
        await profile.user.softRemove();
        await profile.softRemove();
        return {};
    },
}