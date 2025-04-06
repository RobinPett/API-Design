# Game API

# Implementation type
GraphQL implementation

# Links 
- [Github Repo url](https://github.com/RobinPett/API-Design)
- [Production url](https://api-design-theta.vercel.app/)
- [Graphql Playground url](https://api-design-theta.vercel.app/graphiql)
- [Documentation url](https://documenter.getpostman.com/view/31086079/2sB2cU9h3N)

## Description
Provide a concise summary of what your API does and its main features
The Game API allows you to query Games along with its Title, Release year, Developers, Genres, Platforms, and Rating.
To Mutate a game you need to register as a user and login.
When you have logged in and have a token you can mutate a specific games information.


## Technologies Used
List the primary technologies and tools utilized in your project for quick reference.

The API is built with Javascript using the Fastify framework together with Mercurius to adapt GraphQL functionality.
The database is mongoDB, in production MongoDB Atlas is used. 
The API is in production on Vercel. 

## Installation Instructions
   - **Steps:**
     - **Clone the Repository:** 
     ```bash 
     git clone https://github.com/RobinPett/API-Design.git
     ```
     - **Navigate to the Project Directory:** Change directory to the cloned repository.
     - **Install Dependencies:** Install necessary packages using `npm install`.
     - **Configure Environment Variables:** Set up the `.env` file with required environment variables. See [.example.env](./.example.env) for required environmental variables
     - **Seed database:** Use `npm run seed` to run the seed script.
     - **Start server:** Use `npm run dev` to run the server locally.

   - **Testing with Postman:**
     - **Import the Collection:** 
        - Navigate to [Postman](https://postman.co/) 
        - Navigate to a workspace or create one
        - Press import and select this file - [Game API Collection](./Game%20API.postman_collection.json)
     - **Run the Tests:**
        - Select the imported Game API collection
        - Navigate to Runs
        - Press Run
        - Press Run Game API
        - Cross your figners
