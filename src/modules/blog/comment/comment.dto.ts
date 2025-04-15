import { IsNumberString, IsOptional, IsString } from "class-validator";

export class PostCommentDto {
    @IsString()
    content: string;

    @IsOptional()
    @IsNumberString()
    articleId: number | string;

    @IsOptional()
    @IsNumberString()
    commentId: number | string;

    @IsNumberString()
    userId: number | string;
}