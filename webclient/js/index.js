var Index = {};

Index.View = Backbone.View.extend({ 
  el: $('#primary-content'),

  template: $('#index-template').html(),

  initialize: function() {
    console.log('le index ' + window.location.hash);
    $.ajax({
      url: '/api/users/current',
      type: 'GET',
      dataType: 'json',
    }).done(function(data) {
      if(data.error === 'auth') {
        router.navigate('/login', {trigger: true});
      } else {
        // Remove leading '#' from hash.
        var intendedPath = window.location.hash.substring(1);
        if(intendedPath === '')
          intendedPath = 'memos';
        router.navigate('/' + intendedPath, {trigger: true});

        setNavbarState(data.userType || 1);
        setNavbarUsername(data.name);
      }
    });

    // Note we don't call render() here, as we should never directly be showing
    // index content. We must change this if we ever create a landing
    // "dashboard" to be served as the index.
  }, 

  render: function() {
    this.$el.empty();
    var tmpl = _.template(this.template);
    $(this.el).html(tmpl({}));
  }
});
