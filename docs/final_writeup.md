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

Just as our feature set narrowed, so too did our test plan. At development's outset, we planned
to perform extensive automated testing on the server and manual (though regular and structured)
testing on the client. At first, we even toyed with the notion of investigating Selenium for
automated cilent-side testing, but quickly discarded this idea once the extreme time pressures of
the development cycle became apparent.

Though we did experience success with our server-side unit testing, our coverage was less
considerable than planned --- we ended up with tests focused on memo and discussion functionality,
largely ignoring authentication and the administration panel. This shortcoming resulted from the
tremendous time investment required to develop our own testing infrastructure. While "full-stack"
web development frameworks such as Ruby on Rails and Django ship with tightly integrated
unit-testing and fixture-loading functions, Node is much more agnostic as to technology choice.
Thus, we had to seek out a test framework; even once we settled on Mocha, we had to work to
integrate it with the rest of the project. Even then, Mocha provided no support for loading fixtures
as a means of putting the database into a known state before undertaking tests, meaning that we had
to develop our own fixture-loading framework. This imposed challenges of its own --- our initial
implementation had the testing framework interfacing directly with the database to load fixture
data, which resulted in errors occurring at irregular intervals relating to database file write lock
contention between the test and server processes. This was all the more aggravating given the
assurances provided by the SQLite documentation that multiple processes could readily utilize the
database at the same time; we suspect that the locking behaviour of our chosen Node.js SQLite
bindings may be at fault, with the library being all too eager to obtain a write lock for the
database. After futile hours of debugging, we rewrote our fixture framework to load fixtures by
issuing an HTTP request to the server, which would then load the fixtures itself, eliminating issues
related to multiple processes interfacing directly with the database. (The server's fixture-loading
functionality does, of course, present a security risk, and is thus active only in the test
environment.) In this fashion, the immaturity of the Node ecosystem stymied our testing efforts ---
some team members spent an undue amount of time building essential "plubming" functionality such as
fixture loading that is provided out-of-the-box in other frameworks, while the frequent interface
changes necessitated by underlying technological challenges hampered other members' ability to write
tests.
