CREATE TABLE memos (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  postDate DATETIME NOT NULL,
  content TEXT NOT NULL
);

CREATE TABLE discussions (
  id INTEGER PRIMARY KEY,
  title TEXT
);
