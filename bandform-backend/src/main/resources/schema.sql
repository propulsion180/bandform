CREATE TABLE IF NOT EXISTS Users (
    id INT NOT NULL,
    name varchar(100) NOT NULL,
    city varchar(30) NOT NULL,
    country varchar(50) NOT NULL,
    description varchar(100) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS UserInstruments(
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    instrument VARCHAR(50) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);