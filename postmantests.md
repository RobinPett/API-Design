Workspace: Collecting workspace informationHere are Postman test scripts tailored for your API based on the provided examples and your workspace structure:

### 1. **Creating and Managing a Randomized Test User**
#### Pre-request Script:
```javascript
let currentUsername = pm.collectionVariables.get("newUsername") || "tester";

// Use a regular expression to check if the current username ends with a number
let numberPattern = /\d+$/;
let match = currentUsername.match(numberPattern);

// Determine the next number to append. If no number exists, start from 1.
let newNumber = match ? parseInt(match[0]) + 1 : 1;

let adjustedUsername = currentUsername.replace(numberPattern, '') + newNumber;

let adjustedUserEmail = adjustedUsername + "@test.com";

pm.collectionVariables.set('newUsername', adjustedUsername);
pm.collectionVariables.set('newUserEmail', adjustedUserEmail);
```

#### Post-request Script:
```javascript
pm.test("Status code is 201 when registering with correct credentials", function () {
  pm.response.to.have.status(201);
});

let response = pm.response.json();

pm.collectionVariables.set('newUserId', response.id);
```

### 2. **Logging in the User**
#### Post-request Script:
```javascript
pm.test("Status code is 200 when logging in with correct credentials", function () {
  pm.response.to.have.status(200);
});

let jsonResponse = pm.response.json();

let token = jsonResponse.token;

let tokenParts = token.split('.');

pm.test("JWT token is in correct format", function () {
    pm.expect(tokenParts.length).to.eql(3);
});

pm.collectionVariables.set('apiKeyUserOne', token);
```

### 3. **Verifying Response Format**
#### Post-request Script:
```javascript
pm.test("Status code is 200 when fetching all games", function () {
  pm.response.to.have.status(200);
});

let response = pm.response.json();

pm.test("Response contains the expected game structure", function () {
    pm.expect(response).to.be.an('array');
    response.forEach(game => {
        pm.expect(game).to.have.property('id');
        pm.expect(game).to.have.property('title');
        pm.expect(game).to.have.property('release_year');
    });
});
```

### 4. **Validating Data Persistence**
#### Post-request Script:
```javascript
pm.test("Status code is 201 when adding a new game", function () {
  pm.response.to.have.status(201);
});

pm.test("Game is added to the database", function (done) {
    pm.sendRequest({
        url: '{{baseURL}}/graphql',
        method: 'POST',
        header: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer {{apiKeyUserOne}}"
        },
        body: {
            mode: 'raw',
            raw: JSON.stringify({
                query: `
                    query {
                        games {
                            id
                            title
                        }
                    }
                `
            })
        }
    }, function (err, response) {
        if (err) {
            console.log(err);
            return;
        }

        let jsonResponse = response.json();

        let newGameTitle = pm.collectionVariables.get("newGameTitle");
        let gameFound = jsonResponse.data.games.some(game => game.title === newGameTitle);

        pm.expect(gameFound).to.be.true;
        done();
    });
});
```

### 5. **Deleting a Game and Verifying Deletion**
#### Post-request Script:
```javascript
pm.test("Status code is 200 when deleting a game", function () {
  pm.response.to.have.status(200);
});

pm.test("Game is removed from the database", function (done) {
    pm.sendRequest({
        url: '{{baseURL}}/graphql',
        method: 'POST',
        header: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer {{apiKeyUserOne}}"
        },
        body: {
            mode: 'raw',
            raw: JSON.stringify({
                query: `
                    query {
                        games {
                            id
                            title
                        }
                    }
                `
            })
        }
    }, function (err, response) {
        if (err) {
            console.log(err);
            return;
        }

        let jsonResponse = response.json();

        let deletedGameId = pm.collectionVariables.get("deletedGameId");
        let gameFound = jsonResponse.data.games.some(game => game.id === deletedGameId);

        pm.expect(gameFound).to.be.false;
        done();
    });
});
```

### Notes:
- Replace `{{baseURL}}` with your API's base URL.
- Adjust GraphQL queries/mutations to match your schema (e.g., `addGame`, `deleteGame`, etc.).
- Use `pm.collectionVariables` to store and reuse dynamic data like tokens, IDs, and titles across requests.