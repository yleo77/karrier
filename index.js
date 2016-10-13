var path = require('path');
var fs = require('fs');
var tar = require('tar-fs');
var Client = require('ssh2').Client;

var DEFAULT_CONFIG = {
  host: '', // Remote server
  port: 22, // SSH Port
  username: '', // 
  password: '', //

  from: '', // Location of the local directory
  to: '', // Remote directory
}

module.exports = function(config) {

  var options = Object.assign({}, DEFAULT_CONFIG, config);
  options.from = path.resolve(options.from);
  var conn = new Client();

  conn.on('ready', function() {

    console.log('Remote Path: [ ' + options.to + ' ]');
    console.log('Connection has been established.');

    var promise = new Promise(function(resolve, reject) {

      conn.exec('mkdir -p ' + options.to, function(err, stream) {
        if (err) {
          throw err;
        }
        resolve();
      });
    });

    promise.then(function() {

      conn.sftp(function(err, sftp) {

        if (err) throw err;

        var destname = 'build.tar';
        var targetFile = options.to + '/' + destname;

        var stat = fs.statSync(options.from);
        var src_dirname = options.from;

        var files = [];
        if (stat.isFile()) {
          src_dirname = path.dirname(options.from);
          files.push(path.basename(options.from));
        }

        var writeStream = sftp.createWriteStream(targetFile);

        var opt = {
          dmode: 0755,
          fmode: 0644,
          ignore: function(name, header) {
            if (/\.(vm)$/.test(name)) {
              return true;
            }
            return false;
          },
        };

        if (files.length) {
          opt.entries = files;
        }

        tar.pack(src_dirname, opt).pipe(writeStream);

        writeStream.on('close', function() {
          console.log("Upload file Success.");
          var command = 'tar -xvmf ' + targetFile + ' -C ' + options.to;
          conn.exec(command, function(err, stream) {
            if (err) {
              throw err;
            }
            var list = [];
            stream.on('close', function(code, signal) {
              // console.log('Stream closed with code: ' + code + ', signal: ' + signal);
              conn.end();

              console.log('Uncompress success. Files list: \n');
              list = list.join('').split('\n');

              if (list[0] === '.') {
                list.shift();
              }

              list[0] = '    ' + list[0];
              list = list.join('\n    ');

              console.log(list);
              console.log('All Done, Everything is OK, But u need check it again!');
              process.exit(0);
            }).on('data', function(data) {

              list.push(data.toString('utf8'));
            }).stderr.on('data', function(data) {
              console.log('STDERR: ' + data);
              process.exit(1);
            });

            // sftp.end();
            // conn.end();          
          });
        });
      });
    }, function() {
      throw err;
    });

  }).connect(options);
}
