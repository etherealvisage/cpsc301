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
      var username = $("#admin-new-user-username").val();
      var name = $("#admin-new-user-name").val();
      var password = $("#admin-new-user-password").val();

      if(username.length < 3) {
        displayWarning("Login username", "Please use a login name at least three characters long.");
        return false;
      }
      else if(username.length > 99) {
        display.warning("Login username", "Please use a login name less than 100 characters.");
        return false;
      }

      if(name.length < 3) {
        displayWarning("Full name", "Please have a full name of at least three characters.");
        return false;
      }
      else if(name.length > 99) {
        displayWarning("Full name", "Please use a full name less than 100 characters long.");
        return false;
      }

      if(password.length < 6) {
        displayWarning("Password", "Please use a password at least six characters long.");
        return false;
      }
      else if(password.length > 99) {
        displayWarning("Password", "Please use a password less than 100 characters long.");
        return false;
      }

      var type = $("#admin-new-user-type").val();
      var typeCode = -1;
      if(type == "Resident") typeCode = 0;
      else if(type == "Doctor") typeCode = 1;
      else if(type =="Administrator") typeCode = 2;
      else {
        displayWarning("User type", "Please select a user type.");
        return false;
      }

      $.ajax({
        url: "/api/users",
        type: "POST",
        dataType: "json",
        data: {
          username: username,
          name: name,
          password: password,
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

Administration.UserListView = Backbone.View.extend({
  el: $("#primary-content"),
  template: $("#admin-user-list-template").html(),
  item_template: $("#admin-user-list-entry-template").html(),
  initialize: function() {
    this.$el.html(this.template);

    var tmpl = _.template(this.item_template);
    
    $.ajax({
      url: '/api/users',
      type: 'GET',
      dataType: 'json',
    }).done(function(data) {
      for(var i = 0; i < data.length; i ++) {
        var div = $("<div>");
        div.html(tmpl(data[i]));
        $("#admin-user-list").append(div);
      }
    });
  }
});
