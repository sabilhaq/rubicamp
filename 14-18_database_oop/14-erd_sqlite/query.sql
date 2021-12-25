CREATE TABLE jurusan(
  idjurusan VARCHAR(4) PRIMARY KEY NOT NULL,
  namajurusan VARCHAR(100) NOT NULL
);

INSERT INTO jurusan VALUES 
('J001', 'TEKNIK INFORMATIKA'),
('J002', 'SISTEM INFORMASI');

CREATE TABLE mahasiswa(
  nim VARCHAR(8) PRIMARY KEY NOT NULL,
  nama VARCHAR(50) NOT NULL,
  alamat TEXT,
  jurusan VARCHAR(4),
  FOREIGN KEY(jurusan) REFERENCES jurusan(idjurusan)
);

INSERT INTO mahasiswa VALUES 
('2021001', 'Bambang', 'Bengkulu', 'J001'),
('2021002', 'Sabil', 'Antapani', 'J002'),
('2021003', 'Luthfi', 'Buahbatu', 'J002');

CREATE TABLE dosen(
  nip VARCHAR(10) PRIMARY KEY NOT NULL,
  nama VARCHAR(50) NOT NULL
);

INSERT INTO dosen VALUES 
('0000000001', 'Rubi'),
('0000000002', 'Reky');

CREATE TABLE matakuliah(
  idmk VARCHAR(5) PRIMARY KEY NOT NULL,
  namamk VARCHAR(100) NOT NULL,
  sks INT NOT NULL
);

INSERT INTO matakuliah VALUES 
('MK001', 'data mining', 5),
('MK002', 'basis data', 2),
('MK003', 'pbo', 3);

CREATE TABLE kontrak(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nim VARCHAR(8) NOT NULL,
  matakuliah VARCHAR(5) NOT NULL,
  dosen VARCHAR(10) NOT NULL,
  nilai VARCHAR(2),
  FOREIGN KEY(nim) REFERENCES mahasiswa(nim),
  FOREIGN KEY(matakuliah) REFERENCES matakuliah(idmk),
  FOREIGN KEY(dosen) REFERENCES dosen(nip)
);

INSERT INTO kontrak(nim, matakuliah, dosen, nilai) VALUES 
('2021001', 'MK001', '0000000002', 'A'),
('2021001', 'MK002', '0000000001', 'B'),
('2021001', 'MK003', '0000000002', 'D'),
('2021002', 'MK001', '0000000001', 'A'),
('2021002', 'MK002', '0000000002', 'E'),
('2021003', 'MK002', '0000000001', 'D'),
('2021003', 'MK003', '0000000001', 'E');
