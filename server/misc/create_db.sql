PRAGMA foreign_keys = ON;

CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  username TEXT NOT NULL,
  name TEXT NOT NULL,
  pwhash TEXT NOT NULL,
  pwsalt TEXT NOT NULL,
  userType INTEGER NOT NULL,
  creationDate INTEGER NOT NULL,
  locked INTEGER NOT NULL
);

CREATE TABLE sessions (
  userID INTEGER NOT NULL,
  token TEXT NOT NULL,
  FOREIGN KEY(userID) REFERENCES users(id)
);

CREATE TABLE memos (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  posterID INTEGER NOT NULL,
  postDate INTEGER NOT NULL,
  content TEXT NOT NULL,
  FOREIGN KEY(posterID) REFERENCES users(id)
);

CREATE TABLE unreadMemos (
  memoID INTEGER,
  userID INTEGER,
  FOREIGN KEY(memoID) REFERENCES memos(id),
  FOREIGN KEY(userID) REFERENCES users(id)
);

CREATE TABLE posts (
  id INTEGER PRIMARY KEY,
  posterID INTEGER NOT NULL,
  postDate INTEGER NOT NULL,
  content TEXT NOT NULL,
  discussionID INTEGER NOT NULL,
  FOREIGN KEY(posterID) REFERENCES users(id),
  FOREIGN KEY(discussionID) REFERENCES discussions(id)
);

CREATE TABLE discussions (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  rootPostID INTEGER NOT NULL,
  tags TEXT NOT NULL,
  FOREIGN KEY(rootPostID) REFERENCES posts(id)
);

CREATE TABLE unreadDiscussions (
  discussionID INTEGER,
  userID INTEGER,
  lastRead INTEGER,
  FOREIGN KEY(discussionID) REFERENCES discussions(id),
  FOREIGN KEY(userID) REFERENCES users(id)
);
