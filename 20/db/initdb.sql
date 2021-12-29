CREATE TABLE IF NOT EXISTS breads (
  id INTEGER PRIMARY KEY  AUTOINCREMENT,
  stringdata VARCHAR(100) NOT NULL,
  integerdata INT NOT NULL,
  floatdata FLOAT NOT NULL,
  datedata DATE NOT NULL,
  booleandata BOOLEAN NOT NULL
);

INSERT INTO breads(stringdata, integerdata, floatdata, datedata, booleandata) VALUES
('Testing Data', 12, 1.45, "2017-12-12", 1),
('Coba Lagi', 99, 100.405, "2017-11-20", 0),
('Super Sekali', 0, 1.45, "", 0);