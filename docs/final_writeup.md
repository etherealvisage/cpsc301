Project Evolution
=================

While developing Pynx, the most surprising element was just how much interpersonal communication was
required to coordinate development efforts, as will be discussed in the subsequent section. This in
turn reduced the amount of time team members had to do work reflected directly in the end product,
inhibiting our ability to deliver on the full set of features we planned for our first iteration.
The harried pace and short development cycle meant that little formal prioritizing of features was
required --- the fundamental aspects of the system on which other features depended were developed
first, with peripheral functionality largely ignored until necessary. As a result, several features
both large and small that we had previously seen as integral to the system were dropped, including
tagging of discussion posts, pagination of discussion topics, and notification of new memos. This
last feature's necessity was obviated as a result of our narrowing scope --- while we had initially
planned to show the user a "dashboard" overview of relevant activity, we decided that the amount of
information presented by the system's current incarnation is sufficiently humble as to render this
function unnecessary. Instead, we directed the user to the memos listing upon logging in, removing
the need for an explicit memo notification system.

Just as our feature set narrowed, so too did our test plan. At development's outset, we planned to
perform extensive automated testing on the server and manual (though regular and structured) testing
on the client. At first, we even toyed with the notion of investigating Selenium for automated
cilent-side testing, but quickly discarded this idea once the extreme time pressures of the
development cycle became apparent. Though our intent was to perform scheduled manual testing of the
client, this too slipped --- instead, we found our meetings frequent enough and our feature set
sufficiently paltry that working through newly added functionality as a group was sufficient.
Additionally, though we at first endeavored to perform automated performance testing of the server,
lack of time and logistical concerns related to establishing acceptable performance metrics
prevented our doing so.

Though we did experience success with our server-side unit testing, our coverage was less
considerable than planned --- we ended up with tests focused on memo and discussion functionality,
largely ignoring authentication and the administration panel. This shortcoming resulted from the
tremendous time investment required to develop our own testing infrastructure. While "full-stack"
web development frameworks such as Ruby on Rails and Django ship with tightly integrated
unit-testing and fixture-loading functions, Node is much more agnostic as to technology choice.
Thus, we had to seek out a test framework; even once we settled on Mocha, we had to work to
integrate it with the rest of the project.

Mocha's greatest shortcoming was its lack of support for loading fixtures as a means of putting the
database into a known state before undertaking tests, meaning that we had to develop our own
fixture-loading framework.  This imposed challenges of its own --- our initial implementation had
the testing framework interfacing directly with the database to load fixture data, which resulted in
errors occurring at irregular intervals relating to database file write lock contention between the
test and server processes.  This was all the more aggravating given the assurances provided by the
SQLite documentation that multiple processes could readily utilize the database at the same time; we
suspect that the locking behaviour of our chosen Node.js SQLite bindings may be at fault, with the
library being all too eager to obtain a write lock for the database. After futile hours of
debugging, we rewrote our fixture framework to load fixtures by issuing an HTTP request to the
server, which would then load the fixtures itself, eliminating issues related to multiple processes
interfacing directly with the database. (The server's fixture-loading functionality does, of course,
present a security risk, and is thus active only in the test environment.) In this fashion, the
immaturity of the Node ecosystem stymied our testing efforts --- some team members spent an undue
amount of time building essential "plubming" functionality such as fixture loading that is provided
out-of-the-box in other frameworks, while the frequent interface changes necessitated by underlying
technological challenges hampered other members' ability to write tests.


Project Lessons
===============

The most surprising lesson imparted by this project was just how much time is required to coordinate
efforts of multiple team members. As none of us had before worked with more than one person, the
difficulty of reconciling the products of five people's labours came as a revelation. Compounding
the problem was the divergent skill sets of each member --- while some had past experience with web
development, others were entirely new to the field. Though our summed development hours totalled
only 75 hours, at the low end of our estimated 74 to 122 hour range, the time we spent conversing
with one another added considerably to this total. Through each week of the project, we met at least
three times per week; in several of those weeks, we came together every day, pushing the time we
spent meeting in person to perhaps 30 or 35 hours across the project's length. In addition to this
extensive in-person time, we often collaborated online over the weekends, making use of IRC and a
web-based discussion group. Most surprising was just how much higher interpersonal bandwidth is in
person rather than online --- explaining a problem or demonstrating a technique is much more easily
accomplished in the flesh, for it allows both parties to hone in more quickly on a mutual
understanding.

For project members without past experience in web development, the gamut of technologies they had
to learn was overwhelming. Though the course's labs provided a grounding in Node and Javascript,
building a full-fledged application required that team members be competent with a bevy of
additional technologies, ranging from the SQLite database library, to the Express web framework, to
the Mocha testing framework, to the Backbone.js "thick-client" framework, to jQuery. While more
seasoned team members worked frantically to establish a technical base, those unfamiliar with these
technologies scrambled to familiarize themselves with the technologies' essentials, often feeling
lost and unsure of what work to pursue. A more effective organizational strategy might well have
been to appoint a single leader responsible for ensuring that every team member could contribute
effectively at all points of the project, rather than relying on a bottom-up, self-organizing
strategy.

Most frustrating through the project was the immaturity of the Node.js ecosystem. While full-stack
frameworks such as Rails and Django impose their preferences on you, forcing you to conform to a set
of "best practices" established by developers well-versed in the field, Node left us largely to our
own devices. Despite some team members having previous web development experience, we still found
ourselves floundering during the project's early days. We initially resolved to write our own server
from the ground up, basing it on the past structure of one member's lab assignment; the substantial
amount of work required for such elemental tasks as cookie parsing, however, soon forced us to
consider a more robust solution. Though we promptly switched to the Express framework, this change
obsoleted the team's understanding of the server, requiring each member to learn anew. The
afore-elucidated troubles relating to fixture development serve as a splendid example of the
frustrations engendered by Node's minimalist philosophy; had management not imposed the Node.js
choice on us, we likely would have sought out a framework offering a richer set of building blocks.

Our team's most ambitious decision was to pursue a thick-client approach. We deemed this methodology
prefereable to the traditional thin-client philosophy prevalent in web applications, in which the
server provides fully-rendered HTML pages and little code executes on the client, as it would enable
a richer, lower-latency interface. Also attractive was the potential of this approach to simplify
our server-side functionality --- given Node's minimal tool set, any means of reducing the server's
complexity seemed ideal. This plan of attack worked surprisingly well, with our finished server
providing only a single static HTML page used to "bootstrap" the application, and all dynamic data
returned in JSON format. The server's complexity was indeed minimized, with us able to ignore issues
such as template libraries, given that we never rendered anything not in JSON format. Additionally,
the client-side interface became exceedingly responsive, as no full page reloads are required at any
point of our application's use. Despite this, convention-breaking issues with which early rich
application had to content, such as the lack of unique URLs associated with each page and the
crippling of the browser's back and forward buttons, are overcome through our use of HTML5. Of
course, these benefits came at the cost of increasing the amount of background knowledge required by
team members before they could contribute to development, but given the end product's effectiveness,
we believe this trade-off was worthwhile.

When we reflect on the sum total of our experiences through this project, most interesting are not
the lessons learned regarding technology, such as the worth of pursuing rich-cilent interfaces or
the frustration of writing one's own fixture library, but those that relate to the interactions of
individuals composing a team. Though we are all competent as individual developers, integrating our
efforts to produce cohesive progress as a team presented novel challenges. The difficulties of
interpersonal communication are never more apparent than when we reflect on the amount of time
required to coordinate our efforts -- in our final analysis, we spent nearly half as much time
simply designing and discussing the system as we did writing it. As little real-world software is
written in isolation, however, these lessons, no matter how hard-won, will serve us well in our
eventual careers.


* Major product decisions:
  * Switched to server-side framework
  * Cut a number of features:
    * No memo pane UI
    * No new notification of memos -- no Dashboard
    * No pagination
    * No tagging
  * Changed test plan:
    * Less formal client testing
    * No performance testing
* What we learned:
  * Hard for new members to pick up technologies
  * High overhead to working together
    * Met almost every day
    * Bandwidth much higher in person than online
    * System evolved radically -- obsoleted knowledge
  * Leadership important -- perhaps dictatorship better?
  * Immaturity of Node
