export interface Book {
    id: string;
    title: string;
    author: string;
    isbn: string;
    genre: string;
    price?: number;
    quantity: number; // Quantity in stock
    discount?: number;   // Calculated later
}