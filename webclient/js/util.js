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
  $("#navbase-left").html("<h3>" + left + "</h3>");
  $("#navbase-right").html("<h3>" + right + "</h3>");
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

/* Sets the username in the top navbar. */
function setNavbarUsername(username) {
  $("#navbar-username").html(username);
}

/* Displays a modal warning dialog. */
function displayWarning(header, message) {
  var w = $("#warning");
  $("#warning-header").html(header);
  $("#warning-message").html(message);

  w.modal({
    backdrop: true,
    show: true,
    keyboard: false
  });
}

/* Nicely formats a UNIX timestamp in the local timezone. */
function formatTimestamp(timestamp) {
  var d = new Date();

  d.setTime(timestamp * 1000);
  var current = new Date();
  var delta = new Date();
  delta.setTime(Math.abs(current - d));
  
  var years = delta.getUTCFullYear() - 1970;
  var months = delta.getUTCMonth();
  var days = delta.getUTCDate() - 1;
  var hours = delta.getUTCHours();
  var minutes = delta.getUTCMinutes();
  var seconds = delta.getUTCSeconds();

  if(years > 0 || months > 0 || days > 7) {
    return d.toLocaleTimeString() + " " + d.toLocaleDateString();
  }
  else if(days > 0) {
	  if(days == 1) return "a day ago";
	  else return days + " days ago";
  }
  else if(hours > 0) {
	  if(hours == 1) return "an hour ago";
	  else return hours + " hours ago";
  }
  else if(minutes > 0) {
	  if(minutes == 1) return "a minute ago";
	  else return minutes + " minutes ago";
  }
  else if(seconds > 15) {
	  return seconds + " seconds ago";
  }
  else return "seconds ago";
}

/* Validates that a string is within [min, max]. */
function validateStringLength(string, min, max, title, shortMessage, longMessage) {
  if(string.length < min) {
    displayWarning(title, shortMessage);
    return false;
  }
  else if(string.length > max) {
    displayWarning(title, longMessage);
    return false;
  }
  return true;
}
