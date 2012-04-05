var Discussion = {};

Discussion.ListItemModel = Backbone.Model.extend({
  defaults: {}
});

Discussion.ListItemView = Backbone.View.extend({
  tagName: "div",
  template: $("#discussion-list-item-template").html(),

  render: function() {
    var tmpl = _.template(this.template);
    $(this.el).html(templ(this.model.toJSON()));
    return this;
  }
});

Discussion.ListCollection = Backbone.Collection.extend({
  model: Discussion.ListItemModel,
  url: "/api/discussions"
});

Discussion.ListView = Backbone.View.extend({
  el: $("#primary-content"),

  initialize: function() {
    setNavInfo("discussion", "Discussion List", "");

    var self = this;
    this.collection = new Discussion.ListCollection;
    this.collection.on("reset", function() {
      self.render();
    });
    this.collection.fetch();
  },

  render: function() {
    var self = this;
    this.$el.empty();
    _.each(this.collection.models, function(item) {
      self.renderListItem(item);
    }, this);
  },

  renderListItem: function(item) {
    var itemView = new Discussion.ListItemView({
      model: item
    });

    this.$el.prepend(listItemView.render().el);
  },
});

Discussion.Model = Backbone.Model.extend({
  defaults: {
  },
  urlRoot: "/api/discussions/"
});

Discussion.View = Backbone.View.extend({
  el: $("#primary-content"),

  template: $("#discussion-view-template").html(),
  postTemplate: $("#discussion-post-template").html(),

  initialize: function() {
    setNavInfo("discussion", "View Discussion", "");
    this.model = new Discussion.Model();
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
    this.$el.html(tmpl(this.model.toJSON()));
    _.each(this.model.get("posts"), function(item) {
      $("#discussion-view-list").append(self.renderPost(item));
    });
  },

  renderPost: function(data) {
    var tmpl = _.template(this.postTemplate);
    return $("<div>").html(tmpl(data));
  }
});

Discussion.NewView = Backbone.View.extend({
  el: $("#primary-content"),

  template: $("#discussion-new-template").html(),

  initialize: function() {
    console.log("Initializing NewView for discussions");
    setNavInfo("discussions", "New Discussion", "");
    this.$el.empty();
    this.$el.html(this.template);
    
    $("#discussion-new-textarea").wysihtml5();
    $("#discussion-new-submit").attr("value", "Submit discussion");

    var self = this;
    $("#discussion-new-submit").click(function() {
      // TODO: insert data validation.
      var title = $("#discussion-new-title").val();
      var content = $("#discussion-new-textarea").val();

      $.ajax({
        url: "/api/discussions",
        type: "POST",
        dataType: "json",
        data: {
          title: title,
          content: content
        }
      }).done(function(data) {
        console.log("Data received:");
        console.log(data);
      });
      return false;
    });
  }
});
