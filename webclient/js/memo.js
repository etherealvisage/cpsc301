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
    var d = new Date();
    d.setTime(this.model.get("postDate")*1000);
    this.model.set("postDateFormatted", d.toLocaleString());
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
  list: undefined,

  initialize: function() {
    setNavInfo("memo", "Memo List", "");
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
    this.list = $("<ul>");
    this.$el.append(this.list);
    _.each(this.collection.models, function(listitem) {
      self.renderListItem(listitem);
    }, this);
  },

  renderListItem: function(listitem) {
    var listItemView = new Memo.ListItemView({
      model: listitem
    });

    this.list.append(listItemView.render().el);
  },
});

Memo.MemoModel = Backbone.Model.extend({
  defaults: {
    title: "",
    postDate: "",
    content: ""
  },
  urlRoot: "/api/memos/"
});

Memo.MemoView = Backbone.View.extend({
  el: $("#primary-content"),

  template: $("#memo-view-template").html(),

  initialize: function() {
    setNavInfo("memo", "View Memo", "");
    this.model = new Memo.MemoModel();
    this.model.id = this.id;
    var self = this;

    this.model.fetch({
      success: function(model) {
        self.render();
      }
    });
  },

  render: function() {
    var d = new Date();
    d.setTime(this.model.get("postDate")*1000);
    this.model.set("postDateFormatted", d.toLocaleString());

    this.$el.empty();
    var tmpl =_.template(this.template);
    $(this.el).html(tmpl(this.model.toJSON()));
    $("#memo-view-edit").attr("href", "/memos/" + this.model.get("id") + "/edit");
  }
});

Memo.EditView = Backbone.View.extend({
  el: $("#primary-content"),

  template: $("#memo-edit-template").html(),

  initialize: function() {
    setNavInfo("memo", "Edit Memo", "");
    this.model = new Memo.MemoModel();
    this.model.id = this.id;
    var self = this;

    this.model.fetch({
      success: function(model) {
        self.render();
      }
    });
  },

  render: function() {
    this.$el.empty();
    var tmpl = _.template(this.template);
    $(this.el).html(tmpl(this.model.toJSON()));
    $("#memo-edit-textarea").wysihtml5();
    $("#memo-edit-textarea").html(this.model.get("content"));
    $("#memo-edit-submit").attr("value", "Submit changes");
  }
});

