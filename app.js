
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var location = require('./routes/location');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');

var app = express();


// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.bodyParser());
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/uber', routes.index);
app.get('/locations', location.list);
app.post('/location', location.create);
app.get('/location/:id', location.get);
app.delete('/location/:id', location.delete);
app.put('/location/:id', location.update);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
