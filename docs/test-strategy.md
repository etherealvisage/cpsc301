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
the development team if any tests fail. On the client, we will use
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

Our thin-server approach will be amenable to automated performance testing, as
the server will respond to only a small set of requests, never serving anything
more than a JSON document (except, of course, for the initial index request
necessary to construct the overall client-side application environmenet). To
perform these automated tests, we will use our server-side test suite toinvoke
Apache Bench, parsing the results to ensure the performance metrics described in
our requirements document are met (i.e., a sub-500 ms response time when serving
20 requests per second).

On the client, performance testing will only be done during integration testing.



Integration testing: must be fleshed out
  How will we ensure quality of integrated project?
    Rather than doing integration testing of progressively larger number of modules, take "Big Bang" approach:
      Rely on continuous individual unit tests to drive individual component quality
      Perform usage model testing, in which test cases driven by real-world tasks
        More likely to locate bugs that users will encounter, that result from interactions fo coponets
        Have test cases written out; perform once per week, and when major changes made to modules -- driven by use cases
        e.g.:
          1. User U logs into system S.
          2. U navigates to Discsussions.
          3. ...
    
  What scenarios must work?

  What performance metrics must be met?
    Server performance ensured by unit tests, but thick-client approach means that server response time is far from lone factor in determining perf
    Thus, perform manual perf tests on client -- when performing individual integration tests, use Chrome's Web Inspector to ensure overall page generation time does not exceed supplied metric (e.g., 500 ms)

  How many bugs can we have open?
    Given size of code base, realistic to have 0 bugs open
      But given tight deadlines, having low-proirity bugs open at end of project OK -- just no medium or high bugs
