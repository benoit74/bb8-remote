(function () {
    console.log("Starting");

    function process(event) {
      var alpha = event.alpha;
      var beta = event.beta;
      var gamma = event.gamma
      console.log("alpha: " + alpha + "beta: " + beta + "gamma: " + gamma);

      if (alpha > 45 && alpha <= 315) post("north");
      if (alpha > 315 && alpha <= 225) post("east");
      if (alpha > 225 && alpha <= 135) post("south");
      if (alpha > 135 && alpha <= 0) post("west");

      if (beta > 0) post("fast");
      if (beta < 0) post("slow");

      if (gamma > 0) post("right");
      if (gamma < 0) post("left");
    }

    if (window.DeviceOrientationEvent) {
      window.addEventListener("deviceorientation", process, false);
    } else {
      console.log("wowwowow deviceorientation not supported.");
          }

    $(document).on("keydown", function (e) {

      switch (e.keyCode) {
      case 38:
        post("north");
        break;

      case 40:
        post("south");
        break;

      case 37:
        post("west");
        break;

      case 39:
        post("east");
        break;

      case 87:
        post("fast");
        break;

      case 83:
        post("slow");
        break;

      case 65:
        post("left");
        break;

      case 68:
        post("right");
        break;
      }
    });

  $(".north").on("click", function () {
    post("north");
  });

  $(".south").on("click", function () {
    post("south");
  });

  $(".west").on("click", function () {
    post("west");
  });

  $(".east").on("click", function () {
    post("east");
  });

  $(".fast").on("click", function () {
    post("fast");
  });

  $(".slow").on("click", function () {
    post("slow");
  });

  $(".right").on("click", function () {
    post("right");
  });

  $(".left").on("click", function () {
    post("left");
  });

  function post(data) {
    console.log("post: " + data)
    //var url = "http://bb8.oviles.info/api/send";
    var url = "/api/send";
    var msg = {
      "created": new Date(),
      "msg": data
    };
    console.log("Sending msg: " + data);

    $.ajax({
      type: "POST",
      crossDomain: true,
      url: url,
      data: JSON.stringify(msg),
      success: function () {
        console.log("Successfully sent" + msg)
      },
      dataType: "application/json"
    });
  }

})()
