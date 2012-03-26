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

