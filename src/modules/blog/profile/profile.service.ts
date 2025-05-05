import { Profile, ProfileRepository, User, UserRepository } from "core";
import { JWTPayload } from "src";

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

    /**
     * Unfollows a user.
     * @param profileUserId The id of the user to be unfollowed.
     * @param userId The id of the user that is unfollowing.
     * @throws Error if the user to be unfollowed is the same as the user that is unfollowing, or if the user to be unfollowed is not currently being followed.
     */
    unfollowProfile: async (profileUserId: number, userId: number) => {
        if (profileUserId === userId) throw new Error("You cannot unfollow yourself.");
        const [userToBeUnfollowed, userThatIsUnfollowing] = await Promise.all([
            UserRepository.findOne({
                where: { id: profileUserId },
                relations: { followers: true }
            }),
            UserRepository.findOne({
                where: { id: userId },
                relations: { following: true }
            })
        ]);

        if (!userToBeUnfollowed || !userThatIsUnfollowing) {
            throw new Error("One or both users not found.");
        }

        userThatIsUnfollowing.following = userThatIsUnfollowing.following.filter(f => Number(f.id) !== userId);
        userToBeUnfollowed.followers = userToBeUnfollowed.followers.filter(f => Number(f.id) !== userId);
        await Promise.all([
            UserRepository.save(userThatIsUnfollowing),
            UserRepository.save(userToBeUnfollowed)
        ]);

        return await ProfileService.getAuthorForArticlePage(Number(profileUserId), userThatIsUnfollowing)
    },

    /**
     * Follows a user.
     * @param profileUserId The id of the user to be followed.
     * @param userId The id of the user that is following.
     * @throws Error if the user to be followed is the same as the user that is following, or if the user to be followed is already being followed.
     */
    followProfile: async (profileUserId: number, userId: number) => {
        if (profileUserId === userId) throw new Error("You cannot follow yourself.");

        const [userToBeFollowed, userThatIsFollowing] = await Promise.all([
            UserRepository.findOne({
                where: { id: profileUserId },
                relations: { followers: true, following: true }
            }),
            UserRepository.findOne({
                where: { id: userId },
                relations: { following: true, followers: true }
            })
        ]);

        if (!userToBeFollowed || !userThatIsFollowing) {
            throw new Error("One or both users not found.");
        }

        if (userToBeFollowed.followers.some(({ id }) => Number(id) === Number(userId))) {
            throw new Error("You are already following this user.");
        }

        userThatIsFollowing.following.push(userToBeFollowed);
        userToBeFollowed.followers.push(userThatIsFollowing);

        await Promise.all([
            UserRepository.save(userThatIsFollowing),
            UserRepository.save(userToBeFollowed)
        ])

        return await ProfileService.getAuthorForArticlePage(Number(profileUserId), userThatIsFollowing)
    },

    getAuthorForArticlePage: async (authorId: number, user?: JWTPayload | User): Promise<AuthorForArticlePage> => {
        const author = await UserRepository.findOneOrFail({
            where: {
                id: Number(authorId),
            },
            relations: {
                followers: true,
                following: true,
                profile: true
            }
        });
        const followingCount = author.following.length;
        const followerCount = author.followers.length;
        const following = author.followers.some(({ id }) => Number(id) === Number(user?.id));
        delete (author as any).password;
        return { ...author, followingCount, followerCount, following };
    }
}

export interface AuthorForArticlePage {
    id: string | number
    createdAt: Date
    updatedAt: Date
    deletedAt?: Date
    email: string
    username: string
    profile: Profile
    followingCount: number
    followerCount: number
    following: boolean
}