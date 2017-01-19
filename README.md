# es6console
Play around  with ECMAScript (6 to 5) transformers, with an interactive console.

https://es6console.com

### Building

Build this project running Gulp (which runs Webpack behind the scenes)

```
npm install
gulp build
```

### Development

There is a convenient gulp command for starting the backend and building the frontend.
This also reloads any backend/frontend code if it is changed.

```
gulp serve
```

### Runtime / Framework(s):

- Babel
- Gulp
- Express
- Postgresql

### File structure:

```
.
├── models        # Database interface
├── static
│   ├── dist
│   ├── examples
│   ├── img
│   ├── js        # Frontend javascript src
│   ├── sass      # Sass styles
│   └── style
└── views
└── api.js        # API for retreiving stored snippets
└── app.js        # General express app for serving the webpage
```
