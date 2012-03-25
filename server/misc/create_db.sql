CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  username TEXT NOT NULL,
  name TEXT NOT NULL,
  pwhash TEXT NOT NULL,
  pwsalt TEXT NOT NULL
);

CREATE TABLE sessions (
  token TEXT NOT NULL PRIMARY KEY,
  uid INTEGER NOT NULL
);

CREATE TABLE memos (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  postDate DATETIME,
  content TEXT NOT NULL
);

CREATE TABLE discussions (
  id INTEGER PRIMARY KEY,
  title TEXT
);
