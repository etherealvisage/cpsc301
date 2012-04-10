/* Client-side views/collections for memos. */
var Memo = {};

/* Represents a single memo in `list-mode', e.g. just metadata. */
Memo.ListItemModel = Backbone.Model.extend({
  defaults: {
    id: -1,
    title: "Unknown title",
    postDate: "Unknown date",
  }
});

/* View class for list of metadata about memos. */
Memo.ListItemView = Backbone.View.extend({
  tagName: "div",
  template: $("#memo-list-item-template").html(),
  /* Renders the view. */
  render: function() {
    var tmpl = _.template(this.template);
    $(this.el).html(tmpl(this.model.toJSON()));
    return this;
  },
});

/* A collection of list items, e.g. a list itself. */
Memo.ListCollection = Backbone.Collection.extend({
  model: Memo.ListItemModel,
  url: "/api/memos"
});

Memo.ListCollectionView = Backbone.View.extend({
  el: $("#primary-content"),
  list: null,

  template: $("#memo-list-template").html(),

  initialize: function() {
    setNavInfo("memo", "Memo List");

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

    this.$el.html(this.template);
    this.list = $("#memo-list");

    if(getNavbarState() == 2) {
      $("#memo-list-new-div").show();
      $("#memo-list-new").click(function() {
        router.navigate("/memos/new", {trigger: true});
      });
    }
    else {
      $("#memo-list-new-div").hide();
    }

    _.each(this.collection.models, function(listitem) {
      self.renderListItem(listitem);
    }, this);
  },

  /* Renders one particular list item and appends it to this.list. */
  renderListItem: function(listitem) {
    var listItemView = new Memo.ListItemView({
      model: listitem
    });

    this.list.prepend(listItemView.render().el);
  },
});

/* Model for a `full' memo: everything there is to know. */
Memo.MemoModel = Backbone.Model.extend({
  defaults: {
    title: "",
    postDate: "",
    content: ""
  },
  /* url automatically formed via this.id and urlRoot. */
  urlRoot: "/api/memos/"
});

/* View for MemoModel: a full view of one particular memo. */
Memo.MemoView = Backbone.View.extend({
  el: $("#primary-content"),

  template: $("#memo-view-template").html(),

  initialize: function() {
    setNavInfo("memo", "View Memo");
    this.model = new Memo.MemoModel();
    this.model.id = this.id;
    var self = this;

    /* Grab the model and render the view once we have the data. */
    this.model.fetch({
      success: function(model) {
        self.render();
      }
    });
  },

  render: function() {
    this.$el.empty();
    var tmpl =_.template(this.template);
    $(this.el).html(tmpl(this.model.toJSON()));
    if(getNavbarState() == 2) {
      $("#memo-view-edit").show();
      $("#memo-view-edit").attr("href", "/memos/" + this.model.get("id") + "/edit");
    }
    else {
      $("#memo-view-edit").hide();
    }
  }
});

/* View for editing a memo. Uses the same model as MemoView. */
Memo.EditView = Backbone.View.extend({
  el: $("#primary-content"),

  template: $("#memo-edit-template").html(),

  initialize: function() {
    setNavInfo("memo", "Edit Memo");
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

    /* Some elements in this template need setup. */
    $("#memo-edit-textarea").wysihtml5();
    $("#memo-edit-textarea").html(this.model.get("content"));
    $("#memo-edit-submit").attr("value", "Submit changes");
    $("#memo-edit-title").val(this.model.get("title"));

    /* Handle form submission. */
    var self = this;
    $("#memo-edit-submit").click(function() {
      /* Get the model to save itself. */
      self.model.set("content", $("#memo-edit-textarea").val());
      self.model.set("title", $("#memo-edit-title").val());
      self.model.save().done(function(){
        /* Once the update request has gone through,
          swap to viewing the memo. */
        router.navigate("/memos/" + self.model.id, {trigger: true});
      });
      /* Return false so the browser doesn't actually try to submit the form itself. */
      return false;
    });
  }
});

Memo.NewView = Backbone.View.extend({
  el: $("#primary-content"),
  
  template: $("#memo-new-template").html(),
  
  initialize: function() {
    setNavInfo("memo", "New Memo");
    this.render();
  },

  render: function() {
    this.$el.empty();
    var tmpl = _.template(this.template);
    $(this.el).html(tmpl({}));

    /* Some elements in this template need setup. */
    $("#memo-new-textarea").wysihtml5();
    $("#memo-new-textarea").html("");
    $("#memo-new-submit").attr("value", "Submit memo");

    /* Handle form submission. */
    var self = this;
    $("#memo-new-submit").click(function() {
      var title = $("#memo-new-title").val();
      var content = $("#memo-new-textarea").val();

      /* Validate the title length. */
      if(!validateStringLength(title, 3, 1024, "Memo title",
        "<p>Please enter a title of at least three characters.</p>",
        "<p>Please enter a title of at most 1024 characters.</p>")) return false;

      if(!validateStringLength(content, 10, 1048576, "Memo content",
        "<p>The memo you have typed is too short.</p>",
        "<p>The memo you have typed is too long -- " + 
        "including formatting, it was more than 1MB.</p>")) return false;

      $.ajax({
        url: "/api/memos",
        type: "POST",
        dataType: "json",
        data: {
          title: title,
          content: content
        }
      }).done(function(data) {
        if(typeof data.memoID !== "undefined") {
          router.navigate("/memos/" + data.memoID, {trigger: true});
        }
        else if(data.error == "perm") {
          displayWarning("Permissions", "You're not allowed to do that.");
        }
        /* There was an error. */
        else {
          console.log("Error. Data returned from server:");
          console.log(data);
        }
      });
      /* Return false so the browser doesn't actually try to submit the form itself. */
      return false;
    });
  }
});
