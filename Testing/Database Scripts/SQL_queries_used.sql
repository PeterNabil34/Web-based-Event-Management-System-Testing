
/*
Explanation: To properly test all functionalities have to be done by the admin.

Note:
"$2b$10$4nEDlsI3tEQWJTTm6zR8iuEnQmnx5.riY6Kdi2ARe/q6.jQ6qB12m" means "admin123"
*/
INSERT INTO Users (id, username, email, password, isAdmin) VALUES (1, "admin", "admin@project.com", "$2b$10$4nEDlsI3tEQWJTTm6zR8iuEnQmnx5.riY6Kdi2ARe/q6.jQ6qB12m", TRUE);

/* Explanation: To check if the user has been added successfully to the database or not. */
SELECT * FROM users;

/* Explanation: To check if the event has been added successfully to the database or not. */
SELECT * FROM events;

/* Explanation: To check if the event has been rsvped successfully by the right user or not. */
SELECT * FROM rsvps;

/* Explanation: To delete the events in the database which has been created during the execution of the test cases to test again with the same test data. */
DELETE FROM Events WHERE name = "First Automated Event";

/* Explanation: To delete the users in the database which has been created during the execution of the test cases to test again with the same test data. */
DELETE FROM Users WHERE username = "TempUser";
