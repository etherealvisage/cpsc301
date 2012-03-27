/*======
  Router
  ======*/
var HappyRouter = Backbone.Router.extend({
  routes: {
    '': 'show_root',
    'discussions': 'list_discussions',
    'discussions/:thread_id': 'show_discussion',
    'memos': 'list_memos',
    'memos/:memo_id': 'show_memo',
    'memos/:memo_id/edit': 'edit_memo'
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
  show_memo: function(memo_id) {
    new Memo.MemoView({id: memo_id});
  },
  edit_memo: function(memo_id) {
    new Memo.EditView({id: memo_id});
  }
});
