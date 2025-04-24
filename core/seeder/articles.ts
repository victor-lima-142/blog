import { faker } from "@faker-js/faker";
import { Article, CategoryRepository, CommentRepository, Tag, TagRepository, UserRepository } from "core";

export const startArticles = async () => {
    try {
        const categories = await CategoryRepository.find();
        const tags = await TagRepository.find();
        const users = await UserRepository.find();

        Array.from({ length: 100 }).forEach(async (_, __) => {
            const article = new Article();

            const category = categories[Math.floor(Math.random() * categories.length)];
            if (!category) {
                throw new Error("Category not found");
            }
            const author = users[Math.floor(Math.random() * users.length)];
            if (!author) {
                throw new Error("User not found");
            }
            article.title = faker.lorem.sentence();
            article.content = generateFakeMarkdown();
            article.slug = article.title.replaceAll(".", "").trim().toLowerCase().replace(/ /g, '-').replaceAll("?", "").replaceAll("&", "");
            article.cover = faker.image.url({ width: 900, height: 400 })
            article.category = category;
            article.author = author;

            const randomTags: Tag[] = [];
            for (let i = 0; i < 3; i++) {
                randomTags.push(tags[Math.floor(Math.random() * tags.length)]);
            }
            article.tags = randomTags;

            await article.save();
        })
    } catch (error) {
        console.error(error);
    }
}

function generateFakeMarkdown(): string {
    const heading = `# ${faker.lorem.sentence()}\n`;
    const subheading = `## ${faker.lorem.sentence()}\n`;
    const paragraph = `${faker.lorem.paragraphs(Math.floor(Math.random() * 5))}\n`;
    const list = `- ${faker.lorem.words(5)}\n- ${faker.lorem.words(5)}\n- ${faker.lorem.words(5)}\n`;
    const codeBlock = `\`\`\`js
const message = "${faker.lorem.sentence()}";
console.log(message);
\`\`\`\n`;
    const blockquote = `> ${faker.lorem.sentence()}\n`;

    return [heading, subheading, paragraph, list, codeBlock, blockquote].join('\n');
}

export const startArticleComments = async () => {
    try {
        const articles = await Article.find();
        articles.forEach(async (article) => {
            for (let i = 0; i < 3; i++) {
                const author = await UserRepository.findOneOrFail({ where: { id: Math.floor(Math.random() * 100) } });
                await CommentRepository.create({
                    content: faker.lorem.sentence(260),
                    article,
                    author
                }).save();
            }
        });
    } catch (error) {
        console.error(error);
    }
}

export const startCommentComments = async () => {
    try {
        const comments = await CommentRepository.find();
        comments.forEach(async (comment) => {
            for (let i = 0; i < 3; i++) {
                const author = await UserRepository.findOneOrFail({ where: { id: Math.floor(Math.random() * 100) } });
                await CommentRepository.create({
                    content: faker.lorem.sentence(260),
                    comment,
                    author
                }).save();
            }
        });
    } catch (error) {
        console.error(error);
    }
}