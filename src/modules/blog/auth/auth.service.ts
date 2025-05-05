import { faker } from "@faker-js/faker";
import { EntityProps, Profile, ProfileRepository, UserRepository, UserWithoutPassword } from "core";
import { Crypto } from "src";
import { LoginDto, RegisterDto } from "./auth.dto";

export const AuthService = {
    /**
     * Handles the login request.
     * 
     * @param {LoginDto} dto - The login data.
     * 
     * @returns A promise that resolves to a JSON response containing a JSON Web Token and the user object if the credentials are valid.
     * If the credentials are invalid, the promise resolves to false.
     *
     * @throws If the user is not found, or if there is an error during the login process.
     */
    async login(dto: LoginDto): Promise<AuthResponse> {
        const { email, pass } = dto;

        const { password } = await UserRepository.findOneOrFail({ where: { email } });

        if (Crypto.decrypt(password) !== pass) {
            throw new Error("Invalid password");
        }
        const user = await UserRepository.findOneOrFail({
            where: { email },
            select: {
                password: false,
            },
            relations: {
                profile: true,
            }
        });

        try {
            delete (user as any)?.password;
            delete (user.profile as any)?.user;
        } catch (error) {
            console.error(error)
        }

        return { ...user, ...user.profile };
    },

    /**
     * Handles the registration request.
     *
     * @param {RegisterDto} dto - The registration data.
     * 
     * @returns A promise that resolves to a JSON response containing a JSON Web Token and the user object if the registration is successful.
     *
     * @throws If the user already exists, or if there is an error during the registration process.
     */
    async register(dto: RegisterDto): Promise<AuthResponse> {
        const { email, username, password, name, birthday, avatar, cover } = dto;

        const existingUser = await UserRepository.findOne({
            where: [
                { username },
                { email }
            ]
        });
        if (existingUser) {
            throw new Error("User already exists");
        }

        const user = await UserRepository.create({
            email,
            password: Crypto.encrypt(password),
            username
        }).save();

        const profile = await ProfileRepository.create({
            name,
            birthday,
            user,
            avatar: avatar ?? faker.image.avatar(),
            cover: cover ?? faker.image.url({ width: 900, height: 400 })
        }).save();

        user.profile = profile;
        await user.save();

        try {
            delete (user as any)?.password;
            delete (profile as any)?.user;
        } catch (error) {
            console.error(error)
        }

        return { ...user, ...profile };
    }
}

type AuthResponse = UserWithoutPassword & Omit<EntityProps<Profile>, "user">;