const express = require("express");
const items = require("./fakeDb.js");
const ExpressError = require("./error.js")
const router = new express.Router();

//Returns Shopping List
router.get('/', function (req, res, next) {
    return res.json(items);
});

//Add to Shopping List
router.post('/', function (req, res, next) {
    let name = req.body.name;
    let price = req.body.price;

    if (typeof name !== 'undefined' & typeof price !== 'undefined') {
        let item = { name: name, price: price }
        if (items.find((element) => element.name === item.name)) {
            next(new ExpressError("Item already on list", 400))
        }
        else {
            items.push(item)
            return res.json({ added: item });
        }
    }

    else {
        next(new ExpressError("Name or Price not valid", 400))
    }
});

//Edits existing item on Shopping List
router.patch('/:name', function (req, res, next) {
    let oldName = req.params.name;
    let newName = req.body.name;
    let price = req.body.price;
    if (typeof oldName !== 'undefined' & typeof price !== 'undefined') {
        let item = { name: oldName, price: price }
        let index = items.findIndex((element) => element.name === item.name)
        if (index === -1) {
            next(new ExpressError(`${oldName} is not on the list`, 400))
        }
        else {
            items[index] = { name: newName, price: price }
            return res.json({ updated: items[index] });
        }
    }
    else {
        next(new ExpressError("Name or Price not valid", 400))
    }

});


router.get('/:name', function (req, res, next) {
    let name = req.params.name;
    let index = items.findIndex((element) => element.name === name)
    if (index === -1) {
        next(new ExpressError(`${name} is not on the list`, 400))
    }
    else {
        return res.json(items[index]);
    }
});


//Deletes existing item on Shopping List
router.delete('/:name', function (req, res, next) {
    let name = req.body.name;
    let price = req.body.price;
    if (req.params.name === name) {
        if (typeof name !== 'undefined' & typeof price !== 'undefined') {
            let item = { name: name, price: price };
            let index = items.findIndex((element) => element.name === item.name)
            if (index === -1) {
                next(new ExpressError(`${name} is not on the list`, 400))
            }
            else {
                items.splice(index, 1)
                return res.json({ message: "Deleted" });
            }
        }
        else {
            next(new ExpressError("Name or Price not valid", 400))
        }


    }

});

module.exports = router;
