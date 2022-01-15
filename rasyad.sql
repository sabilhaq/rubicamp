/* CREATE tables */
CREATE TABLE roles(
  role_id INTEGER PRIMARY KEY AUTOINCREMENT,
  role_name VARCHAR(50) NOT NULL,
  role_desc VARCHAR(100) NOT NULL,
  role_permission TEXT
);

CREATE TABLE users(
  user_id INTEGER PRIMARY KEY AUTOINCREMENT,
  username VARCHAR(50) NOT NULL,
  user_password TEXT NOT NULL,
  first_name VARCHAR(50) NOT NULL,
  last_name TEXT,
  gender INTEGER,
  reg_no TEXT,
  email TEXT,
  phone TEXT,
  birth_date DATE,
  user_address TEXT,
  role_id INTEGER,
  FOREIGN KEY(role_id) REFERENCES roles(role_id)
);

-- CREATE TABLE users(
--   user_id INTEGER PRIMARY KEY AUTOINCREMENT,
--   username VARCHAR(64) NOT NULL,
--   password VARCHAR(64) NOT NULL,
--   role VARCHAR(64)
-- );
-- INSERT INTO users(username, password, role) VALUES ("rubi", "rubicamp", "ADMIN");
CREATE TABLE subjects(
  subject_id INTEGER PRIMARY KEY AUTOINCREMENT,
  subject_code TEXT,
  subject_name TEXT
);

CREATE TABLE classes(
  class_id INTEGER PRIMARY KEY AUTOINCREMENT,
  class_code TEXT,
  teacher_id INTEGER,
  subject_id INTEGER,
  FOREIGN KEY(teacher_id) REFERENCES users(user_id),
  FOREIGN KEY(subject_id) REFERENCES subjects(subject_id)
);

CREATE TABLE student_class(
  student_class_id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  class_id INTEGER,
  FOREIGN KEY(user_id) REFERENCES users(user_id),
  FOREIGN KEY(class_id) REFERENCES classes(class_id)
);

CREATE TABLE meetings(
  meeting_id INTEGER PRIMARY KEY AUTOINCREMENT,
  content TEXT,
  meeting_url TEXT,
  meeting_date DATE,
  class_id INTEGER,
  FOREIGN KEY(class_id) REFERENCES classes(class_id)
);

CREATE TABLE student_meeting(
  student_meeting_id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  meeting_id INTEGER,
  FOREIGN KEY(user_id) REFERENCES users(user_id) FOREIGN KEY(meeting_id) REFERENCES meetinges(meeting_id)
);

/* INSERT data into tables */
-- role_id, role_name, role_desc, role_permission
INSERT INTO
  roles
VALUES
  ("student");

INSERT INTO
  roles
VALUES
  ("teacher");

INSERT INTO
  roles
VALUES
  ("admin");

-- username, user_password, first_name, last_name, gender, reg_no, email, phone, birth_date, user_address, role_id
INSERT INTO
  users
VALUES
  (
    1,
    "sabilhaq",
    "sabil",
    "Makrifat",
    "Sabil Haq",
    1,
    "100121001",
    "makrifatsabilhaq@gmail.com",
    "085624617781",
    ""
  );

INSERT INTO
  users
VALUES
  (2, "A", "18216027", 1, 1);

INSERT INTO
  users
VALUES
  (3, "B", "18216053", 1, 1);

INSERT INTO
  users
VALUES
  (4, "C", "18216054", 1, 1);

INSERT INTO
  users
VALUES
  (5, "A", "18216027", 2, 1);

INSERT INTO
  users
VALUES
  (6, "A", "18216027", 3, 1);

INSERT INTO
  users
VALUES
  (7, "B", "18216031", 2, 1);

INSERT INTO
  users(id_users, nim, id_mk, id_dosen)
VALUES
  (8, "18216027", 5, 2);

INSERT INTO
  users(id_users, nim, id_mk, id_dosen)
VALUES
  (9, "18216031", 5, 2);

INSERT INTO
  users
VALUES
  (10, "D", "18216054", 5, 2);

INSERT INTO
  users
VALUES
  (11, "E", "18216054", 4, 1);

INSERT INTO
  users
VALUES
  (12, "E", "18216053", 5, 2);

INSERT INTO
  dosen
VALUES
  (1, "Kridanto Surendro");

INSERT INTO
  dosen
VALUES
  (2, "Iping Supriana Suwardi");

-- INSERT INTO mahasiswa VALUES("18216031", "Makrifat Sabil Haq", "Komplek Pratista II Blok F-87", 1, 1);
INSERT INTO
  mahasiswa
VALUES
  (
    "18216031",
    "Makrifat Sabil Haq",
    "Komplek Pratista II Blok F-87",
    1,
    1,
    "1998-07-25"
  );

-- id_mk, nama, sks, id_jurusan
INSERT INTO
  matakuliah
VALUES
  (1, "Arsitektur Enterprise", 4, 1);

INSERT INTO
  matakuliah
VALUES
  (2, "Analisis Kebutuhan Sistem", 4, 1);

INSERT INTO
  matakuliah
VALUES
  (3, "Pemodelan Basis Data", 4, 1);

INSERT INTO
  matakuliah
VALUES
  (4, "Manajemen Basis Data", 4, 1);

INSERT INTO
  matakuliah
VALUES
  (5, "data mining", 4, 2);

-- id_nilai_mahasiswa, nilai, nim, id_mk, id_dosen
INSERT INTO
  nilai_mahasiswa
VALUES
  (1, "A", "18216031", 1, 1);

INSERT INTO
  nilai_mahasiswa
VALUES
  (2, "A", "18216027", 1, 1);

INSERT INTO
  nilai_mahasiswa
VALUES
  (3, "B", "18216053", 1, 1);

INSERT INTO
  nilai_mahasiswa
VALUES
  (4, "C", "18216054", 1, 1);

INSERT INTO
  nilai_mahasiswa
VALUES
  (5, "A", "18216027", 2, 1);

INSERT INTO
  nilai_mahasiswa
VALUES
  (6, "A", "18216027", 3, 1);

INSERT INTO
  nilai_mahasiswa
VALUES
  (7, "B", "18216031", 2, 1);

INSERT INTO
  nilai_mahasiswa(id_nilai_mahasiswa, nim, id_mk, id_dosen)
VALUES
  (8, "18216027", 5, 2);

INSERT INTO
  nilai_mahasiswa(id_nilai_mahasiswa, nim, id_mk, id_dosen)
VALUES
  (9, "18216031", 5, 2);

INSERT INTO
  nilai_mahasiswa
VALUES
  (10, "D", "18216054", 5, 2);

INSERT INTO
  nilai_mahasiswa
VALUES
  (11, "E", "18216054", 4, 1);

INSERT INTO
  nilai_mahasiswa
VALUES
  (12, "E", "18216053", 5, 2);

-- Add birth_date column
ALTER TABLE
  mahasiswa
ADD
  birth_date DATE;

UPDATE
  mahasiswa
SET
  birth_date = "1998-07-25";

-- nim, nama, alamat, id_jurusan, id_dosen_wali, birth_date
INSERT INTO
  mahasiswa
VALUES
  (
    "18216027",
    "Luthfi Fachriza Sandi",
    "Jl. Kecubung No. 25",
    1,
    1,
    "1999-01-31"
  );

INSERT INTO
  mahasiswa
VALUES
  (
    "18216053",
    "Muhammad Harun Ar Rasyid",
    "Jl. Purwakarta",
    1,
    1,
    "2007-07-25"
  );

INSERT INTO
  mahasiswa
VALUES
  (
    "18216054",
    "Muhammad Dzaky Alam",
    "Kost dekat Rubicamp",
    1,
    1,
    "2000-07-25"
  );

INSERT INTO
  mahasiswa(nim, nama, alamat, id_jurusan, birth_date)
VALUES
  (
    "18216055",
    "Wildan Ismail",
    "Bandung Selatan",
    1,
    "2003-07-25"
  );

INSERT INTO
  mahasiswa(nim, nama, alamat, id_jurusan, birth_date)
VALUES
  (
    "18216056",
    "Rizky Ramdhani",
    "Kiaracondong",
    1,
    "2000-07-25"
  );

INSERT INTO
  mahasiswa(nim, nama, alamat, id_jurusan, birth_date)
VALUES
  (
    "18216056",
    "Dafa Fadiya",
    "Jl. Cisitu",
    1,
    "2001-07-25"
  );

ALTER TABLE
  nilai_mahasiswa
ADD
  birth_date DATE;