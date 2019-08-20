const express = require('express');
const router = express.Router();
const Author = require('../models/author');
const Book = require('../models/book');

// all authors
router.get('/', async (req, res) => {
    // searchCriteria
    let searchCondition = {};
    if (req.query.name != null && req.query.name !== '') {
        searchCondition.name = new RegExp(req.query.name, 'i');
    }
    try {
        const authors = await Author.find(searchCondition);
        res.render('authors/index', {
            authors,
            searchCondition: req.query
        });
    } catch (error) {
        res.redirect('/');
    }
});

// form for new author
router.get('/new', (req, res) => {
    res.render('authors/new', {
        author: new Author()
    });
});

router.get('/:id', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id);
        const books = await Book.find({
            author: author.id
        }).limit(6).exec();
        author.bookList = books;
        res.render('authors/showCard', {
            author
        });
    } catch (error) {
        res.redirect('/authors');
    }
});

router.get('/:id/edit', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id);
        res.render('authors/edit', {
            author,
        });
    } catch (error) {
        res.redirect('/authors');
    }
});

router.delete('/:id', async (req, res) => {
    // res.send('Delete Author Card' + req.params.id);
    let author;
    try {
        author = await Author.findById(req.params.id);
        await author.remove();
        // res.redirect(`authors/${candidate.id}`);
        res.redirect(`/authors`);
    } catch (error) {
        if (author == null) {
            return res.status(400).redirect('/');
        }
        res.redirect(`/authors/${author.id }`);
    }
});

router.put('/:id', async (req, res) => {
    // res.send('Update Author Card' + req.params.id);
    let author;
    try {
        author = await Author.findById(req.params.id);
        author.name = req.body.name;
        await author.save();
        // res.redirect(`authors/${candidate.id}`);
        res.redirect(`/authors/${author.id}`);
    } catch (error) {
        if (author == null) {
            return res.redirect('/');
        }
        res.render('authors/edit', {
            author: author,
            errorMessage: 'E R R O R /updating/author'
        });
    }
});

// create author
router.post('/', async (req, res) => {
    const author = new Author({
        name: req.body.name
    });
    try {
        const candidate = await author.save();
        // res.redirect(`authors/${candidate.id}`);
        res.redirect('authors/');
    } catch (error) {
        res.render('authors/new', {
            author: author,
            errorMessage: 'E R R O R /creating/author'
        });
    }
});

module.exports = router;