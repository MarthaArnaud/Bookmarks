const express = require('express');
const bodyParser = require ('body-parser');
const morgan = require('morgan');

const uuidv4  = require('uuid/v4');
const TOKEN = '2abbf7c3-245b-404f-9473-ade729ed4653';
const jsonParser = bodyParser.json();

const app = express();
app.use(morgan('dev'));
app.use(validateToken);

/*
const Post = {
    id: uuidv4(),
    title: string,
    description: string,
    url: string,
    rating:number
}
*/

let bookmarks =[
    {
        id: 25,
        title: "The little prince",
        description: "Short novel",
        url:"https://www.sparknotes.com/lit/littleprince/summary/",
        rating: 10,
    },
    {
        id: 22,
        title: "The Shack",
        description: "thriller",
        url:"https://www.sparknotes.com/lit/theshack/summary/",
        rating: 10,
    }
]

function validateToken(req, res, next){
    let token = req.headers.authorization;

    if(!token){
        res.statusMessage= "You need to send me authorization";
        return res.status(401).end();
    }
    if(token !==`Bearer ${TOKEN}`){
        res.statusMessage="The authorization token is invalid";
        return res.status(401).end();

    }
    next();

}


app.get('/bookmarks',(req, res)=>{
    console.log("Getting all list of bookmarks");
    return res.status(200).json(bookmarks);
});

app.get('/bookmark', (req, res)=>{
    console.log("Getting one book given the title parameter");
    console.log(req.query);
    let title =req.query.title;
   

    if(!title){
        res.statusMessage="The title parameter is required ";
        return res.status(406).end();
    }
    let result = bookmarks.find((book)=>{
        if (book.title == title){
            return book;
        }
    });
    if(!result){
        res.statusMessage=`The book with title=${title} was not found in the list`;
        return res.status(404).end();
    }


    return res.status(200).json(result);
})

app.post('/bookmarks',jsonParser, (req,res)=>{
    console.log("entro al post");
    console.log("body",req.body);
    let id = req.body.id;
    let title = req.body.title;
    let description = req.body.description;
    let url = req.body.url;
    let rating = req.body.rating;

 
    if(!title ||!description || !url || !rating ){
        res.statusMessage= "One of the parameters is missing in the request";
        return res.status(406).end();
    }
    
    

    else{
        let newBookmark = {
            id: uuidv4(),
            title : title,
            description : description,
            url : url,
            rating: rating
            
        };
        bookmarks.push(newBookmark);
        return res.status(201).json(newBookmark);
    }
   

    
})




app.delete('/bookmark/:id',(req,res)=>{
    let id = req.params.id;
    if(!id){
        res.statusMessage="The id parameter is required ";
        return res.status(406).end();
    }
    let bookToRemove = bookmarks.findIndex((book)=>{
        if (book.id === Number (id)){
            return true;
        }
    })
    console.log(bookToRemove);
    if(bookToRemove<0){
        res.statusMessage="That book was not found on the list";
        return res.status(404).end();
    }
    else{
        bookmarks.splice(bookToRemove,1);
        return res.status(200).json({});
    }

});

app.patch('/bookmark/:id',jsonParser,(req, res)=>{
    let id = req.params.id;
    console.log("entro al patch");
    console.log(req.params.id);
    console.log(req.body.id);
    if(!id){
        res.statusMessage="The id parameter is required ";
        return res.status(406).end();
    }
    if(req.body.id!=req.params.id){
        res.statusMessage="The id in the parameter and the id in the body don't match";
        return res.status(409).end();
    }
    else{
        /*let modifyBook = {
            id: req.query.id,
            title: req.body.title,
            description: req.body.description,
            url: req.body.url,
            rating: req.body.rating
        }
        */

        let bookToUpdate = bookmarks.findIndex((book)=>{
            if (book.id === Number (id)){
                return true;
            }
        })
        console.log(bookToUpdate);
        if(bookToUpdate<0){
            res.statusMessage="That book was not found on the list";
            return res.status(404).end();
        }
        else{
            console.log("entro al else");
            if(!req.body.title){
                console.log("valido titulo");
                console.log(req.body.title);
                bookmarks[bookToUpdate].title= bookmarks[bookToUpdate].title;
                
            }
            else{
                bookmarks[bookToUpdate].title= req.body.title;
            }
             if(!req.body.description){
                console.log(req.body.description);
                bookmarks[bookToUpdate].description = bookmarks[bookToUpdate].description;
                
            }
            else{
                bookmarks[bookToUpdate].description = req.body.description;
            }
            if(!req.body.url){
                console.log(req.body.url);
                bookmarks[bookToUpdate].url =bookmarks[bookToUpdate].url;
                
            }
            else{
                bookmarks[bookToUpdate].url = req.body.url;
            }
            if(!req.body.rating){
                console.log(req.body.rating);
                bookmarks[bookToUpdate].rating= bookmarks[bookToUpdate].rating;
                
            }
            else{
                bookmarks[bookToUpdate].rating = req.body.rating;
            }
            res.statusMessage="Correct update";
            return res.status(202).json(bookmarks[bookToUpdate]);
        }
        
        
    }
    
})

app.listen(1000 ,()=>{
  console.log("This server is running on port 1000");  
})


//Base url = http://localhost:1000
// GET all bookmarks = http://localhost:1000/bookmarks
//GET by title = http://localhost:1000/bookmark
//POST new bookmark = http://localhost:1000/bookmarks
//DELETE by id http://localhost:1000/bookmark/:id
//PATCH send id http://localhost:1000/bookmark/:id