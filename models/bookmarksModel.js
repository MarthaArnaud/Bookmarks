const mongoose = require ('mongoose');

const bookmarksSchema = mongoose.Schema({
    id:{
        type: String,
        required: true,
        unique: true
    },
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true

    },
    url:{
        type: String,
        required: true
    },
    rating:{
        type: Number,
        required: true
    }


});

const bookmarksCollection = mongoose.model('bookmarks',bookmarksSchema);

const Bookmarks = {
    //createBookmark is a POST method that creates new object 
    createBookmark : function(newBookmark){
        return bookmarksCollection
                .create(newBookmark)
                .then(createdBookmark =>{
                    return createdBookmark;
                })
                .catch (err=>{
                    return err;
                });
    },
    getAllBookmarks: function(){
        return bookmarksCollection
                .find()
                .then(allBookmarks=>{
                    return allBookmarks;
                })
                .catch ( err=>{ //triggered when database is off or stopped
                return err;
            });
    },
    getBookmarksByTitle: function(bookmarktitle){
        return bookmarksCollection
        .find({title: bookmarktitle})
        .then(bookmarkWithTitle=>{
            return bookmarkWithTitle;
        })
        .catch(err=>{
            return err;
        })
    },
    deleteBookmark: function(id){
        return bookmarksCollection
        .findOneAndRemove({_id:id})
        .then(deletedBookmark=>{
            return deletedBookmark;
        })
        .catch(err=>{
            return err;
        })
    },
    updateBookmark: function(id){
        return bookmarksCollection
        .findOneAndUpdate({_id:id})
        .then(updatedBookmark=>{
            return updatedBookmark;
        })
        .catch(err=>{
            return err;
        })
    }
}

module.exports = {Bookmarks};