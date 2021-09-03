/* CREATE tables */
CREATE TABLE jurusan(
  id INTEGER PRIMARY KEY, 
  namajurusan TEXT
);

CREATE TABLE mahasiswa(
  nim TEXT PRIMARY KEY, 
  nama TEXT, 
  alamat TEXT, 
  jurusan TEXT, 
  FOREIGN KEY(jurusan) REFERENCES jurusan(id)
);

CREATE TABLE dosen(
  id INTEGER PRIMARY KEY, 
  nama TEXT
);

CREATE TABLE matakuliah(
  id INTEGER PRIMARY KEY, 
  nama TEXT, 
  sks INTEGER, 
  id_jurusan INTEGER, 
  FOREIGN KEY(id_jurusan) REFERENCES jurusan(id)
); 

CREATE TABLE dosen_mahasiswa(
  id_dosen INTEGER, 
  nim TEXT, 
  FOREIGN KEY(id_dosen) REFERENCES dosen(id), 
  FOREIGN KEY(nim) REFERENCES mahasiswa(nim), 
  PRIMARY KEY (id_dosen, nim)
);

CREATE TABLE dosen_matakuliah(
  id_dosen INTEGER, 
  id_matakuliah INTEGER, 
  FOREIGN KEY(id_dosen) REFERENCES dosen(id), 
  FOREIGN KEY(id_matakuliah) REFERENCES matakuliah(id), 
  PRIMARY KEY (id_dosen, id_matakuliah)
);

CREATE TABLE mahasiswa_matakuliah(
  nim TEXT, 
  id_matakuliah INTEGER, 
  FOREIGN KEY(nim) REFERENCES mahasiswa(nim), 
  FOREIGN KEY(id_matakuliah) REFERENCES matakuliah(id), 
  PRIMARY KEY (nim, id_matakuliah)
);

/* INSERT data into tables */
INSERT INTO jurusan VALUES(1, "Sisten dan Teknologi Informasi");

INSERT INTO mahasiswa VALUES("18216031", "Makrifat Sabil Haq", "Komplek Pratista II Blok F-87", 1);

INSERT INTO dosen VALUES(1, "Kridanto Surendro");

INSERT INTO matakuliah VALUES(1, "Arsitektur Enterprise", 4, 1); 

INSERT INTO dosen_mahasiswa VALUES(1, "18216031");

INSERT INTO dosen_matakuliah VALUES(1, 1);

INSERT INTO mahasiswa_matakuliah VALUES("18216031", 1);