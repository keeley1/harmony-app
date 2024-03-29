CREATE DATABASE harmonyApp;

USE harmonyApp;

DROP USER IF EXISTS 'appuser'@'localhost';
CREATE USER 'appuser'@'localhost' IDENTIFIED WITH mysql_native_password BY 'harmony';
GRANT ALL PRIVILEGES ON harmonyApp.* TO 'appuser'@'localhost';      

DROP TABLE IF EXISTS daily_tasks;
CREATE TABLE daily_tasks (
  task_id INT NOT NULL UNIQUE AUTO_INCREMENT,
  task VARCHAR(300) NOT NULL,
  PRIMARY KEY(task_id)
);