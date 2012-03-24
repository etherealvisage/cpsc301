/*====
  Root
  ====*/
var Root = {};

Root.View = Backbone.View.extend({
  el: $('#primary-content'),
  template: $('#root-template').html(),
  initialize: function() {
    this.render();
  },
  render: function() {
    var tmpl = _.template(this.template);
    this.$el.html(tmpl());
  }
});
