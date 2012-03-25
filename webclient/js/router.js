/*======
  Router
  ======*/
var HappyRouter = Backbone.Router.extend({
  routes: {
    '': 'show_root',
    'discussions': 'list_discussions',
    'discussions/:thread_id': 'show_discussion',
    'memos': 'list_memos',
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
  },
  list_memos: function() {
    new Memo.ListCollectionView();
  },
});
