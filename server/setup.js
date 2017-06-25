module.exports = `
  CREATE TABLE IF NOT EXISTS staging (
    data                 json NOT NULL
  );

  CREATE TABLE IF NOT EXISTS terms (
    id                   SERIAL PRIMARY KEY,
    code                 CHAR(6),
    name                 VARCHAR(32),
    start_date           DATE,
    end_date             DATE
  );

  CREATE TABLE IF NOT EXISTS sections (
    id                   SERIAL PRIMARY KEY,
    subject              VARCHAR(3) NOT NULL,
    number               VARCHAR(4) NOT NULL,
    name                 VARCHAR(2) NOT NULL,
    title                VARCHAR(64) NOT NULL,
    credits_lab_low      UNSIGNED INT,
    credits_lab_high     UNSIGNED INT,
    credits_lecture_low  UNSIGNED INT,
    credits_lecture_high UNSIGNED INT,
    start_date           DATE,
    term_id              INT REFERENCES terms NOT NULL,
    instructor_id        INT REFERENCES instructors NOT NULL
  );

  CREATE TABLE IF NOT EXISTS meets (
    id                   SERIAL PRIMARY KEY,
    days                 VARCHAR(7),
    room_number          VARCHAR(8),
    room_code            VARCHAR(8),
    room_name            VARCHAR(32),
    start_time           TIME,
    end_time             TIME,
    start_date           DATE,
    end_date             DATE
  );

  CREATE TABLE IF NOT EXISTS instructors (
    id                   SERIAL PRIMARY KEY,
    name                 VARCHAR(64) NOT NULL,
    prefix               VARCHAR(4)
  );

  CREATE TABLE IF NOT EXISTS attributes (
    id                   SERIAL PRIMARY KEY,
    code                 VARCHAR(8),
    description          VARCHAR(32),
    section_id           INT REFERENCES sections NOT NULL
  );
`
