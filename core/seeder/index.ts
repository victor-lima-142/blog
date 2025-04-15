import { DataSource } from "core";
// import { startArticles } from "./articles";
// import { startBase } from "./base";

async function seed() {
    let errors: boolean = false;
    try {
        if (!DataSource.isInitialized) {
            await DataSource.initialize();
            if (!DataSource.isInitialized) {
                throw new Error("Database not initialized");
            }
        }
        // await startBase();
        // await startArticles();
    } catch (error) {
        errors = true;
        throw error;
    }
    return errors;
}

// seed();