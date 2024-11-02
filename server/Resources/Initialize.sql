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
	settle_time TIMESTAMP,
	score INT NULL
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
	team_id INT REFERENCES team(team_id) ON DELETE SET NULL,
	headshot_path VARCHAR(255) NOT NULL, -- Path to the image file in the repository
	car_image_path VARCHAR(255) NOT NULL -- Path to the image file in the repository
);

CREATE TABLE ballotContent(
	ballot_id INT REFERENCES ballot(ballot_id) ON DELETE CASCADE,
	position INT,
	driver_name VARCHAR(50) NULL,
	PRIMARY KEY (ballot_id, position)
);

CREATE TABLE raceResult (
	race_id INT REFERENCES race(race_id) ON DELETE CASCADE,
	position INT,
	driver_id INT REFERENCES driver(driver_id) ON DELETE SET NULL,
	PRIMARY KEY (race_id, position)
);

/* 
   **ChatGPT generated test data**
   **slightly modified to keep consistency of foreign keys**

   Prompt:

   "the following is my postgresql initalize script. Please review the schema, 
   and create additonal lines in the initialize script to create 5 rows of test data in each table:
   
   [copy/paste of initialize script from lines 1-104]"
*/

-- Insert test data for account table
INSERT INTO account (username, first_name, last_name, email, password_hash)
VALUES 
  ('admin', 'Dominic', 'Goncalves', 'dgonc99@gmail.com', '15ee03dd2ee557c4209759937d210613a2aaa6df20d26fda470227ca3c248b86'),
  ('user2', 'Jane', 'Smith', 'jane.smith@example.com', 'hash2'),
  ('user3', 'Bob', 'Brown', 'bob.brown@example.com', 'hash3'),
  ('user4', 'Alice', 'Green', 'alice.green@example.com', 'hash4'),
  ('user5', 'Charlie', 'Black', 'charlie.black@example.com', 'hash5'),
  ('user6', 'David', 'White', 'david.white@example.com', 'hash6'),
  ('user7', 'Emily', 'Gray', 'emily.gray@example.com', 'hash7'),
  ('user8', 'Frank', 'Yellow', 'frank.yellow@example.com', 'hash8'),
  ('user9', 'Grace', 'Blue', 'grace.blue@example.com', 'hash9'),
  ('user10', 'Hannah', 'Purple', 'hannah.purple@example.com', 'hash10');


-- Insert test data for friendInvite table
INSERT INTO friendInvite (initiator_id, invitee_id, message, request_time, status)
VALUES 
  (1, 2, 'Let�s be friends!', NOW(), 0),
  (2, 3, 'Game on!', NOW(), 1),
  (3, 4, 'Join my team?', NOW(), 0),
  (4, 5, 'Let�s race!', NOW(), 1),
  (5, 1, 'Need a teammate!', NOW(), 2);

-- Insert test data for directMessage table
INSERT INTO directMessage (sender_id, receiver_id, content, send_time)
VALUES 
  (1, 2, 'Hello Jane!', NOW()),
  (2, 3, 'Good luck!', NOW()),
  (3, 4, 'Ready to race?', NOW()),
  (4, 5, 'See you on the track!', NOW()),
  (5, 1, 'Good job!', NOW());

-- Insert test data for raceleague table
INSERT INTO raceleague (owner_id, name, is_public, create_time)
VALUES 
  (1, 'Speedsters League', true, NOW()),
  (2, 'Pro Racers League', false, NOW()),
  (3, 'Weekend Warriors', true, NOW()),
  (4, 'Champions Circuit', true, NOW()),
  (5, 'Rookie Racers', false, NOW());

-- Insert test data for raceLeagueMembership table
INSERT INTO raceLeagueMembership (league_id, user_id, join_time)
VALUES 
  (1, 1, NOW()),
  (1, 2, NOW()),
  (1, 3, NOW()),
  (1, 4, NOW()),
  (1, 5, NOW()),
  (1, 6, NOW()),
  (1, 7, NOW()),
  (1, 8, NOW()),
  (1, 9, NOW()),
  (1, 10, NOW());

-- Insert test data for leagueInvite table
INSERT INTO leagueInvite (league_id, invitee_id, request_time, status)
VALUES 
  (1, 3, NOW(), 0),
  (2, 4, NOW(), 1),
  (3, 5, NOW(), 0),
  (4, 1, NOW(), 1),
  (5, 2, NOW(), 0);

-- Insert test data for track table
INSERT INTO track (name, location, distance, turns)
VALUES 
  ('Monza', 'Italy', 5.79, 11),
  ('Silverstone', 'UK', 5.89, 18),
  ('N�rburgring', 'Germany', 5.15, 16),
  ('Suzuka', 'Japan', 5.81, 18),
  ('Spa-Francorchamps', 'Belgium', 7.00, 20);

-- Insert test data for race table
INSERT INTO race (track_id, start_time)
VALUES 
  (1, NOW() + INTERVAL '1 day'),
  (2, NOW() + INTERVAL '2 days'),
  (3, NOW() + INTERVAL '3 days'),
  (4, NOW() + INTERVAL '4 days'),
  (5, NOW() + INTERVAL '5 days');

-- Insert test data for ballot table
INSERT INTO ballot (league_id, race_id, user_id, create_time, settle_time, score)
VALUES 
  (1, 1, 1, NOW(), NOW(), 11),
  (1, 2, 1, NOW(), NOW(), 25),
  (1, 3, 1, NOW(), NOW(), 8),
  (1, 4, 1, NOW(), NOW(), 18),
  (1, 5, 1, NOW(), NOW(), 24),

  (1, 1, 2, NOW(), NOW(), 36),
  (1, 2, 2, NOW(), NOW(), 44),
  (1, 3, 2, NOW(), NOW(), 19),
  (1, 4, 2, NOW(), NOW(), 22),
  (1, 5, 2, NOW(), NOW(), 10),

  (1, 1, 3, NOW(), NOW(), 47),
  (1, 2, 3, NOW(), NOW(), 15),
  (1, 3, 3, NOW(), NOW(), 33),
  (1, 4, 3, NOW(), NOW(), 6),
  (1, 5, 3, NOW(), NOW(), 30),

  (1, 1, 4, NOW(), NOW(), 29),
  (1, 2, 4, NOW(), NOW(), 14),
  (1, 3, 4, NOW(), NOW(), 45),
  (1, 4, 4, NOW(), NOW(), 20),
  (1, 5, 4, NOW(), NOW(), 50),

  (1, 1, 5, NOW(), NOW(), 23),
  (1, 2, 5, NOW(), NOW(), 13),
  (1, 3, 5, NOW(), NOW(), 12),
  (1, 4, 5, NOW(), NOW(), 7),
  (1, 5, 5, NOW(), NOW(), 9),

  (1, 1, 6, NOW(), NOW(), 17),
  (1, 2, 6, NOW(), NOW(), 46),
  (1, 3, 6, NOW(), NOW(), 2),
  (1, 4, 6, NOW(), NOW(), 27),
  (1, 5, 6, NOW(), NOW(), 32),

  (1, 1, 7, NOW(), NOW(), 16),
  (1, 2, 7, NOW(), NOW(), 26),
  (1, 3, 7, NOW(), NOW(), 5),
  (1, 4, 7, NOW(), NOW(), 38),
  (1, 5, 7, NOW(), NOW(), 31),

  (1, 1, 8, NOW(), NOW(), 42),
  (1, 2, 8, NOW(), NOW(), 1),
  (1, 3, 8, NOW(), NOW(), 40),
  (1, 4, 8, NOW(), NOW(), 28),
  (1, 5, 8, NOW(), NOW(), 48),

  (1, 1, 9, NOW(), NOW(), 21),
  (1, 2, 9, NOW(), NOW(), 35),
  (1, 3, 9, NOW(), NOW(), 41),
  (1, 4, 9, NOW(), NOW(), 4),
  (1, 5, 9, NOW(), NOW(), 43),

  (1, 1, 10, NOW(), NOW(), 3),
  (1, 2, 10, NOW(), NOW(), 37),
  (1, 3, 10, NOW(), NOW(), 34),
  (1, 4, 10, NOW(), NOW(), 39),
  (1, 5, 10, NOW(), NOW(), 49);


-- Insert test data for team table
INSERT INTO team (name, nationality, create_time)
VALUES 
  ('Ferrari', 'Italy', NOW()),
  ('Mercedes', 'Germany', NOW()),
  ('Red Bull', 'Austria', NOW()),
  ('McLaren', 'UK', NOW()),
  ('Renault', 'France', NOW());

-- Insert test data for driver table
INSERT INTO driver (driver_number, first_name, last_name, age, nationality, height, team_id, headshot_path, car_image_path)
VALUES 
  (1, 'Max', 'Verstappen', 26, 'Netherlands', 1.81, 3, './assets/driver_headshot/verstappen.png', './assets/cars/rbr.png'),
  (11, 'Sergio', 'Perez', 31, 'Mexico', 1.73, 3, './assets/driver_headshot/perez.png', './assets/cars/rbr.png'),
  (44, 'Lewis', 'Hamilton', 37, 'UK', 1.74, 2, './assets/driver_headshot/hamilton.png', './assets/cars/mercedes.png'),
  (63, 'George', 'Russell', 24, 'UK', 1.85, 2, './assets/driver_headshot/russell.png', './assets/cars/mercedes.png'),
  (77, 'Valtteri', 'Bottas', 32, 'Finland', 1.73, 2, './assets/driver_headshot/bottas.png', './assets/cars/kick_sauber.png'),
  (24, 'Guanyu', 'Zhou', 22, 'China', 1.80, 5, './assets/driver_headshot/zhou.png', './assets/cars/kick_sauber.png'),
  (4, 'Lando', 'Norris', 24, 'UK', 1.77, 4, './assets/driver_headshot/norris.png', './assets/cars/mcLaren.png'),
  (81, 'Oscar', 'Piastri', 20, 'Australia', 1.80, 4, './assets/driver_headshot/piastri.png', './assets/cars/mcLaren.png'),
  (14, 'Fernando', 'Alonso', 40, 'Spain', 1.71, 4, './assets/driver_headshot/alonso.png', './assets/cars/aston_martin.png'),
  (18, 'Lance', 'Stroll', 23, 'Canada', 1.85, 4, './assets/driver_headshot/stroll.png', './assets/cars/aston_martin.png'),
  (55, 'Carlos', 'Sainz', 27, 'Spain', 1.75, 1, './assets/driver_headshot/sainz.png', './assets/cars/ferrari.png'),
  (16, 'Charles', 'Leclerc', 24, 'Monaco', 1.80, 1, './assets/driver_headshot/leclerc.png', './assets/cars/ferrari.png'),
  (10, 'Pierre', 'Gasly', 25, 'France', 1.74, 5, './assets/driver_headshot/gasly.png', './assets/cars/alpine.png'),
  (31, 'Esteban', 'Ocon', 25, 'France', 1.86, 5, './assets/driver_headshot/ocon.png', './assets/cars/alpine.png'),
  (27, 'Nico', 'Hulkenberg', 34, 'Germany', 1.84, 5, './assets/driver_headshot/hulkenberg.png', './assets/cars/haas.png'),
  (20, 'Kevin', 'Magnussen', 29, 'Denmark', 1.74, 5, './assets/driver_headshot/magnussen.png', './assets/cars/haas.png'),
  (22, 'Yuki', 'Tsunoda', 21, 'Japan', 1.59, 5, './assets/driver_headshot/tsunoda.png', './assets/cars/rb.png'),
  (30, 'Liam', 'Lawson', 19, 'New Zealand', 1.75, 5, './assets/driver_headshot/lawson.png', './assets/cars/rb.png'),
  (23, 'Alex', 'Albon', 25, 'Thailand', 1.86, 5, './assets/driver_headshot/albon.png', './assets/cars/williams.png'),
  (43, 'Franco', 'Colapinto', 18, 'Argentina', 1.75, 5, './assets/driver_headshot/colapinto.png', './assets/cars/williams.png');

-- Insert test data for ballotContent table
INSERT INTO ballotContent (ballot_id, position, driver_name)
VALUES 
  (1, 1, 'Bob'),
  (2, 2, 'Bob'),
  (3, 3, 'Bob'),
  (4, 4, 'Bob'),
  (5, 5, 'Bob');

-- Insert test data for raceResult table
INSERT INTO raceResult (race_id, position, driver_id)
VALUES 
  (1, 1, 1),
  (2, 2, 2),
  (3, 3, 3),
  (4, 4, 4),
  (5, 5, 5);
