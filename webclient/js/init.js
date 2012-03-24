// Use module pattern (http://www.adequatelygood.com/2010/3/JavaScript-Module-Pattern-In-Depth)
// to confine variables and functions to local scope.
(function($) {
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
