(function($) {
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
    model: Discussion,
    url: '/discussions'
  });

  var DiscussionCollectionView = Backbone.View.extend({
    el: $('#discussions'),
    initialize: function() {
      var self = this;
      this.collection = new DiscussionCollection();
      this.collection.fetch();
      this.collection.on('reset', function() {
        self.render();
      });
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
