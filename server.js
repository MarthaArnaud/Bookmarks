const express = require('express');
const bodyParser = require ('body-parser');
const morgan = require('morgan');
const uuidv4  = require('uuid/v4');
const {Bookmarks} = require ('./models/bookmarksModel');
const mongoose = require ('mongoose');
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
    Bookmarks
        .getAllBookmarks()
        .then(allBookmarks=>{
            return res.status(200).json(allBookmarks);
        })
        .catch(err=>{
            res.statusMessage="Something went wrong with the databse";
            return res.status(500).end();
        })
    
   
});

app.get('/bookmark', (req, res)=>{
    console.log("Getting one book given the title parameter");
    console.log(req.query);
    let title =req.query.title;
   

    if(!title){
        res.statusMessage="The title parameter is required ";
        return res.status(406).end();
    }
    Bookmarks
    .getBookmarksByTitle(title)
    .then(bookmarkWithTitle=>{
        return res.status(200).json(bookmarkWithTitle);
    })
    .catch(err=>{
        res.statusMessage="Something went wrong with the databse";
        return res.status(500).end();
    })
    /*Enviar error cuando no existe
    let result = Bookmarks.find({title: title})
        console.log(title);
        if (title == title){
            return true;
        }
    
    if(!result){
        res.statusMessage=`The book with title =${title} was not found in the list`;
        return res.status(404).end();
    }
    */
    
    
});

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
    
    let newBookmark = {id,title,description,url,rating};
        Bookmarks
            .createBookmark(newBookmark)
            .then(createdBookmark=>{
                if(createdBookmark.errmsg){
                    res.statusMessage="The id belongs to another Bookmark" + errmsg;
                    return res.status(409).end();
                }
                return res.status(201).json(createdBookmark);
            })
            .catch(err=>{
                res.statusMessage= "Something is wrong with the database";
                return res.status(500).end();
            });
    /*
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
   
*/
    
});




app.delete('/bookmark/:id',(req,res)=>{
    let id = req.params.id;
    if(!id){
        res.statusMessage="The id parameter is required ";
        return res.status(406).end();
    }
    /*Handle errors
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
    }*/
    Bookmarks
    .deleteBookmark(id)
    .then(deletedBookmark=>{
        return res.status(200).json(deletedBookmark);
    })
    .catch(err=>{
        res.statusMessage="Something went wrong with the databse";
        return res.status(500).end();
    })

});

app.patch('/bookmark/:id',jsonParser,(req, res)=>{
    let id = req.params.id;
    //console.log("entro al patch");
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
       
       //console.log("antes de bookmarks");
       
       Bookmarks
       .updateBookmark(id)
       
       .then(updatedBookmark=>{
           console.log(updatedBookmark);
           if(!req.body.title){
            updatedBookmark.title = updatedBookmark.title;
            console.log(updatedBookmark.title);
           }
           else{
               updatedBookmark.title = req.body.title;
               updatedBookmark.save()
               console.log(updatedBookmark.title);
           }
           if(!req.body.description){
            updatedBookmark.description = updatedBookmark.description;
           }
           else{
               updatedBookmark.description = req.body.description;
               updatedBookmark.save()
           }
           if(!req.body.url){
            updatedBookmark.url = updatedBookmark.url;
           }
           else{
               updatedBookmark.url = req.body.url;
               updatedBookmark.save()
           }
           if(!req.body.rating){
            updatedBookmark.rating = updatedBookmark.rating;
           }
           else{
               updatedBookmark.rating = req.body.rating;
               updatedBookmark.save()
           }
           
        
        })
        .then(updatedBookmark=>{
            res.send(updatedBookmark);
        })
        
        .catch(err=>{
         res.statusMessage="Something went wrong with the databse";
         return res.status(500).end();
       })
        
    }
    
});

app.listen(1000 ,()=>{
  console.log("This server is running on port 1000"); 
  new Promise ((resolve, reject)=>{
    const settings = {
        useNewUrlParser: true, 
        useUnifiedTopology: true,
        useCreateIndex: true
    };
    mongoose.connect('mongodb://localhost/bookmarksdb', settings, err=>{
        if(err){
            return reject(err);
        }
        else{
            console.log("Database connected succesfully ");
            return resolve();
        }
    })

})
.catch (err=>{
    console.log(err);

})

});


//Base url = http://localhost:1000
// GET all bookmarks = http://localhost:1000/bookmarks
//GET by title = http://localhost:1000/bookmark
//POST new bookmark = http://localhost:1000/bookmarks
//DELETE by id http://localhost:1000/bookmark/:id
//PATCH send id http://localhost:1000/bookmark/:id