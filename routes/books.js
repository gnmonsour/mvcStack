const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Book = require('../models/book');
const Author = require('../models/author');

const uploadPath = path.join('public', Book.coverImageBasePath);
const imageMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype));
    }


});

// all books
router.get('/', async (req, res) => {
    // searchCriteria
    const searchCondition = {};
    console.log(req.query);
    if (req.query.title != null && req.query.title !== '') {
        console.log('get / valid title');
        searchCondition.title = new RegExp(req.query.title, 'i');
    }
    try {
        console.log('get / try', JSON.stringify(searchCondition));
        const books = await Book.find(searchCondition);
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
router.post('/', upload.single('cover'), async (req, res) => {
    const fileName = req.file != null ? req.file.filename : null;
    console.log('filename', fileName);
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        published: new Date(req.body.published),
        pageCount: req.body.pagecount,
        coverImageName: fileName,
        description: req.body.description
    });
    try {
        console.log('new instance, pre save', book);
        const candidate = await book.save();
        console.log('candidate', candidate);
        // res.redirect(`books/${candidate.id}`);
        // const books = await Book.find({});
        res.redirect('books/');
    } catch (error) {

        console.log('book skope?', book);
        if (book.coverImageName != null) {
            // assume a file was created
            // removeBookCover(book.coverImageName);
        }
        renderNewPage(res, book, true);
    }
});

function removeBookCover(fileName) {
    fs.unlink(path.join(uploadPath, fileName), err => {
        if (err) console.log(err);
    });
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