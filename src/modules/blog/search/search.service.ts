import { ArticleRepository, CategoryRepository, ProfileRepository, TagRepository, User } from "core";
import { JWTPayload } from "src/base";
import { Like } from "typeorm";
import { ProfileService } from "../profile/profile.service";

export type SearchToken = string | number | Date;

export const SearchService = {
    getSearch: async (token: SearchToken, user?: JWTPayload | User, pageToSearch?: number) => {
        const page: number = pageToSearch ?? 0;
        const articles = await getArticles(token, page);
        const tags = await getTags(token, page);
        const categories = await getCategories(token, page);
        const profiles = await getProfiles(token, page, user);
        return { articles, tags, categories, profiles };
    }
}

const getArticles = async (token: SearchToken, page: number) => {
    return await ArticleRepository.findAndCount({
        where: { title: Like(`%${token}%`), content: Like(`%${token}%`) },
        skip: page,
        take: 15
    });
}

const getTags = async (token: SearchToken, page: number) => {
    return await TagRepository.findAndCount({
        where: { name: Like(`%${token}%`) },
        skip: page,
        take: 15
    });
}

const getCategories = async (token: SearchToken, page: number) => {
    return await CategoryRepository.findAndCount({
        where: { name: Like(`%${token}%`) },
        skip: page,
        take: 15
    });
}

const getProfiles = async (token: SearchToken, page: number, user?: JWTPayload | User) => {
    const [list, count] = await ProfileRepository.findAndCount({
        where: [
            { name: Like(`%${token}%`) },
            { bio: Like(`%${token}%`) },
            {
                user: [
                    { username: Like(`%${token}%`) },
                    { email: Like(`%${token}%`) }
                ]
            }
        ],
        relations: {
            user: true,
        },
        skip: page,
        take: 15
    });
    if (!list.length) return [list, count];

    const listPromises = list.map(async profile => await ProfileService.getAuthorForArticlePage(+profile.user.id, user))
    const profiles = await Promise.all([...listPromises])
    return [profiles, count];
}