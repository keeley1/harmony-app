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
  is_complete TINYINT(1),
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

DROP TABLE IF EXISTS goal_tasks;
CREATE TABLE goal_tasks (
  goal_task_id INT NOT NULL UNIQUE AUTO_INCREMENT,
  goal_task VARCHAR(500) NOT NULL,
  is_complete TINYINT(1),
  user_id VARCHAR(15) NOT NULL,
  goal_id VARCHAR(15) NOT NULL,
  PRIMARY KEY(goal_task_id)
);

DROP TABLE IF EXISTS projects;
CREATE TABLE projects (
  project_id INT NOT NULL UNIQUE AUTO_INCREMENT,
  project_name VARCHAR(500) NOT NULL,
  project_description VARCHAR(1000),
  user_id VARCHAR(15) NOT NULL,
  PRIMARY KEY(project_id)
);

DROP TABLE IF EXISTS project_lists;
CREATE TABLE project_lists (
    project_list_id INT NOT NULL AUTO_INCREMENT,
    project_list_name VARCHAR(500) NOT NULL,
    project_id INT NOT NULL,
    PRIMARY KEY(project_list_id),
    FOREIGN KEY(project_id) REFERENCES projects(project_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

DROP TABLE IF EXISTS project_list_tasks;
CREATE TABLE project_list_tasks (
    project_task_id INT NOT NULL AUTO_INCREMENT,
    project_task_name VARCHAR(500) NOT NULL,
    project_task_description VARCHAR(500),
    project_task_due_date DATE,
    project_task_is_complete TINYINT(1),
    project_list_id INT NOT NULL,
    PRIMARY KEY(project_task_id),
    FOREIGN KEY(project_list_id) REFERENCES project_lists(project_list_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);