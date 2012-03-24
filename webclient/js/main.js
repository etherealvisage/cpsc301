// Use module pattern (http://www.adequatelygood.com/2010/3/JavaScript-Module-Pattern-In-Depth)
// to confine variables and functions to local scope.
(function($) {
  /*======
    Config
    ======*/
  var Config = {
  };

  /*==========
    Discussion
    ==========*/
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


  /*======
    Router
    ======*/
  var HappyRouter = Backbone.Router.extend({
    routes: {
      '': 'show_root',
      'discussions': 'list_discussions',
      'discussions/:thread_id': 'show_discussion',
    },
    show_root: function() {
      console.log('Show root');
      new Root.View();
    },
    list_discussions: function() {
      console.log('List discsussions');
      new Discussion.CollectionView();
    },
    show_discussion: function(thread_id) {
      console.log('Show discsussion ' + thread_id);
    }
  });


  /*==========================
    Application initialization
    ==========================*/
  var router = new HappyRouter();

  // Prevent browser from navigating to new page when link activated.
  $('body').on('click', 'a', function(evt) {
    if(window.location.host !== evt.target.host)
      return true;
    evt.preventDefault();
    router.navigate('/discussions', true);
  });

  Backbone.history.start({pushState: true});
}(jQuery));
