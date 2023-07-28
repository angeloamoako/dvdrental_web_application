DROP TABLE IF EXISTS Utenti;
CREATE TABLE Utenti(
	Customer_id VARCHAR(255) PRIMARY KEY,
	FirstName VARCHAR(255) NOT NULL,
	LastName VARCHAR(255) NOT NULL,
	UserPassword VARCHAR(255) NOT NULL
);

INSERT INTO Utenti VALUES (1, 'Mary', 'Smith', 'test');
INSERT INTO Utenti VALUES (2, 'Patricia', 'Johnson', 'test');
INSERT INTO Utenti VALUES (3, 'Linda', 'Williams', 'test');
INSERT INTO Utenti VALUES (4, 'Barbara', 'Jones', 'test');