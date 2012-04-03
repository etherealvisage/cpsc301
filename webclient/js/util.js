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

function setNavbarUsername(username) {
  $("#navbar-username").html(username);
}

/* Generates a relative time/date string from the current time.
  If argument is a Date, uses that. If argument is an integer,
  the time is treated as a UNIX-epoch seconds offset.

  NOTE: `months' may be occasionally off.
*/
function relativeTime(time) {
  var d = null;
  if(typeof time == "integer") {
    d = new Date();
    d.setTime(time * 1000);
  }
  else {
    /* Assume argument is a Date object. */
    d = time;
  }

  var current = new Date();
  var delta = new Date();
  delta.setTime(Math.abs(current - d));
  
  var years = delta.getUTCFullYear() - 1970;
  var months = delta.getUTCMonth();
  var days = delta.getUTCDate() - 1;
  var hours = delta.getUTCHours();
  var minutes = delta.getUTCMinutes();
  var seconds = delta.getUTCSeconds();
    
  if(years > 0) {
    if(years == 1) return "a year";
	  else return years + " years";
  }
  else if(months > 0) {
	  if(months == 1) return "a month";
	  else return months + " months";
  }
  else if(days > 0) {
	  if(days == 1) return "a day";
	  else return days + " days";
  }
  else if(hours > 0) {
	  if(hours == 1) return "an hour";
	  else return hours + " hours";
  }
  else if(minutes > 0) {
	  if(minutes == 1) return "a minute";
	  else return minutes + " minutes";
  }
  else if(seconds > 1) {
	  return seconds + " seconds";
  }
  else return "a second";
}

