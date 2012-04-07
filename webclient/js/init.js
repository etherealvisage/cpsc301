// Use module pattern (http://www.adequatelygood.com/2010/3/JavaScript-Module-Pattern-In-Depth)
// to confine variables and functions to local scope.
var router = undefined;
(function($) {
  router = new HappyRouter();
  // Internet Explorer hash-based history relies on iframe, so call start()
  // only after DOM is ready.
  $(function() {
    Backbone.history.start({pushState: true});
  });

  // Prevent browser from navigating to new page when link activated.
  $('body').on('click', 'a', function(evt) {
    if(window.location.host !== evt.currentTarget.host)
      return true;
    evt.preventDefault();

    // If we use the query string at all, we will also need to reference
    // evt.currentTarget.search. As long as we stick to "pretty" URLs, however,
    // this should not be a problem.
    router.navigate(evt.currentTarget.pathname, true);
  });
}(jQuery));
