/*======
  Router
  ======*/
var routeMap =  {
  '': 'index',
  'login': 'login_page',
  'logout': 'logout_page',
  'discussions': 'list_discussions',
  'discussions/new': 'new_discussion',
  'discussions/:id': 'show_discussion',
  'memos/new': 'new_memo',
  'memos': 'list_memos',
  'memos/:memo_id': 'show_memo',
  'memos/:memo_id/edit': 'edit_memo',
  'admin': 'main_admin',
  'admin/new_user': 'new_user',
  'admin/user_list': 'user_list'
};

if(typeof Backbone !== 'undefined') {
  // If running on client, tell Backbone about our routes.
  var routerViews = {
    routes: routeMap,
    index: function() {
      new Index.View();
    },
    login_page: function() {
      new Authentication.LoginView();
    },
    logout_page: function() {
      new Authentication.LogoutView();
    },
    list_discussions: function() {
      new Discussion.ListView();
    },
    show_discussion: function(id) {
      new Discussion.View({id: id});
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
  };
  var HappyRouter = Backbone.Router.extend(routerViews);
} else if(typeof exports !== 'undefined') {
  // If running on server, export routes so they can be used by other code.
  exports.routeMap = routeMap;
}
