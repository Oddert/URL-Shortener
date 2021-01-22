# URL-Shortener
A small URL shortener created for the Free Code Camp backend challenge


## Live Demo
[https://exclusive-sable-shell.glitch.me/](https://exclusive-sable-shell.glitch.me/)

## Installation
```
$ git clone https://github.com/Oddert/URL-Shortener.git
$ cd URL-Shortener
$ npm i
$ npm start
```

## Scripts
| script | command                                        | action
|--------|------------------------------------------------|------------------------------------------------|
| start  | node app.js                                    | runs the server                                |
| dev | nodemon app.js                                 | runs the server with auto restart              |

# Routes
| Route  | Mathod | Params  | Returns
|--------|-------------------|----|----|
| /        | GET |  | A basic html page to interact with the API |
| /:number | GET | number: {Number} - The number to query | A redirect to the url associated with that number in the database |
| /new/*   | GET | *: {String} - A URL endpoint to shorten | A Number representing this url in the database |



<!-- _Please Note_

This app was developed on an older version of MongoDB which can be used by running `oldApp.js`

The version for MongoDB 3.0.7 is `app.js` and is set to auto-run on glitch.com -->