## karrier

Just another simple file uploader.

A dependence package in our team work.

## Usage

### Configuration

Before you use it with cli or api, you should put a file named [`.karrierconfig.js`](https://github.com/yleo77/karrier/blob/master/.karrierconfig.default.js) in your project's root directory, like *babel* and others common tools. The content of the file like this:

```javascript
module.exports.env_test = {
  host: '127.0.0.1',
  username: '...',
  password: '...',

  from: 'dist',
  to: '/the/server/path/'
}
```

### With Command Line

```bash
karrier -n env_test
```

In most case, it shoud be in the `package.json`, like `npm start`, you can call it with `npm upload`.

### API

```javascript
var karrier = require("karrier");
var config = {
  host: '127.0.0.1',
  username: '...',
  password: '...',

  from: 'dist',
  to: '/the/server/directory/../'
};
karrier(config);
```

## License

The MIT License (MIT)
