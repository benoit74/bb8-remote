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
    var lastid =0;
    var rollf = function(angle, speed) {
      console.log("Going " + speed + "mph at " + angle + "degrees");
      my.ollie.roll(speed,angle);
    }
    my.ollie.start(function() {
      
      
      setInterval(function() {

        //"http://192.168.130.213:8000/test.json", body="", function(error, response, body) {
        
        request(
         {  method: 'POST'
          , uri: 'https://b9b5e967-0878-4d97-84ab-2a03b75191f3-bluemix.cloudant.com/bb8/_find'
          , body: JSON.stringify({"selector": {"created": {"$gt": 0}},"fields": ["_id","created", "msg"],"sort": [{"created": "desc"}],"limit": 1,"skip": 0})
          }, function(error, response, body) {
          var jsonObject = JSON.parse(body);
          var order = jsonObject.docs[0].msg
          var id = jsonObject.docs[0]._id
          console.log(order);
          
          switch (order) {
          case "left":
            if (lastid !== id ) {
              angle -= 30;
              lastid = id;
            }
            rollf(angle,speed);
            break;
          case "right":
            if (lastid !== id ) {
              angle += 30;
              lastid = id;
            }
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
            if (lastid !== id  && speed > 0) {
              speed -= 30;
              lastid = id;
            }
            rollf(angle,speed);
            break;
          case "fast":
            if (lastid !== id && speed < 90) {
              speed += 30;
              lastid = id;
            }
            rollf(angle,speed);
            break;
          case "stop":
            my.ollie.halt();
            break;
          case "spin":
            my.ollie.spin();
            break;
          default:
            console.log("Unknown command: '" + order+ "'");
          }
          
          
        });

        
        //my.ollie.roll(90,90);
        
      }, 500);            
                           
    });
            
            
  }
}).start();

