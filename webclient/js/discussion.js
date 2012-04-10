var Discussion = {};

Discussion.ListItemModel = Backbone.Model.extend({
  defaults: {}
});

Discussion.ListItemView = Backbone.View.extend({
  tagName: "div",
  template: $("#discussion-list-item-template").html(),

  render: function() {
    var tmpl = _.template(this.template);
    $(this.el).html(tmpl(this.model.toJSON()));
    return this;
  }
});

Discussion.ListCollection = Backbone.Collection.extend({
  model: Discussion.ListItemModel,
  url: "/api/discussions"
});

Discussion.ListView = Backbone.View.extend({
  el: $("#primary-content"),

  template: $("#discussion-list-template").html(),

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

    this.$el.html(this.template);

    $("#discussion-list-new").click(function() {
      router.navigate("/discussions/new", {trigger: true});
    });

    _.each(this.collection.models, function(item) {
      self.renderListItem(item);
    }, this);
  },

  renderListItem: function(item) {
    var itemView = new Discussion.ListItemView({
      model: item
    });

    $("#discussion-list").prepend(itemView.render().el);
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
    var self = this;

    var tmpl = _.template(this.template);
    var model = this.model.toJSON();
    setNavInfo("discussion", model.title, "");
    this.$el.html(tmpl(model));

    $("#discussion-view-textarea").wysihtml5();

    var self = this;
    $("#discussion-view-submit").click(function() {
      // data checking
      var body = $("#discussion-view-textarea").val();
      if(!validateStringLength(body, 3, 1048576, "Reply body",
        "<p>Please enter a reply of at least three characters.</p>",
        "<p>Your reply is too long -- please enter a reply " +
        "less than 1MB, including formatting.</p>")) return false

      $.ajax({
        url: "/api/discussions/" + self.id,
        type: "POST",
        dataType: "json",
        data: {
          body: body
        }
      }).done(function(data) {
        self.model.fetch({
          success: function(model) {
            self.render();
          }
        });
      });

      return false;
    });

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
    setNavInfo("discussion", "New Discussion", "");
    this.$el.empty();
    this.$el.html(this.template);
    
    $("#discussion-new-textarea").wysihtml5();
    $("#discussion-new-submit").attr("value", "Submit discussion");

    var self = this;
    $("#discussion-new-submit").click(function() {
      var title = $("#discussion-new-title").val();
      var content = $("#discussion-new-textarea").val();

      if(!validateStringLength(title, 3, 1024, "Discussion title",
        "<p>Please enter a title of at least three characters.</p>",
        "<p>Please enter a title of at most 1024 characters.</p>")) return false;

      if(!validateStringLength(content, 10, 1048576, "Discussion content",
        "<p>The initial post you have provided is too short. Please make it longer.</p>",
        "<p>The post you have provided is too long -- including formatting, " +
        "it was more than 1MB.</p>")) return false;

      $.ajax({
        url: "/api/discussions",
        type: "POST",
        dataType: "json",
        data: {
          title: title,
          content: content
        }
      }).done(function(data) {
        console.log(data);
        console.log(typeof data.discussionID);
        if(typeof data.discussionID !== "undefined") {
          router.navigate("/discussions/" + data.discussionID, {trigger: true});
        }
        else {
          displayWarning("Warning", "Something happened that should not have. Try resubmitting?");
        }
      });
      return false;
    });
  }
});
