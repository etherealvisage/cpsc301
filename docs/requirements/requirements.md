Requirements
============

User Authentication and Identification
--------------------------------------
1. Users must be able to log in to to the system, from both internal and external networks.

2. Users must be able to authenticate via either the existing keycard authentication system, or via
   a hospital-issued username and password.

3. Users must be able to change their passwords. Upon changing his password, any logged-in sessions
   of the user (save for the one from which he changed his password) will be terminated.

4. Users must be able to upload an avatar image to be associated with their account. All such images
   will adhere to a predefined size. If the provided image is of the incorrect size, the user will
   be given the ability to resize and crop the image so that it matches the system's requirements.

5. No part of the application will be accessible unless the user is authenticated. Attempts to
   access any part of the application while unauthenticated will result in the user being directed
   to the login form.

6. Users must be able to logout of the system from any page. Upon logging out, users will be
   redirected to the login form.

7. Contrary to most web applications, no means will be provided for the user to reset his password
   if he forgets it. Instead, the user must contact the administrator for his password to be reset.

8. Five consecutive failed login attempts will result in an artificial delay of 2 s being applied to
   each subsequent authentication attempt, preventing brute-force attacks. Any such imposed delay
   will be cleared 24 hours after the last failed authentication attempt.


Memos
-----
1. Only administrators will be able to post memos, which shall come in sufficiently low volumes as
   to not impose an excessive administrative burden.

2. Each memo will have associated with it the posting user's name and the date on which it was
   posted.

3. Linked to each memo will be a discussion thread for talking about the memo. The associated
   discussion thread will, in turn, be linked back to its memo.

4. When entering a new memo, the user must be able to enter its title and body. A WYSIWYG editor
   must be provided for the post body.

5. The memo title and body must each contain at least three alphanumeric characters.

5. The user must be able to delete any memo he has posted.

6. The user must have the option of receiving the full contents of new memos via e-mail.

7. The read status of each memo must be tracked for each user. The user must be notified on each
   page when any unread memos exist.

8. The user must be able to "hide" the list of unread memos so that only a small notice
   remains, leaving the user free to carry out other work.


Dashboard
---------
1. Upon logging in, the user must be instantly given an overview of recent activity of potential
   interest. The page presenting this information will be termed the Dahsboard.

2. The Dashboard must display a short listing of both the most recent memos and discussion topics.
   Relevance may be determined by a number of factors, including post date, discussion topic tags,
   and whether the user is subscribed to the topic.


Discussion
----------
1. Users must have the ability to subscribe to or unsubscribe from particular discussion topics.

2. Users must have the ability to subscribe to all discussion topics bearing a given tag.

2. Discussion threads must be displayed in a manner that readily permits multiple simultaneous
   subthreads to be discussed concurrently, with each subthread clearly separated from every other.

3. Discussion threads must permit users to follow even deeply nested conversations.

4. Only a subset of discussion posts must be visible at any given time. (Traditional pagination
   mechanisms may be used to achieve this, or we may rely on "infinte scrolling" pages that have
   additional posts loaded dynamically upon a user's scrolling.)

5. When posting a new discussion, the user must be able to enter the thread title and tags.
   When tagging the discussion, the user must be able to choose multiple tags from a list of the
   most-used tags.The user must also be provided a means of entering the first post for the discussion.

5. Users reading a discussion must be able to add, edit, or delete associated tags so as to provide
   improved discussion metadata.

6. A discussion's title must consist of at least three alphanumeric characters.

7. A post's body must consist of at least three alphanumeric characters.

8. Everu discussion must be associated with at least one tag.

9. When adding a new post, the user must be able to enter the post body using a WYSIWYG editor.

10. The user must have the ability to receive via e-mail the full contents of any posts to subscribed
    discussions.

11. The user must be able to post in a discussion by replying to an e-mail listing a post from
    that discussion.

12. The user must be able to post a new discussion by sending an e-mail to a predefined
    address. The e-mail's subject will indicate the discussion's title; its body will be used as the
    initial post. Some standardized means of describing the tags to be used for the discussion must also
    be established.


General
-------
1. Every object in the system (e.g., discussion thread, discussion post, or memo) will have
   associated with it an unambiguous representation permitting references to it from other system
   elements.


System Administration
---------------------
1. The administrator must be able to add new user accounts. While doing so, she must be able to
   readily add and edit user information.

2. The administrator must be able to change user information, such as username, password, and
   avatar.

3. Each user's name must contain at least three alphanumeric characters. No duplicate usernames will
   be permitted.

4. Each user's password must consist of at least six characters, and must not be a dictionary word.

4. The administrator must be able to delete user accounts, removing the user's ability to use the system
   while preserving any data (e.g., memos and posts) he has entered.

5. The administrator must be able to delete any discussion or post made in the discussion system.

6. The administrator must be able to delete any memo.

7. The administrator must be able to add new memo tags.

8. The administrator must be able to add new discussion tags.


Instant Messaging
-----------------
1. Users must be able to send instant messages to other system users.

2. The user must be presented with a list of users, with each user's online status clearly
   indicated. From the list, the user must be able to message any user regardless of online status.

3. If the user sends a message to an online user, the message will be delivered immediately.

4. If the user sends a message to an offline user, the message will be delivered when the receiving
   user is next online.

5. The user must receive a clear indication of how many unread messages he has from his Dashboard
   upon logging in. From here, he must be able to read and respond to any received messages.


Search
------
1. A search form must be provided on every page.

2. The search form will allow the user to enter multiple search terms. Upon submission, discussion
   posts, memos, and the knowledge base will be searched.

3. A search's results must be displayed alongside the number of results generated.

4. Search results must be broken up, either via pagination or infinite scrolling, to prevent all
   from being displayed simultaneously.

5. When viewing a search results, the user must have the ability to filter by type (e.g., discussion
   post, memo, knowledge base article), date, and any other type-specific criteria. For example, if
   the user filters his results to display only discussion posts, he must further be able to filter
   by post author and tags.


Knowledge Base
--------------
1. The system must provide wiki functionality to permit sharing of information regarding treatment
   procedures.

2. Every wiki article must be editable via a WYSIWYG interface.

3. Any user must be able to add new articles or edit existing ones.


Nonfunctional
-------------
1. The system must be able to serve at least 10 requests per second with a mean response time not
   exceeding 500 ms.

2. The system must be accessible 99.9% of the time. This permits approximately 40 minutes of
   unscheduled downtime per month.

3. All HTML will be compliant with the HTML5 specification.

3. All CSS will be compliant with the CSS3 specification.

3. The system must be compatible with recent versions of modern web browsers. Full compatibility
   with be provided with Google Chrome 17 and Mozilla Firefox 3.6. Attempts will also be made to
   ensure compatibility with recent versions of Safari and Opera.

4. Nightly backups of all system data must be made. Multiple backups will be retained.

5. Backups must be stored on multiple computers distinct from the production server, located in
   physically disparate locations.

6. Every "page" within the application will have its own distinct URL. Any provisions for a
   smoother, ajax-backed interface must ensure that these URLs are made available through the
   browser's address bar to permit easy bookmarking of pages.
