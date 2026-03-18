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

CREATE TABLE IF NOT EXISTS UserGenres(
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    genre VARCHAR(50) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Bands (
    id INT NOT NULL,
    name varchar(100) NOT NULL,
    PRIMARY KEY (id)
)

CREATE TABLE IF NOT EXISTS BandGenres (
    id INT NOT NULL,
    band_id INT NOT NULL,
    genre VARCHAR(50) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (band_id) REFERENCES Bands(id) ON DELETE CASCADE
)

CREATE TABLE IF NOT EXISTS BandMembers (
    id INT NOT NULL,
    band_id INT NOT NULL,
    user_id INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (band_id) REFERENCES Bands(id) ON DELETE CASCADE
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
)

