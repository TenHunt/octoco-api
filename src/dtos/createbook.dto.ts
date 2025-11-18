export interface CreateBookDto {
    title: string;
    author: string;
    isbn: string;
    genre: string;
    price: number;
    quantity: number; // Quantity in stock
}