CREATE TABLE account (
  account_id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash BYTEA NOT NULL
);

CREATE TABLE friendInvite (
	invite_id SERIAL PRIMARY KEY,
	initiator_id INT REFERENCES account(account_id) ON DELETE CASCADE NOT NULL,
	invitee_id INT REFERENCES account(account_id) ON DELETE CASCADE NOT NULL,
	message VARCHAR(100),
	request_time TIMESTAMP NOT NULL,
	status INT NOT NULL
);

CREATE TABLE directMessage (
	message_id SERIAL PRIMARY KEY,
	sender_id INT REFERENCES account(account_id) ON DELETE CASCADE NOT NULL,
	receiver_id INT REFERENCES account(account_id) ON DELETE CASCADE NOT NULL,
	content VARCHAR(250) NOT NULL,
	send_time TIMESTAMP NOT NULL,
	read_time TIMESTAMP
);

CREATE TABLE raceleague (
  league_id SERIAL PRIMARY KEY,
  owner_id INT REFERENCES account(account_id) ON DELETE SET NULL,
  name VARCHAR(50) NOT NULL,
  is_public BOOLEAN NOT NULL,
  create_time TIMESTAMP NOT NULL
);

CREATE TABLE raceLeagueMembership (
	league_id INT REFERENCES raceleague(league_id) ON DELETE CASCADE,
	user_id INT REFERENCES account(account_id) ON DELETE CASCADE,
	join_time TIMESTAMP NOT NULL,
	PRIMARY KEY (league_id, user_id)
);

CREATE TABLE leagueInvite (
	invite_id SERIAL PRIMARY KEY,
	league_id INT REFERENCES raceleague(league_id) ON DELETE CASCADE NOT NULL,
	invitee_id INT REFERENCES account(account_id) ON DELETE CASCADE NOT NULL,
	request_time TIMESTAMP NOT NULL,
	status SMALLINT NOT NULL
);

CREATE TABLE track (
	track_id SERIAL PRIMARY KEY,
	name VARCHAR(50) NOT NULL,
	location VARCHAR(100) NOT NULL,
	distance NUMERIC(10, 2) NOT NULL,
	turns INT NOT NULL
);

CREATE TABLE race (
	race_id SERIAL PRIMARY KEY,
	track_id INT REFERENCES track(track_id) ON DELETE CASCADE NOT NULL,
	start_time TIMESTAMP NOT NULL
);

CREATE TABLE ballot (
	ballot_id SERIAL PRIMARY KEY,
	league_id INT REFERENCES raceleague(league_id) ON DELETE CASCADE NOT NULL,
	race_id INT REFERENCES race(race_id) ON DELETE CASCADE NOT NULL,
	user_id INT REFERENCES account(account_id) ON DELETE CASCADE NOT NULL,
	create_time TIMESTAMP NOT NULL,
	settle_time TIMESTAMP
);

CREATE TABLE team (
	team_id SERIAL PRIMARY KEY,
	name VARCHAR(50) NOT NULL,
	nationality VARCHAR(50) NOT NULL,
	create_time TIMESTAMP NOT NULL
);

CREATE TABLE driver (
	driver_id SERIAL PRIMARY KEY,
	driver_number INT NOT NULL,
	first_name VARCHAR(50) NOT NULL,
	last_name VARCHAR(50) NOT NULL,
	age INT NOT NULL,
	nationality VARCHAR(50) NOT NULL,
	height NUMERIC(5, 2) NOT NULL,
	team_id INT REFERENCES team(team_id) ON DELETE SET NULL
);

CREATE TABLE ballotContent(
	ballot_id INT REFERENCES ballot(ballot_id) ON DELETE CASCADE,
	position INT,
	driver_id INT REFERENCES driver(driver_id) ON DELETE SET NULL,
	PRIMARY KEY (ballot_id, position)
);

CREATE TABLE raceResult (
	race_id INT REFERENCES race(race_id) ON DELETE CASCADE,
	position INT,
	driver_id INT REFERENCES driver(driver_id) ON DELETE SET NULL,
	PRIMARY KEY (race_id, position)
);