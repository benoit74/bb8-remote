(function () {
  console.log("Starting");

  var isProcessing = false;
  var currentEvent;

  function process(event) {
    currentEvent = event;

    if (!isProcessing) {
      isProcessing = true;
      // move()
    }
  }

  function move() {
    console.log("move: ");
    var alpha = currentEvent.alpha;
    var beta = currentEvent.beta;
    var gamma = currentEvent.gamma

    console.log("alpha: " + alpha + "beta: " + beta + "gamma: " + gamma);

    if (alpha > 45 && alpha <= 315) post("north");
    if (alpha > 315 && alpha <= 225) post("east");
    if (alpha > 225 && alpha <= 135) post("south");
    if (alpha > 135 && alpha <= 0) post("west");

    if (beta > 0) post("fast");
    if (beta < 0) post("slow");

    if (gamma > 0) post("right");
    if (gamma < 0) post("left");

    isProcessing = false;
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

  function post(command) {
    console.log("post: " + command)
    var url = "http://localhost:8080/api/send";
    var msg = {
      "created": new Date(),
      "command": command
    };
    console.log("Sending msg: " + msg);

    $.ajax({
      type: "POST",
      crossDomain: true,
      url: url,
      contentType : 'application/json',
      data: JSON.stringify(msg),
      success: function () {
        console.log("Successfully sent" + msg)
      }
    });
  }

})()
