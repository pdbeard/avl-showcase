-- posts table
DROP TABLE IF EXISTS guestbook.posts;
CREATE TABLE guestbook.posts (
    id STRING PRIMARY KEY,
    user OBJECT(STRICT) AS (
        name STRING,
        location GEO_POINT
    ),
    text STRING INDEX USING FULLTEXT WITH (analyzer = 'english'),
    created TIMESTAMP,
    image_ref STRING,
    like_count LONG
) WITH (number_of_replicas = '0-2');

-- countries table
DROP TABLE IF EXISTS guestbook.countries;
CREATE TABLE guestbook.countries (
    id STRING PRIMARY KEY,
    name STRING PRIMARY KEY,
    geometry GEO_SHAPE
) WITH (number_of_replicas='0-2');

-- images blob table
DROP BLOB TABLE IF EXISTS guestbook_images;
CREATE BLOB TABLE guestbook_images
WITH (number_of_replicas='0-2');

-- custom text analyzer
CREATE ANALYZER myanalyzer (
  TOKENIZER standard,-- or try edge_ngram for suggest-type search
  TOKEN_FILTERS (
    lowercase,
    stop,
    kstem,
    synonym WITH (
      synonyms = [
        'u s a,united states,united states of america => usa',
        'i-pod, i pod => ipod'
      ]
    )
  )
);

-- projects table
DROP TABLE IF EXISTS showcase.projects;
CREATE TABLE showcase.projects (
    id STRING INDEX OFF PRIMARY KEY,
    title STRING INDEX USING FULLTEXT WITH (analyzer = 'myanalyzer'),
    description STRING INDEX USING FULLTEXT WITH (analyzer = 'myanalyzer'),
    year STRING,
    url STRING,
    campus_ids ARRAY(INTEGER),
    tags ARRAY(STRING)
) WITH (number_of_replicas = 0);

-- campuses table
DROP TABLE IF EXISTS showcase.campuses;
CREATE TABLE showcase.campuses (
  id INTEGER,
  name STRING
) WITH (number_of_replicas = 0);
