import express from 'express';
import bodyParser from 'body-parser';
import { MongoClient } from 'mongodb';
import path from 'path';
// const articleInfo = {
//     'learn-react': {
//         upvotes: 0,
//         comments: [],
//     },
//     'learn-node': {
//         upvotes: 0,
//         comments: [],
//     },
//     'thoughts-on-resume': {
//         upvotes: 0,
//         comments: [],
//     }
// }



const app = express();

app.use(express.static(path.join(__dirname, './build')));

app.use(bodyParser.json());

const withDB = async (operations, res) => {
    try{
        // const articleName = req.params.name;
        const client = await MongoClient.connect("mongodb://localhost:27017", { useNewUrlParser: true, useUnifiedTopology: true });
        const db = client.db('my-blog');

        await operations(db);
        client.close();
        // const articleInfo = await db.collection('articles').findOne({ name: articleName})
        // res.status(200).json(articleInfo);
    }catch(error){
        res.status(500).json({ message: "Error connecting DB", error});
    }
}

app.get('/api/articles/:name', async (req, res) => {
    withDB( async (db) => {
        const articleName = req.params.name;
        const articleInfo = await db.collection('articles').findOne({ name: articleName });
        res.status(200).json(articleInfo);
    }, res);
})

app.post('/api/articles/:name/upvote', async (req, res) => {
    withDB(async (db) => {
        const articleName = req.params.name;
        const articleInfo = await db.collection('articles').findOne({ name: articleName });
        await db.collection('articles').updateOne({ name: articleName },
            { 
                '$set': {
                    upvotes: articleInfo.upvotes + 1,
                }
            });
        const updatedArticleInfo = await db.collection('articles').findOne({ name: articleName });
        res.status(200).json(updatedArticleInfo);
    }, res);
    
    // try{

        // const client = await MongoClient.connect("mongodb://localhost:27017", { useNewUrlParser: true});
        // const db = client.db('my-blog');
        
        
        

    // }catch(error){
    //     res.status(500).json({ message: "Error connecting DB", error: error});
    // }
    // client.close();
    
    // articleInfo[articleName].upvotes += 1;
    // res.status(200).send(`${articleInfo[articleName].upvotes} upvotes`);
})

app.post('/api/articles/:name/add-comment', (req, res) => {
    const { username, text } = req.body;
    const articleName = req.params.name;
    withDB(async (db) => {
        const articleInfo = await db.collection('articles').findOne({ name: articleName});
        await db.collection('articles').updateOne({ name: articleName}, 
            {
                '$set': {
                    comments: articleInfo.comments.concat( {username, text})
                },
            });
        const updatedArticleInfo = await db.collection('articles').findOne({ name: articleName })        
        res.status(200).json(updatedArticleInfo);
    }, res);
    // articleInfo[articleName].comments.push({ username, text});
    // console.log(username)
    // res.status(200).send(articleInfo[articleName].comments);
})



// app.get('/hello', (req, res) => res.send('Hello!'));
// app.post('/hello', (req, res) => res.send(`Hello ${req.body.name}!`));
// app.post('/hello:name', (req, res) => res.send(`Hello ${req.body.name}!`))

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 
        '/build/index.html'))
});
app.listen(8000, () => console.log('Server is listening on port 8000'));
