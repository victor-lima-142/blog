import { Article, ArticleRepository, Category, CategoryRepository } from "core";

type CategorySummary = (Category & { articlesCount?: number });

export class CategoryService {
    /**
     * Gets all categories and returns them along with the total count
     * @returns a promise of a tuple, where the first element is an array of Category objects,
     * and the second element is the total count of categories
     */
    static async getAllCategories(): Promise<[Category[], number]> {
        const response: [CategorySummary[], number] = await CategoryRepository.findAndCount();
        const mainCategories = [...response[0]];
        if (mainCategories && !!mainCategories.length) {
            const final = mainCategories.map(async category => {
                const counter = await ArticleRepository.count({ where: { tags: { id: category.id } } });
                category.articlesCount = Number(counter);
                return category;
            })
            response[0] = await Promise.all(final);
        }
        return response satisfies [CategorySummary[], number];
    }

    /**
     * Gets an category by its id
     * @param categoryId The id of the category to retrieve
     * @returns A promise of the Category object
     * @throws Error if the category does not exist
     */
    static async getCategory(categoryId: number) {
        return await CategoryRepository.findOneOrFail({ where: { id: categoryId } });
    }

    /**
     * Handles the creation of a new category.
     * @param name - The name of the category to be created.
     */
    static async postCategory(name: string) {
        return await CategoryRepository.save({ name });
    }

    /**
     * Removes an category by its id using a soft remove operation.
     * @param categoryId - The id of the category to be removed.
     * @returns A promise that resolves to the soft-removed Category object.
     * @throws Error if the category does not exist.
     */
    static async removeCategory(categoryId: number) {
        return await CategoryRepository.softDelete({ id: categoryId });
    }

    /**
     * Removes an category by its id using a force remove operation.
     * @param categoryId - The id of the category to be removed.
     * @returns A promise that resolves to the removed Category object.
     * @throws Error if the category does not exist.
     */
    static async forceRemoveCategory(categoryId: number) {
        return await CategoryRepository.delete({ id: categoryId });
    }

    /**
     * Handles the update of an existing category.
     * @param categoryId - The id of the category to be updated.
     * @param name - The new name of the category.
     * @returns A promise that resolves to the updated Category object.
     * @throws Error if the category does not exist.
     */
    static async updateCategory(categoryId: number, name: string) {
        const category = await CategoryRepository.findOneOrFail({ where: { id: categoryId } });
        category.name = name;
        return await category.save();
    }

    /**
     * Retrieves the category associated with a specific article.
     * @param articleId - The id of the article whose category is to be retrieved.
     * @returns A promise that resolves to the Category object associated with the article.
     * @throws Error if the article does not exist.
     */
    static async getCategoryFromArticle(articleId: number): Promise<Category> {
        const article = await ArticleRepository.findOneOrFail({ where: { id: articleId } });
        return article.category;
    }

    /**
     * Retrieves all articles associated with a specific category.
     * @param categoryId - The id of the category whose articles are to be retrieved.
     * @returns A promise that resolves to an array of Article objects associated with the category.
     * @throws Error if the category does not exist.
     */
    static async getArticlesFromCategory(categoryId: number): Promise<Article[]> {
        const category = await CategoryRepository.findOneOrFail({ where: { id: categoryId } });
        return category.articles;
    }
}