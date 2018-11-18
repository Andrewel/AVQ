// dependencies
'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const http = require('https');
var unirest = require("unirest");
let errorResposne = {
    results: []
};
var port = process.env.PORT || 8080;
// create serve and configure it.
const server = express();
server.use(bodyParser.json());
server.post('/getQuotes',function (request,response)  {
    if(request.body.result.parameters['q']) {
        var req = unirest("GET", "https://favqs.com/api/qotd");
           /* req.query({
                "page": "2",
                "language": "ru-RU",
                "api_key": "0963ed7e81fa83d7e4518b7018ef0a02"
                //https://api.themoviedb.org/3/movie/550?api_key=0963ed7e81fa83d7e4518b7018ef0a02
            });
            req.send("{}");*/
            req.end(function(res) {
                if(res.error) {
                    response.setHeader('Content-Type', 'application/json');
                    response.send(JSON.stringify({
                        "speech" : "Error. Can you try it again ? ",
                        "displayText" : "Error. Can you try it again ? "
                    }));
                } else if(res.body.length >= 0) {
                    let result = res.body.quote.body;
                    let output = '';
                    for(let i = 0; i<result.length;i++) {
                        output += i + ")" + result[i].title + ";";
                        output+="\n"
                    }
                    response.setHeader('Content-Type', 'application/json');
                    response.send(JSON.stringify({
                        "speech" : output,
                        "displayText" : output
                    }));
                }
                    response.setHeader('Content-Type', 'application/json');
                    response.send(JSON.stringify({
                        "speech" : res.body.quote.body + "\n--" + res.body.quote.author,
                        "displayText" : res.body.quote.body + "\n--" + res.body.quote.author
                    }));

            });
    } else if(request.body.result.parameters['movie-name']) {
     //   console.log('popular-movies param found');
        let movie = request.body.result.parameters['movie-name'];
        var req = unirest("GET", "https://api.themoviedb.org/3/search/movie");
            req.query({
                "include_adult": "false",
                "page": "1",
                "query":movie,
                "language": "en-US",
                "api_key": "0963ed7e81fa83d7e4518b7018ef0a02"
            });
            req.send("{}");
            req.end(function(res) {
                if(res.error) {
                    response.setHeader('Content-Type', 'application/json');
                    response.send(JSON.stringify({
                        "speech" : "Error. Can you try it again ? ",
                        "displayText" : "Error. Can you try it again ? "
                    }));
                } else if(res.body.results.length > 0) {
                let result = res.body.results[0];
                let output = "Average Rating : " + result.vote_average +
                "\n Plot : " + result.overview + "url" + result.poster_path
                    response.setHeader('Content-Type', 'application/json');
                    response.send(JSON.stringify({
                        "speech" : output,
                        "displayText" : output
                    }));
                } else {
                    response.setHeader('Content-Type', 'application/json');
                    response.send(JSON.stringify({
                        "speech" : "Couldn't find any deatails. :(  ",
                        "displayText" : "Couldn't find any deatails. :(  "
                    }));
                }
            });

    } else if(request.body.result.parameters['popular-movies']) {
        var req = unirest("GET", "https://api.themoviedb.org/3/movie/popular");
            req.query({
                "page": "1",
                "language": "en-US",
                "api_key": "0963ed7e81fa83d7e4518b7018ef0a02"
            });
            req.send("{}");
            req.end(function(res){
                if(res.error) {
                    response.setHeader('Content-Type', 'application/json');
                    response.send(JSON.stringify({
                        "speech" : "Error. Can you try it again ? ",
                        "displayText" : "Error. Can you try it again ? "
                    }));
                } else {
                    let result = res.body.results;
                    let output = '';
                    for(let i = 0; i < result.length;i++) {
                        output += result[i].title;
                        output+="\n"
                    }
                    response.setHeader('Content-Type', 'application/json');
                    response.send(JSON.stringify({
                        "speech" : output,
                        "displayText" : output
                    }));
                }
            });
    }else if(request.body.result.parameters['av']) {
        var req = unirest("GET", "https://favqs.com/api/quotes/?filter=andrewel&type=user");
        response.headers({
            'Authorization': "Token token=ab40a3786cae9e7a777a856f0225a564"
        })
        //req.send("{}");
        req.end(function(res){
            if(res.error) {
                response.setHeader('Content-Type', 'application/json');
                response.send(JSON.stringify({
                    "speech" : "Error. Can you try it again ? ",
                    "displayText" : "Error. Can you try it again ? "
                }));
            } else {
               /* let result = res.body.results;
                let output = '';
                for(let i = 0; i < result.length;i++) {
                    output += result[i].title;
                    output+="\n"
                }*/
                response.setHeader('Content-Type', 'application/json');
                response.send(JSON.stringify({
                    "speech" : res.body,
                    "displayText" : res.body
                }));
            }
        });
    }
});
server.get('/getName',function (req,res){
    res.send('Swarup Bam');
});
server.listen(port, function () {
    console.log("Server is up and running...");
});

