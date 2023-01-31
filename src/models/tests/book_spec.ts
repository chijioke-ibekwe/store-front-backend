import { Book, BookStore } from '../book';

const bookStore = new BookStore();

describe('Book Model Tests', () => {
    it('should get all books from the database', async () => {
        const result = await bookStore.findAll();

        expect(result).toEqual([]);
    })

    it('should get a single book from the database', async () => {

        expect(bookStore.findById).toBeDefined;
    })

    it('should add a book to the database', async () => {
        const book: Book = {
            id: 1,
            title: 'Things Fall Apart', 
            author: 'Chinua Achebe', 
            total_pages: 550, 
            type: 'Novel', 
            summary: 'Traditional west african drama set in a village in eastern Nigeria'
        }

        const result = await bookStore.save(book);

        expect(result).toEqual({
            id: 1,
            title: 'Things Fall Apart', 
            author: 'Chinua Achebe', 
            total_pages: 550, 
            type: 'Novel', 
            summary: 'Traditional west african drama set in a village in eastern Nigeria'
        });
    })

})