var Cylon = require('cylon');

var request = require("request");

Cylon.robot({
  connections: {
    bluetooth: { adaptor: 'central', uuid: '0eb4ef8bd9da405aaa8fe40e5b16eb79', module: 'cylon-ble'}
  },
            
  devices: {
    ollie: { driver: 'ollie'}
  },
            
  work: function(my) {
    console.log(my.ollie);
    var speed = 0;
    var angle = 0;
    var lastTwitterId =0;
    var lastWebId =0;
    
    
    var rollf = function(angle, speed) {
      console.log("Going " + speed + "mph at " + angle + "degrees");
      my.ollie.roll(speed,angle);
    }
    
    var hex2rgb = function(hex) {
        // long version
        r = hex.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
        if (r) {
                h =  r.slice(1,4).map(function(x) { return parseInt(x, 16); });
                return h[2] + 256 * h[1] + 65536 * h[0];
        }
        // short version
        r = hex.match(/^#([0-9a-f])([0-9a-f])([0-9a-f])$/i);
        if (r) {
                h = r.slice(1,4).map(function(x) { return 0x11 * parseInt(x, 16); });
                return h[2] + 256 * h[1] + 65536 * h[0];
        }
        return null;
    }
    
    var executeOrder=function(order) {
      if (order.charAt(0)=='#') {
        var color = hex2rgb(order.toLowerCase());
        console.log(color);
        my.ollie.color(color);
        return;
      }
      switch (order) {
      case "left":
        angle -= 30;
        rollf(angle,speed);
        break;
      case "right":
        angle += 30;
        rollf(angle,speed);
        break;
      case "west": 
        angle = 270;
        rollf(angle,speed);
        break;
      case "south":
        angle = 180;
        rollf(angle,speed);
        break;
      case "north":
        angle = 0;
        rollf(angle,speed);
        break;
      case "east":
        angle = 90;
        rollf(angle,speed);
        break;
      case "slow":
        speed -= 30;
        rollf(angle,speed);
        break;
      case "fast":
        speed += 30;
        rollf(angle,speed);
        break;
      case "stop":
        speed = 0;
        rollf(angle,speed);
        break;
      case "blue":
        my.ollie.color(0x0000FF);
        break;
      case "green":
        my.ollie.color(0x00FF00);
        break;
      case "red":
        my.ollie.color(0xFF0000);
        break;
      case "pink":
        my.ollie.color(0xFF00FF);
        break;
      case "yellow":
        my.ollie.color(0xFFFF00);
        break;
      case "cyan":
        my.ollie.color(0x00FFFF);
        break;
      default:
        console.log("Unknown command: '" + order+ "'");
      }
    }
    
    my.ollie.start(function() {
      
      setInterval(function() {

        //"http://192.168.130.213:8000/test.json", body="", function(error, response, body) {
        
        request(
         {  method: 'GET'
          , uri: 'http://bb8.oviles.info/api/get'
        }, function(error, response, body) {
          var jsonObject = JSON.parse(body);
          var order = jsonObject.msg
          var id = jsonObject.created
          if (lastWebId !== id ) {
            lastWebId = id;
            console.log("Web: " + order);
            executeOrder(order);
          }
        });
        
        request(
         {  method: 'POST'
          , uri: 'https://b9b5e967-0878-4d97-84ab-2a03b75191f3-bluemix.cloudant.com/bb8/_find'
          , body: JSON.stringify({"selector": {"created": {"$gt": 0}},"fields": ["_id","created", "msg"],"sort": [{"created": "desc"}],"limit": 1,"skip": 0})
          }, function(error, response, body) {
          var jsonObject = JSON.parse(body);
          var order = jsonObject.docs[0].msg
          var id = jsonObject.docs[0]._id
          if (lastTwitterId !== id ) {
            lastTwitterId = id;
            console.log("Twitter: " + order);
            executeOrder(order);
          }
        });

        
        //my.ollie.roll(90,90);
        
      }, 500);            
                           
    });
            
            
  }
}).start();

