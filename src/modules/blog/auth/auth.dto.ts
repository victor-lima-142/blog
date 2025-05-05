import { IsDate, IsOptional, IsString } from "class-validator";

export class RegisterDto {
    @IsString()
    username: string;

    @IsString()
    email: string;

    @IsString()
    password: string;

    @IsString()
    name: string;

    @IsDate()
    birthday: Date;

    @IsOptional()
    @IsString()
    avatar: string;

    @IsOptional()
    @IsString()
    cover: string;
}

export class LoginDto {
    @IsString()
    email: string;

    @IsString()
    pass: string;
}