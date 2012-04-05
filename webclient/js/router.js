/*======
  Router
  ======*/
var HappyRouter = Backbone.Router.extend({
  routes: {
    '': 'login_page',
    'login': 'login_page',
    'logout': 'logout_page',
    'discussions': 'list_discussions',
    'discussions/:thread_id': 'show_discussion',
    'discussions/new': 'new_discussion',
    'memos/new': 'new_memo',
    'memos': 'list_memos',
    'memos/:memo_id': 'show_memo',
    'memos/:memo_id/edit': 'edit_memo',
    'admin': 'main_admin',
    'admin/new_user': 'new_user',
    'admin/user_list': 'user_list'
  },
  login_page: function() {
    new Authentication.LoginView();
  },
  logout_page: function() {
    new Authentication.LogoutView();
  },
  list_discussions: function() {
    //new Discussion.CollectionView();
  },
  show_discussion: function(thread_id) {

  },
  new_discussion: function() {
    new Discussion.NewView();
  },
  list_memos: function() {
    new Memo.ListCollectionView();
  },
  show_memo: function(memo_id) {
    new Memo.MemoView({id: memo_id});
  },
  edit_memo: function(memo_id) {
    new Memo.EditView({id: memo_id});
  },
  new_memo: function() {
    new Memo.NewView();
  },
  main_admin: function() {
    new Administration.MainView();
  },
  new_user: function() {
    new Administration.NewUserView();
  },
  user_list: function() {
    new Administration.UserListView();
  },
});
