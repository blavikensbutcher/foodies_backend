-- Favorites existed twice: `_RecipeLikes` was written by the API while
-- `_UserFavorites` was the one being counted. Keep `_UserFavorites`,
-- carry over whatever was already liked, and drop the duplicate.

INSERT INTO "_UserFavorites" ("A", "B")
SELECT "A", "B" FROM "_RecipeLikes"
ON CONFLICT DO NOTHING;

DROP TABLE "_RecipeLikes";
