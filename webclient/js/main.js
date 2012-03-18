(function($) {
  var discussions = [
    {
      title: 'Under Your Spell',
      author: 'Desire',
    },
    {
      title: 'A Real Hero',
      author: 'College',
    }
  ];

  var Discussion = Backbone.Model.extend({
    defaults: {
      title: 'Discussion title',
    }
  });

  var DiscussionView = Backbone.View.extend({
    tagName: 'p',
    className: 'discussion-thread',
    template: $('#discussion-thread-template').html(),
    render: function() {
      var tmpl = _.template(this.template);
      $(this.el).html(tmpl(this.model.toJSON()));
      return this;
    },
  });

  var DiscussionCollection = Backbone.Collection.extend({
    model: Discussion
  });

  var DiscussionCollectionView = Backbone.View.extend({
    el: $('#discussions'),
    initialize: function() {
      this.collection = new DiscussionCollection(discussions);
      this.render();
    },
    render: function() {
      var self = this;
      _.each(this.collection.models, function(discussion) {
        self.renderDiscussion(discussion);
      }, this);
    },
    renderDiscussion: function(discussion) {
      var discussionView = new DiscussionView({
        model: discussion
      });
      this.$el.append(discussionView.render().el);
    }
  });

  var discussionCollectionView = new DiscussionCollectionView();
}(jQuery));
