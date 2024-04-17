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