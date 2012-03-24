var Discussion = {};

Discussion.Model = Backbone.Model.extend({
  defaults: {
    title: 'Discussion title',
  }
});

Discussion.View = Backbone.View.extend({
  tagName: 'p',
  className: 'discussion-thread',
  template: $('#discussion-thread-template').html(),
  render: function() {
    var tmpl = _.template(this.template);
    $(this.el).html(tmpl(this.model.toJSON()));
    return this;
  },
});

Discussion.Collection = Backbone.Collection.extend({
  model: Discussion.Model,
  url: '/discussions.json'
});

Discussion.CollectionView = Backbone.View.extend({
  el: $('#primary-content'),

  initialize: function() {
    var self = this;
    this.collection = new Discussion.Collection();
    this.collection.on('reset', function() {
      self.render();
    });
    this.collection.fetch();
  },

  render: function() {
    var self = this;
    this.$el.empty();
    _.each(this.collection.models, function(discussion) {
      self.renderDiscussion(discussion);
    }, this);
  },

  renderDiscussion: function(discussion) {
    var discussionView = new Discussion.View({
      model: discussion
    });
    this.$el.append(discussionView.render().el);
  }
});
