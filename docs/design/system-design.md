\setcounter{page}{2}

System design
=============

In designing Pynx, we chose to utilize a thick-client approach in which the
only actual HTML served by the backend is a single container. All other server
resources will be offered exclusively in JSON format, with the client
responsible for parsing this data and making the appropriate DOM modifications
so that it becomes visible to the user. The prime advantage offered by this
approach is performance---the amount of data sent over the wire is minimized,
obviating the need for a full-page refresh as the user navigates between
sections. As a result, the resulting product will more closely approach the
rich and responsive nature of desktop applications. Functionality need not be
sacrified through this technique, for with the use of HTML5 APIs such as
pushState(), browser back button functionality will be preserved, and each page
will remain associated with a unique URL visible in the browser's URL bar.
While the improvement in user experience is the foremost motivating factor in
this architecture, it also simplifies the backend, for it means application
data need only be offered in JSON. (JSON was preferred as its simple terseness
is preferable to XML's complex verbosity; furthermore, working with a
JavaScript-based serialization format seems natural, given that both our
client- and server-side code will be written in the language.)

On the client, we chose an architecture based on the Model-View-Controller
pattern. The nature of a GUI application running in a web browser lends itself
naturally to such a structure: the model is simply a thin layer that parses
JSON responses from the server and offers their data through a unified
interface; the view retrieves a template (quite probably in
[Jade](http://jade-lang.com/) format) from the server, then substitutes
externally provided dynamic data for template placeholders and modifies the
DOM to reflect the changed content; and the controller responds to
user-generated events, passing data back and forth between the appropriate
views and models.

The server's UML diagram requires several points of explanation. Firstly, all
model types (e.g., Memo, Discussion, User) inherit from Loadable, which will
offer a unified means of interfacing with the underlying SQLite database.
Loadable will also offer us the possibility of transparently caching data from
repeated SQL queries. Every Loadable instance will be assigned a unique ID
value that will allow it to be easily referenced by other objects in the
system. This will permit, for example, a particular discussion to be associated
with and linked back to a memo, enabling users to converse about the topic.
Secondly, for each model type, we will have an associated Registry that is
aggregated from individual instances of the corresponding model. As a result,
the system will easily be able to query for all model objects in the system, or
to select only a subset based on criteria such as type or creation date.
