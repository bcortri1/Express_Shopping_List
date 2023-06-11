process.env.NODE_ENV = "test";
const request = require("supertest");
const app = require("./app.js");

let items = require("./fakeDb.js");
const popsicle = {"name":"popsicle", "price": "1.45"}
const cheerios = {"name":"cheerios", "price": "3.40"}
const emptyName = {"price": "4.40"}
const emptyPrice = {"name":"ice cream"}


beforeEach(function () {
    items.push(popsicle);
    items.push(cheerios);
});


afterEach(function () {
    items.length = 0;
});


describe("GET /items",function(){
    test("Gets shopping list", async function(){
        const resp = await request(app).get(`/items`);
        expect(resp.statusCode).toBe(200)
        expect(resp.body).toEqual([{...popsicle}, {...cheerios}]);
    })

});


describe("POST /items",function(){

    test("Add to the shopping list", async function(){
        items.length = 0;
        let resp = await request(app)
        .post(`/items`)
        .send(popsicle);

        expect(resp.statusCode).toBe(200)
        expect(resp.body).toEqual({added:popsicle});

        resp = await request(app)
        .post(`/items`)
        .send(cheerios);

        expect(resp.statusCode).toBe(200)
        expect(resp.body).toEqual({added:cheerios});
    })

    test("Duplicate adds are ignored", async function(){
        items.length = 0;
        let resp = await request(app)
        .post(`/items`)
        .send(popsicle);

        expect(resp.statusCode).toBe(200)
        expect(resp.body).toEqual({added:popsicle});

        resp = await request(app)
        .post(`/items`)
        .send(popsicle);

        expect(resp.statusCode).toBe(400)
        expect(resp.body).toEqual({error:{
            "message": "Item already on list",
            "status": 400
        }});

    })

});


describe("GET /items/:name",function(){
    test("Get a specific item from the shopping list", async function(){
        let resp = await request(app).get(`/items/popsicle`);
        expect(resp.statusCode).toBe(200)
        expect(resp.body).toEqual(popsicle);

        resp = await request(app).get(`/items/cheerios`);
        expect(resp.statusCode).toBe(200)
        expect(resp.body).toEqual(cheerios);
    })

    test("Get item that doesnt exist", async function(){
        items.length = 0;
        let resp = await request(app).get(`/items/popsicle`);
        expect(resp.statusCode).toBe(400)
        expect(resp.body).toEqual({error:{
            "message": "popsicle is not on the list",
            "status": 400
        }});

        resp = await request(app).get(`/items/cheerios`);
        expect(resp.statusCode).toBe(400)
        expect(resp.body).toEqual({error:{
            "message": "cheerios is not on the list",
            "status": 400
        }});
    })

});


describe("PATCH /items/:name",function(){
    test("Change an item from the shopping list", async function(){
        let change = {...cheerios}
        change.price = 100
        const resp = await request(app).patch(`/items/cheerios`).send(change);
        expect(resp.statusCode).toBe(200)
        expect(resp.body).toEqual({updated:change});
    })

    test("Change an item that doesnt exist", async function(){
        items.length = 0;
        let resp = await request(app).patch(`/items/popsicle`).send(popsicle);
        expect(resp.statusCode).toBe(400)
        expect(resp.body).toEqual({error:{
            "message": "popsicle is not on the list",
            "status": 400
        }});

        resp = await request(app).patch(`/items/cheerios`).send(cheerios);
        expect(resp.statusCode).toBe(400)
        expect(resp.body).toEqual({error:{
            "message": "cheerios is not on the list",
            "status": 400
        }});
    })

});


describe("DELETE /items/:name",function(){
    test("Remove an item from the shopping list", async function(){
        const resp = await request(app).delete(`/items/cheerios`).send(cheerios);
        expect(resp.statusCode).toBe(200)
        expect(resp.body).toEqual({ message: "Deleted" });
        expect(items).toEqual([popsicle])
    })

});