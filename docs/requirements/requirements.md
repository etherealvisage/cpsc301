Requirements
============

User Authentication and Identification
--------------------------------------
1. **(P0)** Users must be able to log in to to the system, from both internal and external networks.

2. **(P2)** Users must be able to authenticate via either the existing keycard authentication system, or via
   a hospital-issued username and password.

3. **(P1)** Users must be able to change their passwords. Upon changing his password, any logged-in sessions
   of the user (save for the one from which he changed his password) must be terminated.

4. **(P2)** Users must be able to upload an avatar image to be associated with their account. All such images
   must adhere to a predefined size. If the provided image is of the incorrect size, the user must
   be given the ability to resize and crop the image so that it matches the system's requirements.

5. **(P0)** No part of the application will be accessible unless the user is authenticated. Attempts to
   access any part of the application while unauthenticated will result in the user being directed
   to the login form.

6. **(P0)** Users must be able to logout of the system from any page. Upon logging out, users must be
   redirected to the login form.

7. **(P1)** There must be provision for preventing brute-force attacks against the authentication system.

Memos
-----
1. **(P0)** Only administrators will be able to post memos, which shall come in sufficiently low volumes as
   to not impose an excessive administrative burden.

2. **(P0)** Each memo must have associated with it the posting user's name and the date on which it was
   posted.

3. **(P1)** Linked to each memo must be a discussion thread for talking about the memo. The associated
   discussion thread must, in turn, be linked back to its memo.

4. **(P0)** When entering a new memo, the user must be able to enter its title and body. A WYSIWYG editor
   must be provided for the post body.

5. **(P0)** The memo title and body must not be empty.

6. **(P1)** The user must be able to delete any memo he has posted.

7. **(P2)** The user must have the option of receiving the full contents of new memos via e-mail.

8. **(P1)** The read status of each memo must be tracked for each user. The user must be notified on each
   page when any unread memos exist.

9. **(P0)** The user must be able to "hide" the list of unread memos so that only a small notice
   remains, leaving the user free to carry out other work.


Dashboard
---------
1. **(P0)** Upon logging in, the user must be instantly given an overview of recent activity of potential
   interest. The page presenting this information must be termed the Dashboard.

2. **(P0)** The Dashboard must display a short listing of both the most recent memos and discussion topics.
   Relevance may be determined by a number of factors, including post date, discussion topic tags,

Discussion
----------
1. **(P1)** Users must have the ability to subscribe to or unsubscribe from particular discussion topics.

2. **(P2)** Users must have the ability to subscribe to all discussion topics bearing a given tag.

3. **(P2)** Discussion threads must be displayed in a manner that readily permits multiple simultaneous
   subthreads to be discussed concurrently, with each subthread clearly separated from every other.

4. **(P2)** Discussion threads must permit users to follow even deeply nested conversations.

5. **(P0)** Only a subset of discussion posts must be visible at any given time.

6. **(P0)** When posting a new discussion, the user must enter the thread title, the first post,
   and at least one tag.

7. **(P2)** Users reading a discussion must be able to add, edit, or delete associated tags.

8. **(P0)** A discussion must have a non-empty title.

9. **(P0)** A discussion post's body be non-empty.

10. **(P1)** Every discussion must be associated with at least one tag.

11. **(P2)** When adding a new post, the user must be able to enter the post body using a WYSIWYG editor.

12. **(P2)** The user must have the ability to receive via e-mail the full contents of any posts to subscribed
    discussions.

13. **(P2)** The user must be able to post in a discussion by replying to an e-mail listing a post from
    that discussion.

14. **(P2)** The user must be able to post a new discussion by sending an e-mail to a predefined
    address. The e-mail's subject must indicate the discussion's title; its body must be used as the
    initial post. Some standardized means of describing the tags to be used for the discussion must also
    be established.


System Administration
---------------------
1. **(P0)** The administrator must be able to add new user accounts. While doing so, she must be able to
   readily add and edit user information.

2. **(P1)** The administrator must be able to change user information, such as username, password, and
   avatar.

3. **(P0)** Each user's name must be non-empty.

4. **(P0)** No duplicate usernames will be permitted.

5. **(P0)** Each user's password must consist of at least six characters.

6. **(P2)** Each user's password must not be a dictionary word.

7. **(P1)** The administrator must be able to delete user accounts, removing the user's ability to use the system
   while preserving any data (e.g., memos and posts) he has entered.

8. **(P1)** The administrator must be able to delete any discussion or post made in the discussion system.

9. **(P1)** The administrator must be able to delete any memo.

10. **(P2)** The administrator must be able to add new memo tags.

11. **(P2)** The administrator must be able to add new discussion tags.


Instant Messaging
-----------------
1. **(P1)** Users must be able to send instant messages to other system users.

2. **(P2)** The user must be presented with a list of users, with each user's online status clearly
   indicated. From the list, the user must be able to message any user regardless of online status.

3. **(P1)** If the user sends a message to an online user, the message must be delivered immediately.

4. **(P2)** If the user sends a message to an offline user, the message must be delivered when the receiving
   user is next online.

5. **(P2)** The user must receive a clear indication of how many unread messages he has from his Dashboard
   upon logging in. From here, he must be able to read and respond to any received messages.


Search
------
1. **(P1)** A search form must be provided on every page.

2. **(P1)** The search form must allow the user to enter multiple search terms. Upon submission, discussion
   posts, memos, and the knowledge base must be searched.

3. **(P2)** Search results must be broken up, either via pagination or infinite scrolling, to prevent all
   from being displayed simultaneously.

4. **(P2)** When viewing a search results, the user must have the ability to filter by type (e.g., discussion
   post, memo, knowledge base article), date, and any other type-specific criteria. For example, if
   the user filters his results to display only discussion posts, he must further be able to filter
   by post author and tags.


Knowledge Base
--------------
1. **(P2)** The system must provide wiki functionality to permit sharing of information regarding treatment
   procedures.

2. **(P2)** Every wiki article must be editable via a WYSIWYG interface.

3. **(P2)** Any user must be able to add new articles or edit existing ones.


Nonfunctional
-------------
1. **(P0)** The system must be able to serve pages with a mean response time not exceeding 500 ms under
   reasonable load.

2. **(P0)** The system must be accessible 99.9% of the time. This permits approximately 40 minutes of
   unscheduled downtime per month.

3. **(P2)** All HTML must be compliant with the HTML5 specification.

4. **(P2)** All CSS must be compliant with the CSS3 specification.

5. **(P0)** The system must be compatible with recent versions of modern web browsers. Full compatibility
   must be provided with Google Chrome 17 and Mozilla Firefox 3.6. Attempts must also be made to
   ensure compatibility with recent versions of Safari and Opera.

6. **(P2)** Nightly backups of all system data must be made. Multiple backups must be retained.

7. **(P2)** Backups must be stored on multiple computers distinct from the production server, located in
   physically disparate locations.

8. **(P2)** Every "page" within the application must have its own distinct URL. Any provisions for a
   smoother, ajax-backed interface must ensure that these URLs are made available through the
   browser's address bar to permit easy bookmarking of pages.

9. **(P2)** Five consecutive failed login attempts must result in an artificial delay of 2 s being applied to
   each subsequent authentication attempt, preventing brute-force attacks. Any such imposed delay
   must be cleared 24 hours after the last failed authentication attempt.

10. **(P0)** Every object in the system (e.g., discussion thread, discussion post, or memo) must have
    associated with it an unambiguous representation permitting references to it from other system
    elements.
