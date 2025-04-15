import { EntityProps, Profile, ProfileRepository, User, UserRepository, UserWithoutPassword } from "core";
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
        const returnUser: User = Object.create({ ...user });
        const returnProfile: Profile = Object.create({ ...user.profile });

        try {
            delete (returnUser as any)?.password;
            delete (returnProfile as any)?.user;
        } catch (error) {
            console.error(error);
        }

        return { ...returnUser, ...returnProfile }
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
        const { email, username, password, name, birthday } = dto;

        const existingUser = await UserRepository.findOne({
            where: [
                { username },
                { email }
            ]
        });
        if (existingUser) {
            throw new Error("User already exists");
        }
        let user = new User();
        let profile = new Profile();

        user.email = email;
        user.password = Crypto.encrypt(password);
        user.username = username;
        user = await UserRepository.save(user);

        profile.name = name;
        profile.birthday = birthday;
        profile.user = user;
        profile.avatar = "https://cdn-icons-png.flaticon.com/512/6858/6858504.png";
        profile.cover = "https://marketplace.canva.com/EAENvp21inc/1/0/1600w/canva-simple-work-linkedin-banner-qt_TMRJF4m0.jpg";
        profile = await ProfileRepository.save(profile);

        user.profile = profile;
        user.followers = [];
        user.following = [];

        await UserRepository.save(user);

        const returnUser: User = Object.create({ ...user });
        const returnProfile: Profile = Object.create({ ...profile });

        try {
            delete (returnUser as any)?.password;
            delete (returnProfile as any)?.user;
        } catch (error) {
            console.error(error)
        }

        return { ...returnUser, ...returnProfile };
    }
}

type AuthResponse = UserWithoutPassword & Omit<EntityProps<Profile>, "user">;