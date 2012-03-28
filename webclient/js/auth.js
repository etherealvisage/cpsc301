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
      }).done(function() { 
        console.log("!");
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

