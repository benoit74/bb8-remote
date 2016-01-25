var Cylon = require('cylon');
var request = require("request");
var express = require('express');
var fs = require('fs');
var app = express();
var bodyParser = require('body-parser')

var bb8_uuid = 'db82c92b4d824143b1b8223d55a21ad4';

(function (httpserver, bb8server) {
  console.log("start servers");
  bb8server(function (ollie) {
    httpserver(function (msg) {
      executeOrder(ollie, msg.command);
    });
  });

})(httpserver, bb8server);

function httpserver(callback) {
  app.use(express.static('www'));
  app.use(bodyParser.json())

  app.post('/api/send', function (request, response) {
    console.log("/api/send", request.body);
    callback(request.body);
    response.sendStatus(200);
  });

  app.listen(8080);
}


function bb8server(callback) {
  Cylon.robot({
    connections: {
      bluetooth: {
        adaptor: 'central',
        uuid: bb8_uuid,
        module: 'cylon-ble'
      }
    },

    devices: {
      ollie: {
        driver: 'ollie'
      }
    },

    work: function (my) {
      callback(my.ollie);

      my.ollie.start(function () {
        my.ollie.detectCollisions(function () {
          console.log("Aie !!!!");
        })
      });
    }
  }).start();
}

var speed = 0;
var angle = 0;
var lastTwitterId = 0;
var lastWebId = 0;


var setColorFromSpeed = function (ollie, speed) {
  if (speed <= 0) {
    ollie.color(0x00FF00);
  } else if (speed <= 20) {
    ollie.color(0x00FFEE);
  } else if (speed <= 40) {
    ollie.color(0x0077FF);
  } else if (speed <= 60) {
    ollie.color(0x0000FF);
  } else if (speed <= 80) {
    ollie.color(0x9900FF);
  } else if (speed <= 100) {
    ollie.color(0xFF00BB);
  } else {
    ollie.color(0xFF0000);
  }
}

var rollf = function (ollie, angle, speed) {
  console.log("Going " + speed + "mph at " + angle + "degrees");
  ollie.roll(speed, angle);
  setColorFromSpeed(ollie, speed);
}

var hex2rgb = function (hex) {
  // long version
  r = hex.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  if (r) {
    h = r.slice(1, 4).map(function (x) {
      return parseInt(x, 16);
    });
    return h[2] + 256 * h[1] + 65536 * h[0];
  }
  // short version
  r = hex.match(/^#([0-9a-f])([0-9a-f])([0-9a-f])$/i);
  if (r) {
    h = r.slice(1, 4).map(function (x) {
      return 0x11 * parseInt(x, 16);
    });
    return h[2] + 256 * h[1] + 65536 * h[0];
  }
  return null;
}

var executeOrder = function (ollie, order) {
  if (order.charAt(0) == '#') {
    var color = hex2rgb(order.toLowerCase());
    console.log(color);
    ollie.color(color);
    return;
  }
  switch (order) {
  case "left":
    angle -= 30;
    rollf(ollie, angle, speed);
    break;
  case "right":
    angle += 30;
    rollf(ollie, angle, speed);
    break;
  case "west":
    angle = 270;
    rollf(ollie, angle, speed);
    break;
  case "south":
    angle = 180;
    rollf(ollie, angle, speed);
    break;
  case "north":
    angle = 0;
    rollf(ollie, angle, speed);
    break;
  case "east":
    angle = 90;
    rollf(ollie, angle, speed);
    break;
  case "slow":
    if (speed > 0) {
      speed -= 20;
      rollf(ollie, angle, speed);
    }
    break;
  case "fast":
    if (speed < 120) {
      speed += 20;
      rollf(ollie, angle, speed);
    }
    break;
  case "stop":
    speed = 0;
    rollf(ollie, angle, speed);
    break;
  case "blue":
    ollie.color(0x0000FF);
    break;
  case "green":
    ollie.color(0x00FF00);
    break;
  case "red":
    ollie.color(0xFF0000);
    break;
  case "pink":
  case "purple":
    ollie.color(0xFF00FF);
    break;
  case "yellow":
    ollie.color(0xFFFF00);
    break;
  case "cyan":
    ollie.color(0x00FFFF);
    break;
  default:
    console.log("Unknown command: '" + order + "'");
  }
}
