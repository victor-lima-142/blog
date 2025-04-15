import { faker } from "@faker-js/faker";
import { CategoryRepository, ProfileRepository, TagRepository, UserRepository } from "core";
import { crypto } from "src";

const categories = [
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "Computer Science",
    "Economics",
    "Psychology",
    "Sociology",
    "Politics",
    "History",
    "Philosophy",
    "Linguistics",
    "Arts",
    "Literature",
    "Music"
];

const tagsArr: string[] = [
    "Neural Networks",
    "Deep Learning",
    "Computer Vision",
    "Natural Language Processing",
    "Reinforcement Learning",
    "Quantum Cryptography",
    "Zero-Knowledge Proofs",
    "Smart Contracts",
    "Ethical Hacking",
    "Penetration Testing",
    "Biometric Security",
    "DNA Sequencing",
    "Cloud Security",
    "Edge Computing",
    "Serverless Architecture",
    "IoT Security",
    "Big Data Analytics",
    "Data Visualization",
    "Predictive Analytics",
    "DevOps",
    "Microservices",
    "Functional Programming",
    "Distributed Systems",
    "Automated Testing",
    "Code Optimization",
    "CI/CD Pipelines",
    "Federated Learning",
    "Explainable AI",
    "Post-Quantum Cryptography",
    "Digital Twins",
    "Fourier Analysis",
    "Game Theory",
    "Mathematical Modeling",
    "Combinatorics",
    "Bayesian Inference",
    "CRISPR Technology",
    "DNA Sequencing",
    "Gene Therapy",
    "Stem Cells",
    "Synthetic Biology",
    "Radiology",
    "Bioinformatics",
    "Neuroplasticity",
    "Medical AI",
    "Quantum Biology",
    "Biostatistics",
    "Epidemiological Modeling",
    "Tissue Engineering",
    "Robotic Surgery",
    "Clinical Trials",
    "Web Development",
    "Mobile Development",
    "Cloud Computing",
    "DevOps",
    "Data Engineering",
    "Big Data",
    "Machine Learning",
    "Deep Learning",
    "Artificial Intelligence",
    "Natural Language Processing",
    "Computer Vision",
    "English Literature",
    "French Literature",
    "German Literature",
    "Spanish Literature",
    "Italian Literature",
    "Japanese Literature",
    "Chinese Literature",
    "Korean Literature",
    "Russian Literature",
    "Portuguese Literature",
    "Indonesian Literature",
    "Arabic Literature",
    "Hindi Literature",
    "Programming Languages",
    "Data Structures",
    "Chords",
    "Piano",
    "Guitar",
    "Violin",
    "Drums",
    "Bass",
    "Saxophone",
    "Violoncello",
    "Trumpet",
    "Trombone",
    "Flute",
    "Soprano",
    "Tenor",
    "Baritone",
    "Bassoon",
    "Cello",
    "Violin",
    "Piano",
    "Guitar",
    "Violin",
    "Drums",
    "Bass",
    "Saxophone",
    "Violoncello",
    "Trumpet",
    "Trombone",
    "Flute",
    "Soprano",
    "Tenor",
    "Baritone",
    "Bassoon",
    "Cello",
    "Violin",
]

export const startBase = async () => {
    try {
        await createUsersAndProfiles();
        const tags = Array.from(new Set(tagsArr));
        await createFollowRelations();
        if (CategoryRepository && TagRepository) {
            const categoryPromises = categories.map((category) => CategoryRepository.save({ name: category }));
            const tagPromises = tags.map((tag) => TagRepository.save({ name: tag }));
            await Promise.all([...categoryPromises, ...tagPromises]);
        }
    } catch (error) {
        console.error(error);
    }
};

const createUsersAndProfiles = async () => {
    for (let i = 1; i <= 100; i++) {
        let user = UserRepository.create({
            email: faker.internet.email(),
            password: crypto.encrypt("@Tu40028922"),
            username: faker.internet.username(),
            followers: [],
            following: []
        });

        user = await UserRepository.save(user);

        let profile = ProfileRepository.create({
            name: faker.person.fullName(),
            birthday: faker.date.birthdate({ min: 18, max: 60, mode: "age" }),
            avatar: faker.image.avatar(),
            cover: faker.image.url({ width: 900, height: 400 }),
            bio: faker.lorem.sentence(),
            user,
        });

        profile = await ProfileRepository.save(profile);
    }

    const user = UserRepository.create({
        email: "victoreboredo@gmail.com",
        password: crypto.encrypt("@Tu40028922"),
        username: "victor-lima",
    });

    await UserRepository.save(user);

    const profile = ProfileRepository.create({
        name: "Victor Lima Reboredo",
        birthday: new Date("2000-01-01"),
        avatar: faker.image.avatar(),
        cover: faker.image.url(),
        bio: faker.lorem.sentence(),
        user,
    });

    await ProfileRepository.save(profile);
}

const createFollowRelations = async () => {
    const users = await UserRepository.find();
    users.forEach(async (mainUser) => {

        const randomUsersToFollow = [...users].sort(() => Math.random() - 0.5).slice(0, 10);
        randomUsersToFollow.forEach((user) => {
            const followersIds = mainUser?.followers?.map(({ id }) => id) ?? [];
            if (followersIds.includes(user.id)) return

            if (mainUser.followers) {
                mainUser.followers.push(user)
            } else {
                mainUser.followers = [user];
            }
        });
        try {
            await mainUser.save();
        } catch (error) {
            console.error(error);
        }

        const randomUsersToBeInfluent = [...users].sort(() => Math.random() - 0.5).slice(0, 10);
        randomUsersToBeInfluent.forEach(async (influent) => {
            const followingIds = mainUser?.following?.map(({ id }) => id) ?? [];
            if (followingIds.includes(influent.id)) return

            if (influent.following) {
                influent.following.push(mainUser);
            } else {
                influent.following = [mainUser];
            }
            try {
                await influent.save();
            } catch (error) {
                console.error(error);
            }
        });

    })
}