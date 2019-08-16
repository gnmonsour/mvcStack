const express = require('express');
const router = express.Router();

const Book = require('../models/book');
const Author = require('../models/author');

const imageMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];


// all books
router.get('/', async (req, res) => {
    // build search criteria
    let query = Book.find();

    console.log('search values:', req.query);
    if (req.query.title != null && req.query.title !== '') {
        console.log('get / valid title');
        query = query.regex('title', new RegExp(req.query.title, 'i'));
    }
    if (req.query.publishedBefore != null && req.query.publishedBefore !== '') {
        console.log('get / valid before');
        query = query.lte('published', req.query.publishedBefore);
    }
    if (req.query.publishedAfter != null && req.query.publishedAfter !== '') {
        console.log('get / valid after');
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
        console.log('new instance, pre save', book);
        const candidate = await book.save();
        console.log('candidate', candidate);

        res.redirect('books/');
    } catch (error) {

        renderNewPage(res, book, true);
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

async function renderNewPage(res, book, hasError = false) {
    try {
        const authors = await Author.find({});
        const params = {
            authors: authors,
            book: book
        };
        if (hasError) params.errorMessage = 'E R R O R /creating/book';
        res.render('books/new', params);
    } catch (error) {
        res.redirect('/books');
    }
}



module.exports = router;