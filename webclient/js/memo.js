var Memo = {};

Memo.ListItemModel = Backbone.Model.extend({
  defaults: {
    id: -1,
    title: "Unknown title",
    postDate: "Unknown date",
  }
});

Memo.ListItemView = Backbone.View.extend({
  tagName: "div",
  template: $("#memo-list-item-template").html(),
  render: function() {
    var tmpl = _.template(this.template);
    $(this.el).html(tmpl(this.model.toJSON()));
    return this;
  },
});

Memo.ListCollection = Backbone.Collection.extend({
  model: Memo.ListItemModel,
  url: "/api/memos"
});

Memo.ListCollectionView = Backbone.View.extend({
  el: $("#primary-content"),

  initialize: function() {
    var self = this;
    this.collection = new Memo.ListCollection;
    this.collection.on("reset", function() {
      self.render();
    });
    this.collection.fetch();
  },

  render: function() {
    var self = this;
    this.$el.empty();
    _.each(this.collection.models, function(listitem) {
      self.renderListItem(listitem);
    }, this);
  },

  renderListItem: function(listitem) {
    var listItemView = new Memo.ListItemView({
      model: listitem
    });

    console.log(this.$el);
    this.$el.append(listItemView.render().el);
    console.log(this.$el);
  },
});

