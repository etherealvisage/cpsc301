/* Sets up the `navigation info', that is, the main nav bar and the
  left/right navbase elements.
*/
function setNavInfo(main, left, right) {
  navElements = {
    "admin": $("#navbar-admin"),
    "memo": $("#navbar-memos"),
    "discussion": $("#navbar-discussions"),
  };
  for(element in navElements) {
    if(element == main) {
      navElements[element].addClass("active");
    }
    else {
      navElements[element].removeClass("active");
    }
  }
  $("#navbase-left").html("<h5>" + left + "</h5>");
  $("#navbase-right").html("<h5>" + right + "</h5>");
}

/* Sets navbar state:
  level = 0: nothing
  level = 1: regular user
  level = 2: admin user
*/
function setNavbarState(level) {
  if(level == 0) {
    $("#navbar").hide();
    $("#navbase").hide();
  }
  else if(level == 1) {
    $("#navbar").show();
    $("#navbase").show();
    $("#navbar-auth").show();
    $("#navbar-admin").hide();
  }
  else if(level == 2) {
    $("#navbar").show();
    $("#navbase").show();
    $("#navbar-auth").show();
    $("#navbar-admin").show();
  }
}

