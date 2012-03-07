Use Cases
=========

Use Case 1
----------
* Summary: system user U replies to an existing discussion with a new post P
* Actor: U
* Preconditions: U is logged into the system and is viewing an existing discussion D
* Postconditions: new post P will be visible to all other users of S
* Main success scenario:
    1. U selects the "Reply" function adjacent to any post in D.
    2. S serves U a page with controls permitting entry of a post body and list of tags.
    3. U enters the post body and at least one tag.
    4. U submits the completed form.
    5. S saves U's post to the data store, along with a reference to the post to which it is a reply.


Use Case 2
----------
* Summary: system user U edits an existing discussion post P
* Actor: U
* Precondition: U is logged in and viewing a discussion in which U has authored a given post P
* Postcondition: U's edited post P' will be visible to all other users of S
* Main success scenario:
    1. U selects the "Edit post" function provided alongside P.
    2. S serves U a page with editable copies of P's body and tags.
    3. U makes modification to P's body and/or tags.
    4. U activates the "Save post" function.
    5. S saves the modified post to the data store, resulting in edited post P'.


Use Case 3
----------
* Summary: system user U views list of most popular discussion threads
* Actor: U
* Preconditions: U is logged in to the system S
* Postconditions: a rendered list of the most popular discussion threads has been served to U by S
* Main success scenario:
    1. U selects "Discussions" in the global navigation visible on every page.
    2. S determines the most popular discussions using criteria such as number and frequency of posts.
    3. S returns to U a page containing this list of most popular discussions.


Use Case 4
----------
* Summary: system user U authenticates with system via username and password
* Actor: U
* Preconditions: U is unauthenticated
* Postconditions: U is authenticated with system S
* Main success scenario:
    1. Upon trying to access application, U is presented with login form by S.
    2. U enters e-mail address and password into corresponding fields.
    3. U submits form, hashing password before sending across network.
    4. U's e-mail address and password hash match established user, so S creates new session for U, sets cookie corresponding to session on U's browser, and sends U to dashboard.
    5. Dashboard renders in U's browser. U begins using S.
* Alternate flow A:
    a. At Step 4, e-mail address and/or password does not match existing user.
    b. S re-renders login form with corresponding error message.
    c. Resume at Step 2.


Use Case 5
----------
* Summary: system user U authenticates with system S via keycard
* Actor: U
* Preconditions: U is unauthenticated with S. U possesses valid keycard K and is using a computer with a keycard reader.
* Postconditions: U is authenticated with S
* Main success scenario:
    1. U inserts K into hardware reader.
    2. U's system recognizes K's insertion and launches the web browser.
    3. The browser automatically submits a login request to S using K's credentials.
    4. S creates a new session for U, sets cookie corresponding to session on U's browser, and sends U to the dashboard.
    5. Dashboard renders in U's browser. U begins using S.


Use Case 6
----------
* Summary: user U searches system S
* Actor: U
* Preconditions: U is authenticated with S.
* Postconditions: U has received results for the search.
* Main success scenario:
    1. U enters search terms into search bar.
    2. S searches through data store for discussions and memos matching search terms.
    3. S sends search results page to U's browser.
* Alternate flow A:
    a. At Step 3, after receiving the search results, U chooses to filter them.
    b. U filters the results based on author, date, tag, and perhaps other criteria.
    c. S renders the filtered search results.
* Alternate flow B:
    a. At Step 3, no search results are returned by S.
    b. U enters new search terms into search bar at the page's top.
    c. Resume execution at Step 2.


Use Case 7
----------
* Summary: U views archived memos
* Actor: U
* Preconditions: U is authenticated with S
* Preconditions: U receives a list of archived memos.
* Main success scenario:
    1. U selects \`Memos' from global navigation menu.
    2. S generates list of memos and sends resulting page to U.


Use Case 8
----------
* Summary: system administrator A creates new account for user U
* Actor: A
* Stakeholders: A, U
* Preconditions: A is authenticated with system S and U has no existing account on S
* Postconditions: U has a new account with S
* Main success scenario:
    1. A selects \`Admin' from global navigation menu.
    2. A selects "Create new user" functionality and is presented with a form to create a new user.
    3. A enters U's name, e-mail address, and other associated information.
    4. A submits the completed form.
    5. S validates U's information
    6. S writes it to the data store.
    7. S sends activation e-mail to U.
    8. U navigates to link provided in activation e-mail.
    9. S allows U to enter password for U's account.
* Alternate flow A:
    a. At Step 5, S determines U's information to be invalid.
    b. S prompts A to correct U's information.
    c. A enters correct information for U and submits form.
    d. Resume execution at Step 6.


Use Case 9
----------
* Summary: system administrator A locks account of user U
* Actor: A
* Stakeholders: A, U
* Preconditions: A is authenticated with system S and U is a valid, active user
* Postconditions: U may no longer authenticate with S
* Main success scenario:
    1. A selects \`Admin' from global navigation menu.
    2. A selects "Access control" functionality.
    3. S lists all registered users and their access status.
    4. A locates U in list, then un-checks "Active" box next to U.
    5. S is notified of U's status change.


Use Case 10
-----------
* Summary: user U reads unread memo M
* Actor: U
* Preconditions:
    1. U is authenticated
    2. Unread memos exist on the system S
    3. U has not previously selected to hide M
* Postconditions: M is marked as read by U
* Main success scenario:
    1. U loads a page on S.
    2. S determines U has not read M.
    3. S displays a notification listing M's title and author.
    4. U selects to read M.
    5. M expands such that its body is visible.
    6. U reads M.
    7. S records that U has read M.
    8. On subsequent interactions, M is no longer displayed as unread to U.
* Alternate flow A:
    a. At Step 4, U selects to hide M's unread notification rather than read M.
    b. M's unread notificiation for U disappears.
