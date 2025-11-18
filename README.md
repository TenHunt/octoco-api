# Welcome to the Bookstore API

## To run the API:

### First install dependencies:

`npm install express zod`
`npm install -D jest ts-jest @types/jest supertest @types/supertest tsx`

### Then start the server:

`npm run dev`

## Sample API calls (in Powershell)

### Create a book (POST /api/books):

`irm http://localhost:3000/api/books -Method Post -Body (@{title="1984";author="Orwell";isbn="1234567890";genre="Fiction";price=89.99;quantity=10} | ConvertTo-Json) -ContentType "application/json"`

### Get all books (GET /api/books)
`irm http://localhost:3000/api/books`

### Get book by ID (GET /api/books/:id) - replace the ID with a real one from a created one above
`irm http://localhost:3000/api/books/1763472482542`

### Update book (PUT /api/books/:id)
`irm http://localhost:3000/api/books/1763472482542 -Method Put -Body (@{price=99.99;quantity=8}|ConvertTo-Json) -ContentType "application/json"`

### Delete book (DELETE /api/books/:id)
`irm http://localhost:3000/api/books/1763472482542 -Method Delete`

### Get books by genre (GET /api/books/genre/:genre) - not case sensitive
`irm http://localhost:3000/api/books/genre/Fiction`

### Get discounted price for a genre (GET /api/books/discounted-price)
`irm "http://localhost:3000/api/books/discounted-price?genre=Fiction&discount=20"`
