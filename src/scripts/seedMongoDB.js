/**
 * Genereated script to seed MongoDB with random data
 */

import { MongoClient } from 'mongodb'
import { faker } from '@faker-js/faker'
import dotenv from 'dotenv'
dotenv.config() // Use .env file to use environment variables in the script

const mongoURI = process.env.MONGODB_URI

async function seedDatabase() {
    const client = new MongoClient(mongoURI)
    await client.connect()
    const db = client.db() // Specify the database name if needed -ex: client.db('testDB')

    const gamesCollection = db.collection('games')
    const developersCollection = db.collection('developers')
    const ratingsCollection = db.collection('ratings')
    const platformsCollection = db.collection('platforms')
    const genresCollection = db.collection('genres')

    const developersMap = new Map()
    const ratingsMap = new Map()
    const platformsMap = new Map()
    const genresMap = new Map()

    const predefinedDevelopers = Array.from({ length: 50 }, (_, i) => ({
        id: `dev_${i + 1}`,
        name: faker.company.name(),
        games: new Set(),
    }));

    const games = []

    for (let i = 0; i < 100; i++) { // Generate 100 games
        const gameId = `game_${i + 1}`
        const releaseYear = faker.date.past(20).getFullYear()
        const developers = Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => 
            faker.helpers.arrayElement(predefinedDevelopers)
        );
        const genres = Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => 
            faker.helpers.arrayElement(['Action', 'Adventure', 'FPS', 'Indie', 'Simulation', 'Strategy', 'Sports', 'Racing', 'Puzzle', 'RPG'])
        )
        const platforms = Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => 
            faker.helpers.arrayElement(['PC', 'Xbox One', 'Xbox One X', 'Playstation 4', 'Playstation 5', 'Nintendo Switch', 'Mobile', 'Web'])
        )
        const esrbRating = faker.helpers.arrayElement(['E', 'T', 'M', 'AO'])

        let rating = null;
        if (esrbRating) {
            if (!ratingsMap.has(esrbRating)) {
                const ratingId = `rating_${ratingsMap.size + 1}`
                ratingsMap.set(esrbRating, { id: ratingId, text: esrbRating })
            }
            rating = ratingsMap.get(esrbRating)
        }

        const platformEntries = platforms.map(platform => {
            if (!platformsMap.has(platform)) {
                const platformId = `platform_${platformsMap.size + 1}`
                platformsMap.set(platform, { id: platformId, name: platform })
            }
            return platformsMap.get(platform)
        });

        const genreEntries = genres.map(genre => {
            if (!genresMap.has(genre)) {
                const genreId = `genre_${genresMap.size + 1}`
                genresMap.set(genre, { id: genreId, name: genre })
            }
            return genresMap.get(genre)
        });

        const developerEntries = developers.map(dev => {
            dev.games.add({ id: gameId, title: faker.commerce.productName() });
            return { id: dev.id, name: dev.name };
        });

        games.push({
            id: gameId,
            title: faker.commerce.productName(),
            release_year: releaseYear,
            platforms: platformEntries,
            genres: genreEntries,
            rating: rating,
            developers: developerEntries
        });
    }

    console.log('Inserting generated data into MongoDB...')

    await gamesCollection.insertMany(games);
    await ratingsCollection.insertMany(Array.from(ratingsMap.values()))
    await platformsCollection.insertMany(Array.from(platformsMap.values()))
    await genresCollection.insertMany(Array.from(genresMap.values()))

    const developersArray = predefinedDevelopers.map(dev => ({
        id: dev.id,
        name: dev.name,
        games: Array.from(dev.games),
    }));

    await developersCollection.insertMany(developersArray)

    console.log('Data inserted successfully!')
    client.close()
}

seedDatabase().catch(console.error)
