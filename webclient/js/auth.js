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
    $(this.el).empty().html(this.template);
    
    /* Initialize page elements. */
    var msg = $("#authentication-login-message");
    var showError = function(error) {
      msg.html(error).css('color', '#f00');
    };

    $('#authentication-login-username').focus();

    var form = $('#authentication-login-form');
    form.submit(function(evt) {
      evt.preventDefault();
      msg.html("Sending login request ...").css('color', '#888');

      $.ajax({
        url: "/api/authenticate",
        type: "POST",
        dataType: "json",
        data: form.serialize()
      }).done(function(data) { 
        if(data.state == "notFound")
          showError('Unknown username.');
        else if(data.state == "failed")
          showError('Incorrect password.');
        else if(data.state == "success") {
          setNavbarState(data.userType || 1);
          setNavbarUsername(data.name);
          router.navigate("/", {trigger: true});
        }
        else
          msg.html("State: " + data.state);
      }).error(function(jqXHR, textStatus) {
        showError('Error sending login request. Perhaps the server is down?');
      });
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
