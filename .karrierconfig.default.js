
// For use
// just type `karrier ` or `karrier -n env_test` in your cli

module.exports.env_test = {
  host: '127.0.0.1',
  username: '...',
  password: '...',

  from: 'dist',
  to: '/export/sites/static.360buyimg.com/'
}

module.exports.env_dev = {

  host: '192.168.100.101',
  username: 'static',
  password: 'static',
  from: 'dist',
  to: '/export/sites/static.360buyimg.com/'
}

module.exports.default = module.exports.env_dev;




