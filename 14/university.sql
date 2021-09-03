/* CREATE tables */
CREATE TABLE jurusan(
  id_jurusan INTEGER PRIMARY KEY, 
  namajurusan TEXT
);

CREATE TABLE dosen(
  id_dosen INTEGER PRIMARY KEY, 
  nama TEXT
);

CREATE TABLE mahasiswa(
  nim TEXT PRIMARY KEY, 
  nama TEXT, 
  alamat TEXT, 
  jurusan TEXT, 
  id_dosen_wali INTEGER, 
  FOREIGN KEY(jurusan) REFERENCES jurusan(id_jurusan)
  FOREIGN KEY(id_dosen_wali) REFERENCES dosen(id_dosen)
);

CREATE TABLE matakuliah(
  id_mk INTEGER PRIMARY KEY, 
  nama TEXT, 
  sks INTEGER, 
  id_jurusan INTEGER, 
  FOREIGN KEY(id_jurusan) REFERENCES jurusan(id_jurusan)
); 

CREATE TABLE nilai_mahasiswa(
  id_nilai_mahasiswa INTEGER PRIMARY KEY, 
  nim TEXT, 
  id_mk INTEGER, 
  nilai INTEGER, 
  id_dosen INTEGER, 
  FOREIGN KEY(nim) REFERENCES mahasiswa(nim), 
  FOREIGN KEY(id_mk) REFERENCES matakuliah(id_mk), 
  FOREIGN KEY(id_dosen) REFERENCES dosen(id_dosen)
);

/* INSERT data into tables */
INSERT INTO jurusan VALUES(1, "Sistem dan Teknologi Informasi");

INSERT INTO dosen VALUES(1, "Kridanto Surendro");

INSERT INTO mahasiswa VALUES("18216031", "Makrifat Sabil Haq", "Komplek Pratista II Blok F-87", 1, 1);

INSERT INTO matakuliah VALUES(1, "Arsitektur Enterprise", 4, 1); 

INSERT INTO nilai_mahasiswa VALUES(1, "18216031", 1, 0, 1);
