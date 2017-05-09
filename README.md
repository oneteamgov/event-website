# OneTeamGov website source code

This is the source code for the website of the OneTeamGov unconference. In the spirit of 'make things open, it makes them better'.

## Installation and usage

To get this running locally, you will need NodeJS and working knowledge of unix command line.

Clone this repository and run:

`npm install && npm start`

## Overview

All pages/templates live within `src/templates/views/` directory. Templates are written in [Mozzila Nunjucks](http://mozilla.github.io/nunjucks/getting-started.html).

CSS is written from precompiled Sass and which lives within `src/assets/scss/`

Javascript lives in `assets/js/` and uses Babelify + Browserify to bundle into app.js

Explore the `./gulpfile.js` for the inner workings.
