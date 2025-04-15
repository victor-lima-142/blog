import { IsArray, IsNumber, IsNumberString, IsOptional, IsString } from "class-validator";

export class PostArticleDto {
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    slug?: string;

    @IsString()
    content: string;

    @IsString()
    cover: string;

    @IsNumber()
    categoryId: number;

    @IsArray()
    tags: number[];

    @IsNumberString()
    userId: number | string;
}

export class UpdateArticleDto {
    @IsString()
    title: string;

    @IsNumber()
    categoryId: number;

    @IsArray()
    tags: number[];

    @IsString()
    content: string;

    @IsString()
    cover: string;
}

export class PostCommentDto {
    @IsNumber()
    authorId: number;

    @IsString()
    content: string;
}