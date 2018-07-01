
This is a Fork of the meteor/todos example app.

We focus on making [unique branches](https://github.com/onezoomin/todos/branches) for specific [`react`](https://github.com/meteor/todos/tree/react) based ui frameworks:
- [ ] [Ant-Design](https://ant.design)
- [ ] [Semantic-UI](https://react.semantic-ui.com/)

[![Circle CI](https://circleci.com/gh/meteor/todos.svg?style=svg)](https://circleci.com/gh/meteor/todos)

## Versions

This version (the `master`) branch uses the [Blaze](http://guide.meteor.com/blaze.html) rendering library, with code written in ES2015 JavaScript.

The [`react`](https://github.com/meteor/todos/tree/react) branch implements the same application using [React](http://guide.meteor.com/react.html)

The [`coffeescript`](https://github.com/meteor/todos/tree/coffeescript) branch implements this (the Blaze) version of the app in CoffeeScript.

Note that attempts will be made to keep the branches up to date but this isn't guaranteed.

### Running the app

```bash
meteor yarn install (or meteor npm install)
meteor yarn update (or meteor nom update)
meteor update
meteor
```

### Scripts

To lint:

```bash
meteor npm run lint
```

