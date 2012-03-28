var Authentication = {};

Authentication.LoginView = Backbone.View.extend({
  tagName: "div",
  el: $("#primary-content"),
  first: true,

  template: $("#authentication-login-template").html(),

  initialize: function() {
    setNavbarState(0);
    this.render();
  },

  render: function() {
    if(!this.first) {
      $(this.el).empty();
      $(this.el).html(this.template);
    }
    else this.first = false;
    
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
        msg.css("color", "red");
        if(data.state == "notFound") {
          msg.html("Unknown username.");
        }
        else if(data.state == "failed") {
          msg.html("Incorrect password.");
        }
        else if(data.state == "success") {
          setNavbarState(data.authLevel || 1);
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
      msg.css("color", "blue");
      return false;
    });
  }
});

