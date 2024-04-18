CREATE DATABASE harmonyApp;

USE harmonyApp;

DROP USER IF EXISTS 'appuser'@'localhost';
CREATE USER 'appuser'@'localhost' IDENTIFIED WITH mysql_native_password BY 'harmony';
GRANT ALL PRIVILEGES ON harmonyApp.* TO 'appuser'@'localhost';      

DROP TABLE IF EXISTS user_details;
CREATE TABLE user_details (
  user_id INT NOT NULL UNIQUE AUTO_INCREMENT,
  firstname VARCHAR(60) NOT NULL,
  surname VARCHAR(60) NOT NULL,
  username VARCHAR(15) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL,
  hashedPassword VARCHAR(60) NOT NULL,
  PRIMARY KEY(user_id)
);

DROP TABLE IF EXISTS daily_tasks;
CREATE TABLE daily_tasks (
  task_id INT NOT NULL UNIQUE AUTO_INCREMENT,
  task VARCHAR(1000) NOT NULL,
  task_date DATE NOT NULL,
  user_id VARCHAR(15) NOT NULL,
  PRIMARY KEY(task_id)
);

DROP TABLE IF EXISTS gratitude;
CREATE TABLE gratitude (
  gratitude_id INT NOT NULL UNIQUE AUTO_INCREMENT,
  item VARCHAR(500) NOT NULL,
  gratitude_date DATE NOT NULL,
  user_id VARCHAR(15) NOT NULL,
  PRIMARY KEY(gratitude_id)
);

DROP TABLE IF EXISTS checkin;
CREATE TABLE checkin (
  checkin_id INT NOT NULL UNIQUE AUTO_INCREMENT,
  mood_rating TINYINT NOT NULL,
  checkin_date DATE NOT NULL,
  emotion_one VARCHAR(50),
  emotion_two VARCHAR(50),
  emotion_three VARCHAR(50),
  user_id VARCHAR(15) NOT NULL,
  PRIMARY KEY(checkin_id)
);

DROP TABLE IF EXISTS goals;
CREATE TABLE goals (
  goal_id INT NOT NULL UNIQUE AUTO_INCREMENT,
  goal VARCHAR(500) NOT NULL,
  is_complete TINYINT(1),
  goal_target_date DATE,
  user_id VARCHAR(15) NOT NULL,
  PRIMARY KEY(goal_id)
);