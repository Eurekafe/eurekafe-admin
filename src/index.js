import "./style/index.scss";
import "./app.jsx";
import "bootstrap";

$(document).ready(function() {
  $.get("freq/get", function(data) {
    if(data) {
      $("#freq").text(data);
    }
    else {
      $("#freq").html("<em> non défini </em>");
    }
  });
});