export interface CreateBookDto {
    title: string;
    author: string;
    isbn: string;
    genre: string;
    purchPrice: number; // Price from supplier
    sellPrice: number; // Price to customer before discounts
    quantity: number; // Quantity in stock
}