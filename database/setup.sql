DROP TABLE IF EXISTS meets;
DROP TABLE IF EXISTS attributes;
DROP TABLE IF EXISTS sections;
DROP TABLE IF EXISTS terms;
DROP TABLE IF EXISTS instructors;

CREATE TABLE IF NOT EXISTS terms (
  code                 CHAR(6),
  name                 VARCHAR(32)
);

CREATE TABLE IF NOT EXISTS sections (
  id                   SERIAL PRIMARY KEY,
  crn                  VARCHAR(8) NOT NULL,
  term                 VARCHAR(8) NOT NULL,
  subject              VARCHAR(8) NOT NULL,
  number               VARCHAR(8) NOT NULL,
  name                 VARCHAR(8) NOT NULL,
  title                VARCHAR(128) NOT NULL,
  description          TEXT,
  credits_lab_low      INT,
  credits_lab_high     INT,
  credits_lecture_low  INT,
  credits_lecture_high INT
);

CREATE TABLE IF NOT EXISTS meets (
  id                   SERIAL PRIMARY KEY,
  crn                  VARCHAR(8) NOT NULL,
  days                 VARCHAR(8),
  room_number          VARCHAR(8),
  building_code        VARCHAR(8),
  building_name        VARCHAR(32),
  start_time           VARCHAR(8),
  end_time             VARCHAR(8),
  start_date           VARCHAR(16),
  end_date             VARCHAR(16)
);

CREATE TABLE IF NOT EXISTS instructors (
  id                   SERIAL PRIMARY KEY,
  crn                  VARCHAR(8) NOT NULL,
  first                VARCHAR(64) NOT NULL,
  last                 VARCHAR(64) NOT NULL,
  prefix               VARCHAR(4),
  is_primary           BOOLEAN
);

CREATE TABLE IF NOT EXISTS attributes (
  id                   SERIAL PRIMARY KEY,
  crn                  VARCHAR(8) NOT NULL,
  code                 VARCHAR(8),
  description          VARCHAR(32)
);
