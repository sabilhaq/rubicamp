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

-- no. 1
SELECT mahasiswa.nim, mahasiswa.nama, mahasiswa.alamat, jurusan.namajurusan FROM mahasiswa LEFT JOIN jurusan ON mahasiswa.jurusan = jurusan.idjurusan;

-- no. 2
ALTER TABLE mahasiswa ADD tanggallahir DATE;
UPDATE mahasiswa SET tanggallahir='2007-02-09' WHERE nim='2021001';
UPDATE mahasiswa SET tanggallahir='1998-07-25' WHERE nim='2021002';
UPDATE mahasiswa SET tanggallahir='1999-01-31' WHERE nim='2021003';

SELECT nim, nama, (strftime('%Y', 'now') - strftime('%Y', tanggallahir)) - (strftime('%m-%d', 'now') < strftime('%m-%d', tanggallahir)) AS umur FROM mahasiswa WHERE umur < 20;

-- no. 3
SELECT m.nim, m.nama, k.nilai FROM mahasiswa m LEFT JOIN kontrak k ON m.nim=k.nim  WHERE k.nilai = 'A' OR k.nilai = 'B';

-- no. 4
SELECT m.nim, m.nama, SUM(mk.sks) as jumlahsks FROM mahasiswa m LEFT JOIN kontrak k ON m.nim = k.nim LEFT JOIN matakuliah mk ON k.matakuliah = mk.idmk GROUP BY m.nim, m.nama HAVING jumlahsks > 10;

-- no. 5
SELECT m.nim, m.nama, mk.namamk as matakuliah FROM mahasiswa m LEFT JOIN kontrak k ON m.nim = k.nim LEFT JOIN matakuliah mk ON k.matakuliah = mk.idmk WHERE mk.namamk = 'data mining';

-- no.6
SELECT d.nip, d.nama, COUNT(DISTINCT k.nim) AS jumlahmahasiswa FROM dosen d LEFT JOIN kontrak k ON d.nip = k.dosen GROUP BY d.nip, d.nama;

-- no.7
SELECT nim, nama, (strftime('%Y', 'now') - strftime('%Y', tanggallahir)) - (strftime('%m-%d', 'now') < strftime('%m-%d', tanggallahir)) AS umur FROM mahasiswa ORDER BY umur ASC;

-- no.8
-- join mode
SELECT m.nim, m.nama, m.alamat, m.jurusan, j.namajurusan, d.nip, d.nama AS dosen, mk.idmk, mk.namamk, mk.sks, k.nilai FROM mahasiswa m LEFT JOIN jurusan j ON m.jurusan = j.idjurusan LEFT JOIN kontrak k ON m.nim = k.nim LEFT JOIN dosen d ON k.dosen = d.nip LEFT JOIN matakuliah mk ON k.matakuliah = mk.idmk WHERE k.nilai = 'D' OR k.nilai = 'E';

-- where mode
SELECT m.nim, m.nama, m.alamat, m.jurusan, j.namajurusan, d.nip, d.nama AS dosen, mk.idmk, mk.namamk, mk.sks, k.nilai FROM mahasiswa m, jurusan j, kontrak k, dosen d, matakuliah mk WHERE m.jurusan = j.idjurusan AND m.nim = k.nim AND k.dosen = d.nip AND k.matakuliah = mk.idmk AND (k.nilai = 'D' OR k.nilai = 'E');