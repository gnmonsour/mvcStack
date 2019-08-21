const express = require('express');
const router = express.Router();

const Book = require('../models/book');
const Author = require('../models/author');

const imageMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];


// all books
router.get('/', async (req, res) => {
    // build search criteria
    let query = Book.find();

    // console.log('search values:', req.query);
    if (req.query.title != null && req.query.title !== '') {
        // console.log('get / valid title');
        query = query.regex('title', new RegExp(req.query.title, 'i'));
    }
    if (req.query.publishedBefore != null && req.query.publishedBefore !== '') {
        // console.log('get / valid before');
        query = query.lte('published', req.query.publishedBefore);
    }
    if (req.query.publishedAfter != null && req.query.publishedAfter !== '') {
        // console.log('get / valid after');
        query = query.gte('published', req.query.publishedAfter);
    }

    try {
        const books = await query.exec();
        res.render('books/index', {
            books,
            searchCondition: req.query
        });
    } catch (error) {
        console.log('get / catch');
        res.redirect('/books');
    }
});


// form for new book
router.get('/new', async (req, res) => {
    await renderNewPage(res, new Book());
});

// create book
router.post('/', async (req, res) => {

    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        published: new Date(req.body.published),
        pageCount: req.body.pagecount,
        description: req.body.description
    });


    try {
        saveCover(book, req.body.cover);
        // console.log('new instance, pre save', book);
        const candidate = await book.save();
        // console.log('candidate', candidate);

        res.redirect('books/');
    } catch (error) {

        renderNewPage(res, book, true);
    }
});

router.put('/:id', async (req, res) => {
    // res.send('Update Author Card' + req.params.id);
    let book;
    // console.log('book put');
    try {
        book = await Book.findById(req.params.id);
        book.title = req.body.title;
        book.author = req.body.author;
        book.published = new Date(req.body.published);
        book.pageCount = req.body.pagecount;
        book.description = req.body.description;

        // This is a little odd to me,
        // it may be better to check for equality,
        // need to research where the endoding changes
        if (req.body.cover != null && req.body.cover !== '') {
            saveCover(book, req.body.cover);
        }

        await book.save();

        res.redirect(`/books/${book.id}`);
    } catch (error) {
        if (book == null) {
            return res.redirect('/');
        }
        // res.render('books/edit', {
        //     author: book,
        //     errorMessage: 'E R R O R /updating/book'
        // });
        renderEditPage(res, book, true);
    }
});
router.get('/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id).populate('author').exec();
        // console.log('book', book);
        res.render('books/showCard', {
            book
        });
    } catch (error) {
        res.redirect('/books');
    }
});
router.get('/:id/edit', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        const authors = await Author.find({});
        // console.log('book', book);
        res.render('books/edit', {
            book,
            authors
        });
    } catch (error) {
        res.redirect('/books');
    }
});


router.delete('/:id', async (req, res) => {
    let book;
    try {
        book = await Book.findById(req.params.id);
        await book.remove();
        res.redirect('/books');
    } catch (error) {
        if (book == null) {
            return res.redirect('/');
        }
        res.render(`/books/${book.id }`);
    }
});

function saveCover(book, coverEncoded) {
    if (coverEncoded == null) return;
    const cover = JSON.parse(coverEncoded);
    if (cover != null && imageMimeTypes.includes(cover.type)) {
        book.coverImage = new Buffer.from(cover.data, 'base64');
        book.coverImageType = cover.type;
    }
}

async function renderFormPage(res, book, form, hasError = false) {
    try {
        const authors = await Author.find({});
        const params = {
            authors: authors,
            book: book
        };

        if (hasError) params.errorMessage = 'E R R O R / ' + form + ' / book';
        res.render(`books/${form}`, params);
    } catch (error) {
        res.redirect('/books');
    }
}
async function renderNewPage(res, book, hasError = false) {
    renderFormPage(res, book, 'new', hasError);
}

async function renderEditPage(res, book, hasError = false) {
    renderFormPage(res, book, 'edit', hasError);
}



module.exports = router;