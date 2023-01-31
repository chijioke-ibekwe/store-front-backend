import Client from "../database";

export type Book = {
    id: number;
    title: string;
    author: string;
    total_pages: number;
    type: string;
    summary: string;
}

export class BookStore {
    async findAll(): Promise<Book[]> {
        try {
            const conn = await Client.connect();
            const sql = 'SELECT * FROM books';
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        } catch (error) {
            throw new Error(`Cannot get books: ${error}`);
        }
    }

    async findById(id: number): Promise<Book> {
        try {
            const conn = await Client.connect();
            const sql = 'SELECT * FROM books WHERE id = ($1)';
            const result = await conn.query(sql, [id]);
            const retrievedBook = result.rows[0];
            conn.release();
            return retrievedBook;
        } catch (error) {
            throw new Error(`Cannot get book with id ${id}: ${error}`);
        }
    }

    async save(book: Book): Promise<Book> {
        try {
            const conn = await Client.connect();
            const sql = 'INSERT INTO books (title, author, total_pages, type, summary) VALUES ($1, $2, $3, $4, $5) RETURNING *';
            const result = await conn.query(sql, [book.title, book.author, book.total_pages, book.type, book.summary]);
            const savedBook = result.rows[0];
            conn.release();
            console.log(savedBook);
            return savedBook;
        } catch (error) {
            throw new Error(`Cannot add book: ${error}`);
        }
    }

    async update(id: number, book: Book): Promise<Book> {
        try {
            const conn = await Client.connect();
            const sql = 'UPDATE books SET title = ($1), author = ($2), total_pages = ($3), type = ($4), summary = ($5) ' +
                        'WHERE id = ($6) RETURNING *';
            const result = await conn.query(sql, [book.title, book.author, book.total_pages, book.type, book.summary, id]);
            const updatedBook = result.rows[0];
            conn.release();
            return updatedBook;
        } catch (error) {
            throw new Error(`Cannot update book with id ${id}: ${error}`);
        }
    }

    async delete(id: number): Promise<void> {
        try {
            const conn = await Client.connect();
            const sql = 'DELETE FROM books WHERE id = ($1)';
            await conn.query(sql, [id]);
            conn.release();
        } catch (error) {
            throw new Error(`Cannot delete book with id ${id}: ${error}`);
        }
    }
}