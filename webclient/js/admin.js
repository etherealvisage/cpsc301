var Administration = {};

Administration.MainView = Backbone.View.extend({
  el: $("#primary-content"),
  template: $("#admin-main-template").html(),
  initialize: function() {
    this.$el.empty();

    setNavInfo("admin", "Admin panel", "", "");

    this.$el.html(this.template);
  }
});

Administration.NewUserView = Backbone.View.extend({
  el: $("#primary-content"),
  template: $("#admin-new-user-template").html(),
  initialize: function() {
    this.$el.empty();

    setNavInfo("admin", "New User", "", "");

    this.$el.html(this.template);

    $("#admin-new-user-submit").click(function() {
      // data validation here
      var type = $("#admin-new-user-type").val();
      var typeCode = -1;
      if(type == "Resident") typeCode = 0;
      else if(type == "Doctor") typeCode = 1;
      else if(type =="Administrator") typeCode = 2;

      $.ajax({
        url: "/api/users",
        type: "POST",
        dataType: "json",
        data: {
          username: $("#admin-new-user-username").val(),
          name: $("#admin-new-user-name").val(),
          password: $("#admin-new-user-password").val(),
          userType: typeCode
        }
      }).done(function(data) {
        displayWarning("TODO", "This isn't implemented yet.");
      }).error(function(jqXHR, textStatus) {
        displayWarning("There's a problem . . .", "Cannot contact the server!");
      });
      /* Return false so the browser doesn't navigate. */
      return false;
    });
  }
});
