var Authentication = {};

Authentication.LoginView = Backbone.View.extend({
  tagName: "div",
  el: $("#primary-content"),

  template: $("#authentication-login-template").html(),

  initialize: function() {
    setNavbarState(0);
    this.render();
  },

  render: function() {
    $(this.el).empty();
    $(this.el).html(this.template);
    
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
          setNavbarState(data.userType || 1);
          setNavbarUsername(data.name);
          router.navigate("/", {trigger: true});
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
  else if(response.error == "perm") {
    displayWarning("Permissions", "<p>You tried to do something you weren't supposed to. Nice try.</p>");
  }
  return response;
}
