Testing Strategy
================

Feature Testing
---------------

###### What testing strategy will we use?

On the server, we will endeavor to perform automated unit testing of every
module. Tests must be developed concurrently alongside code, with developers
required to submit tset code simultaneously alongside application code when
pushing new commits to Github. (This does not, however, require that the
developer pursue a test-driven-development approach -- he may pursue whatever
approach he prefers, whether it be TDD or writing tests ex post facto.) New
features must be accompanied by unit tests that demonstrate proper function,
both in expected and erroneous scenarios. Bug fixes must have unit tests that
the bug in question will not recur at a later time, and that any potential bugs
similar in nature will never be introduced. For example, if the developer fixes
a bug in which discussions with empty titles were permitted, he must provide
test code that ensures not only that such discussions may not be created in the
future, but also that memos with empty titles can never be created.

On the client, if time permits, we will develop an automated test suite that
encompasses both unit and integration testing. Failing this, we will rely on
manual integration testing to ensure compliance with the system's iteration plan
and to eliminate functional defects.


###### What tools will we use?

On the server, we will utilize the Node.js testing framework
[Mocha](http://visionmedia.github.com/mocha/). If time permits, we will use
[Github's post-receive hooks](http://help.github.com/post-receive-hooks/) to
automatically execute our test suite when new commits are pushed, then e-mail
the development team if any tests fail. On the client, if time permits us to
develop an automated test suite, we will use
[Selenium](http://seleniumhq.org/).


###### What test coverage will we require?

We will endeavor to achieve 100% test coverage, meaning that every line of
application code is executed at least once by our automated test suite. Such a
strategy is all the more important in a weakly typed, interpreted language such
as Javascript, where we rely on our test suite to locate not only high-level
logic-related bugs, but also low-level language-related ones that would be
caught by the compiler in a compiled language, such as errors related to use of
uninitialized variables.


###### How will we generate test cases?

We will use equivalence partioning to reduce the number of test inputs needed.
Once our equivalence classes are generated, we will select "expected" values
from within them, as well as utilizing boundry testing to choose potentially
bug-exposing values from the edges of the classes.

For example, in testing the authentication system, we might generate four
equivalence classes: users with valid usernames and passwords, users with valid
usernames but invalid passwords, users with invalid usernames but valid
passwords, and users with invalid usernames and invalid passwords. Then, from
within the "valid username but invalid password" class, we might select an
invalid eight-character password as a typical value, but also boundry test using
an empty password, a password consisting of three-hundred characters, and a
password consisting of nothing but twenty copies of the Unicode snowman
character.


###### How will we test performance?


On the client, performance testing will only be done during integration testing.


System testing
--------------

###### How will we ensure quality of the integrated project?

Due to this project's short development cycle, we will avoid the time-intensive
practice of "bottom-up" integration testing, in which we group the lowest-level
modules together, verify their proper functioning, and then grow the system to
be tested by adding the next lowest level of modules and re-verifying its
function. Instead, we will pursue a "Big Bang" approach in which we form entire
systems (e.g., the Discussion system) from their modules and then test these.
Given that our final system's code base will likely not exceed one-thousand
lines, and that we will have extensive unit test coverage to test individual
modules, this approach minimizes testing effort while maximizing the
probability that bugs resulting from the interactions between two components
will be exposed.

Our "Big Bang" integration tests will be driven by usage model testing, in
which our test cases are derived from use cases, such as those described in our
requirements document. Such an approach will ensure that our test usage closely
models expected use of the deployed system, and thus maximizes the chance that
our tests will locate bugs that system users are likely to encounter. Though
our integration testing will be carried out manually, we will formalize our
test suite by writing out each test case, and then running through each
(insofar as the system's state of compleion permits) on a weekly basis. With
the three-week development cycle, this means that the tests will be carried out
at the ends of the first and second development weeks, followed by an
exhaustive test battery at the third week's close, prior to system delivery.


###### What performance metrics must be met?

Our thin-server approach will be amenable to automated performance testing, as
the server will respond to only a small set of requests, never serving anything
more than a JSON document (except, of course, for the initial index request
necessary to construct the overall client-side application environmenet). To
perform these automated tests, we will use our server-side unit test suite to invoke
Apache Bench, parsing the results to ensure the performance metrics described in
our requirements document are met (i.e., a sub-500 ms response time when serving
20 requests per second).

Given the thick-client nature of our project, the server is far from the lone
factor in determining performance, with the client exerting a substantial
(perhaps dominant) effect on performance. Automated testing of client
performance, however, is excessively complex for our short development period.
As such, we will perform manual client testing by settling on a standardized
configuration (e.g., a given computer running a given operating system and
browser, with the Node server running locally), setting target load times for
each page (with allowances permitted for more complex ones), and then
monitoring the page load time through the browser's development tools (e.g.,
Chrome's Web Inspector). These performance tests will be repeated as part of
our weekly integration testing cycle.


###### How many bugs can we have open at the end of development?

As our project's code base is small, number of developers is few, and
development cycle is short, we might expect to fully resolve all bugs, leaving
zero open at development's end. Even in a relatively modest project such as
ours, however, we might encounter subtle bugs whose impact is sufficiently
minimal so as to render excessive the effort required to resolve them. Thus, we
shall permit a low number -- perhaps less than ten -- of open, low-priority
bugs to remain open when we deliver our initial system revision. We shall
endeavor, however, to close all medium- and high-priority bugs.
