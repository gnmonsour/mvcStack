const express = require('express');
const router = express.Router();
const Author = require('../models/author');

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