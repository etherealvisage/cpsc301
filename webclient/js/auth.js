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
    console.log($("#authentication-login-submit"));
    $("#authentication-login-submit").click(function() {
      $.ajax({
        url: "/api/authenticate",
        type: "POST",
        data: {
          username: $("#authentication-login-username").val(),
          password: $("#authentication-login-password").val()
        }
      }).done(function() { 
        console.log("!");
      });
      return false;
    });
  }
});

