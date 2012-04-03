var Authentication = {};

/* Handle the first login specially; the auth page has been preloaded
  into the primary-content div; don't bother reloading it.
*/
Authentication.firstLogin = true;

Authentication.LoginView = Backbone.View.extend({
  tagName: "div",
  el: $("#primary-content"),

  template: $("#authentication-login-template").html(),

  initialize: function() {
    setNavbarState(0);
    this.render();
  },

  render: function() {
    if(Authentication.firstLogin == false) {
      $(this.el).empty();
      $(this.el).html(this.template);
    }
    else Authentication.firstLogin = false;
    
    /* Initialize page elements. */
    var self = this;
    var msg = $("#authentication-login-message");
    $("#authentication-login-message").html("<h5>Enter username/password to login.</h5>");
    $("#authentication-login-submit").click(function() {
      $.ajax({
        url: "/api/authenticate",
        type: "POST",
        dataType: "json",
        data: {
          username: $("#authentication-login-username").val(),
          password: $("#authentication-login-password").val()
        }
      }).done(function(data) { 
        if(data.state == "notFound") {
          msg.css("color", "red");
          msg.html("Unknown username.");
        }
        else if(data.state == "failed") {
          msg.css("color", "red");
          msg.html("Incorrect password.");
        }
        else if(data.state == "success") {
          console.log(data.userType);
          if(data.userType == 0) setNavbarState(2);
          else setNavbarState(1);
          //setNavbarState(data.userType || 1);
          setNavbarUsername(data.name);
          router.navigate("/memos", {trigger: true});
        }
        else {
          msg.html("state: " + data.state);
        }
      }).error(function(jqXHR, textStatus) {
        msg.html("Error sending login request. Perhaps the server is down?");
        msg.css("color", "red");
      });
      msg.html("Sending login request . . .");
      msg.css("color", "#888");
      return false;
    });
  }
});

Authentication.LogoutView = Backbone.View.extend({
  initialize: function() {
    $.ajax({
      url: "/api/logout",
      type: "POST",
      dataType: "json",
    }).done(function(data) { 
      router.navigate("/login", {trigger: true});
    });
  }
});

/* Add Backbone model.parse() hook to check for invalid session tokens. */
Backbone.Model.prototype.parse = function(response) {
  if(response.error == "auth") {
    $("#auth-modal").modal({
      backdrop: true,
      show: true,
      keyboard: false
    });
  }
  return response;
}

