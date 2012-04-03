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
