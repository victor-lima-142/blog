import { IsDate, IsString } from "class-validator";

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
}

export class LoginDto {
    @IsString()
    email: string;

    @IsString()
    pass: string;
}