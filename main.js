(function () {
  console.log("Starting");

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
    //var url = "http://bb8.oviles.info/api/send";
    var url = "/api/send";
    var data2 = {
      "created": new Date(),
      "msg": data
    };
    console.log("Sending: " + data)

    $.ajax({
      type: "POST",
      crossDomain: true,
      url: url,
      data: JSON.stringify(data2),
      success: function () {
        console.log("Successfully sent" + data2)
      },
      dataType: "json"
    });
  }

})()
