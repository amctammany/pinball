Introduction
======

Do you want to be a web game developer?
The web has become the dominant platform for the majority of our computing needs.
Whether you've used another engine before or have never even thought of game development, this series will (hopefully) be provide useful insight into the **how** and **why** of web game development.



Technologies
====

For our game, we will be be sticking to the bare essentials of web development: HTML, CSS and vanilla JavaScript.
By 'vanilla', I mean using the latest features of ES6 provided by transpiling our code with Babel, come on, we're not heathens.
The backend will be provided by [Webpack](http://webpack.js.org), a JavaScript module bundler that has been continuously gaining popularity.
Webpack includes a development server, enabling us to quickly spin up a working site using all the latest innovations in ES6.

If that does not make sense, do not worry, we will have a fully functioning setup by the end of this article.
In keeping with a bottom-up design, we will not be including any other dependencies.
This, however, is subject to change as the tutorial series continues.
While I believe the information presented is required to build your own simple game engine, 'reinventing the wheel' is a dangerous practice.
This is not meant to be production ready code, just educational examples for the aspiring game developer, and as such mistakes and/or bad practices are probable.
Send me an email or use the issue tracking provided by GitHub.

Project Initialization
-----

Let's start programming!  We start by creating a new folder and using `yarn` to initialize the project.

```bash
mkdir pinball && cd $_
yarn init
```
After answering a few questions about our project, we are ready to setup Webpack and Babel.
Let's add in our build dependencies from the terminal.
While we are at it, we should also create the configuration files needed and set up our `src` directory with a minimal HTML page.

```bash
yarn add -D @babel/cli @babel/core @babel/preset-env babel-loader \
  clean-webpack-plugin html-webpack-plugin webpack webpack-cli webpack-dev-server
touch webpack.config.js .babelrc
mkdir src
touch src/index.js src/template.html
```

```html
<html>
  <head>
    <title>Pinball</title>
  </head>

  <body>
    <h1>Pinball Game</h1>
  </body>

</html>
```

Linting and Stuff
=====

Code styles and formatting have no effect on the compiler, it really does make a world of difference while working.
I prefer to include ESLint and Prettier at the beginning whenever I start a new project.
Although it adds an extra level of complexity and delays us from actually coding, it is a useful habit to get into and will save you from moments like this "img of 20000 eslint errors" when you decide to add it to your project.
Let's add that now:

```bash
yarn add -D eslint eslint-config-airbnb-base eslint-config-prettier \
eslint-plugin-import eslint-plugin-prettier prettier
```

Now we can add some scripts into our `package.json` that will take care of linting for us.

```json
  "scripts": {
    "lint": "eslint ./src --fix; yarn pretty",
    "pretty": "prettier --write './src/**/*.js'"
  },
```
If we try it by running `yarn lint` ESLint will pop up complaining that no configuration file exists in the project directory.
Follow the prompts to set it up to your liking, I prefer to use the AirBnB style guide.
If we run `yarn lint` again, it should successfully run and give an output similar to this

```bash
[alex@amctammany-arch pinball]$ yarn lint
yarn run v1.15.2
$ eslint ./src --fix; yarn pretty
$ prettier --write './src/**/*.js'
src/index.js 4ms
Done in 0.82s.
```

*Awesome!*  Now our empty `index.js` file is properly styled!  We did it guys, I'm proud of us.


Webpack
------

Webpack is a build tool that transforms and bundles our source code.
The configuration I have here is very similar to the one found in the [Getting Started](https://webpack.js.org/guides/getting-started/) section of their site.
Upon execution, Webpack starts by processing our defined `entry` file.
After traversing and translating all its dependencies, it then combines them into a single file ready to be served.
[HtmlWebpackPlugin](https://github.com/jantimon/html-webpack-plugin) is responsible for then taking this bundle and injecting it into our supplied template.
While all of this behavior is completely customizable, it is out of the scope of this guide.  I highly suggest you head over to their site for a deeper understanding.

```js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");

module.exports = {
  mode: "development",
  entry: {
    app: "./src/index.js"
  },


  devServer: {
    contentBase: "./dist"
  },
  plugins: [
    new CleanWebpackPlugin()
    new HtmlWebpackPlugin({
      title: "Development",
      template: "src/template.html"
    })
  ],
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(process.cwd(), "dist")
  },
  module: {
    rules: [
      {
        use: "babel-loader",
        test: /\.js$/,
        exclude: /node_modules/
      }
    ]
  }
};
```
We need to add two more scripts to our `package.json` so that we can use and compile our code.

```json
"scripts": {
...
    "start": "webpack-dev-server",
    "build": "webpack",
...
},
```

If this still makes little sense, let's see what happens when we run it.

```bash
[alex@amctammany-arch pinball]$ yarn build
yarn run v1.15.2
$ webpack
Hash: 943ede09680a34319a56
Version: webpack 4.30.0
Time: 613ms
Built at: 04/12/2019 6:20:33 PM
        Asset       Size  Chunks             Chunk Names
app.bundle.js   3.77 KiB     app  [emitted]  app
   index.html  216 bytes          [emitted]  
Entrypoint app = app.bundle.js
[./src/index.js] 0 bytes {app} [built]
Child html-webpack-plugin for "index.html":
     1 asset
    Entrypoint undefined = index.html
    [./node_modules/html-webpack-plugin/lib/loader.js!./src/template.html] 361 bytes {0} [built]
    [./node_modules/webpack/buildin/global.js] (webpack)/buildin/global.js 472 bytes {0} [built]
    [./node_modules/webpack/buildin/module.js] (webpack)/buildin/module.js 497 bytes {0} [built]
        + 1 hidden module
Done in 1.24s.
```

It works! (Kinda...)  It may not have done anything useful but there were no errors.
Examining `dist/` shows the results:

* `app.bundle.js` -  Our transpiled JavaScript application.  
* `index.html` - Almost the same as `src/template.html` with one key difference: the bundle created above was inserted at the end of the HTML body allowing us to serve our app.

If we open `index.html` in a browser we can see our beautiful web page.
No? Not beautiful? But it's at least functional right?
We spent so much time getting Babel and Webpack to work now let's see the fruits of our labor.

Wrapping Up
------

Time to add something to `src/index.js` so you don't have to take my word that our project successfully compiles the latest and greatest ES6 into JavaScript that every browser understands.
This contrived example uses several of the new features in ES6 such as classes, object destructuring, template literals, and arrow functions.
If we open our site up again, we will be greeted by the same view.
Except this time, we have a timeout that appends a new information after a second.
Talk about interactivity!

```js
class Person {
  constructor({ name, age }) {
    this.name = name;
    this.age = age;
  }

  getData() {
    return `${this.name} & ${this.age}`;
  }
}

const personData = { name: "Alex", age: "30ish" };
window.onload = () => {
  const p = new Person(personData);
  const node = document.createElement("b");
  node.innerHTML = p.getData();

  window.setTimeout(() => document.body.appendChild(node), 1000);
};

export default Person;
```


Conclusion
=====

*Congratulations, you're now a professional game developer!*  
...
Not feeling accomplished yet?  You're not the only one.
This was not the most exciting start but we finally have all the tools we need to actually program our game.
With this foundation, all we have to do is run `yarn start` and everything else is taken care of.
Webpack-Dev-Server will handle all changes to our source code and automatically update our application.

This barebones structure is actually what I use as a starting point for most of my JavaScript programming.
It's no [create-react-app](https://github.com/facebook/create-react-app) but it works for most small, framework-free projects.
You can find the source for the code [here](https://github.com/amctammany/pinball). Tag stage-0.
Hope to see y'all soon when we start to actually make a game!

Cheers

