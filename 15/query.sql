/* 1. tampilkan seluruh data mahasiswa beserta nama jurusannya. */

SELECT * FROM mahasiswa LEFT JOIN jurusan USING(id_jurusan);

/* 2. tampilkan mahasiswa yang memiliki umur di bawah 20 tahun. */

ALTER TABLE mahasiswa ADD birth_date DATE;
SELECT * FROM mahasiswa WHERE ((strftime('%Y', 'now') - strftime('%Y', birth_date)) - (strftime('%m-%d', 'now') < strftime('%m-%d', birth_date)) < 20);

/* 3. tampilkan mahasiswa yang memiliki nilai 'B' ke atas. */

SELECT nim, nama, nilai FROM mahasiswa LEFT JOIN nilai_mahasiswa USING(nim) WHERE nilai <= "B";

/* 4. tampilkan mahasiswa yang memiliki jumlah SKS lebih dari 10. */

SELECT 
  mahasiswa.nim, mahasiswa.nama, SUM(sks) 
FROM 
  nilai_mahasiswa 
  LEFT JOIN 
    mahasiswa ON nilai_mahasiswa.nim = mahasiswa.nim 
  LEFT JOIN 
    matakuliah ON matakuliah.id_mk = nilai_mahasiswa.id_mk 
GROUP BY nilai_mahasiswa.nim
HAVING SUM(sks) > 10
;

/* 5. tampilkan mahasiswa yang mengontrak mata kuliah 'data mining'. */

SELECT 
  mahasiswa.nim, mahasiswa.nama, matakuliah.id_mk, matakuliah.nama 
FROM 
  nilai_mahasiswa 
  LEFT JOIN 
    mahasiswa ON nilai_mahasiswa.nim = mahasiswa.nim 
  LEFT JOIN 
    matakuliah ON matakuliah.id_mk = nilai_mahasiswa.id_mk 
WHERE matakuliah.nama = 'data mining'
;

/* 6. tampilkan jumlah mahasiswa untuk setiap dosen. */

SELECT 
  dosen.nama, COUNT (DISTINCT mahasiswa.nim) 
FROM 
  nilai_mahasiswa
LEFT JOIN 
  dosen ON nilai_mahasiswa.id_dosen = dosen.id_dosen 
LEFT JOIN 
  mahasiswa ON mahasiswa.nim = nilai_mahasiswa.nim 
GROUP BY dosen.id_dosen
;

/* 7. urutkan mahasiswa berdasarkan umurnya. */

SELECT 
  * 
FROM 
  mahasiswa 
ORDER BY  
  birth_date
;

/* 8. tampilkan kontrak matakuliah yang harus diulang (nilai D dan E), serta tampilkan data mahasiswa jurusan dan dosen secara lengkap. Gunakan mode JOIN dan WHERE clause (solusi terdiri dari 2 syntax SQL). */

SELECT 
  mahasiswa.nim, mahasiswa.nama, mahasiswa.alamat, mahasiswa.id_jurusan, jurusan.namajurusan, mahasiswa.id_dosen_wali, dosen.nama, matakuliah.id_mk, matakuliah.nama, matakuliah.sks, nilai_mahasiswa.nilai
FROM 
  mahasiswa 
  LEFT JOIN 
    jurusan ON mahasiswa.id_jurusan = jurusan.id_jurusan 
  LEFT JOIN 
    nilai_mahasiswa ON mahasiswa.nim = nilai_mahasiswa.nim 
  LEFT JOIN 
    dosen ON dosen.id_dosen = mahasiswa.id_dosen_wali
  LEFT JOIN 
    matakuliah ON matakuliah.id_mk = nilai_mahasiswa.id_mk
WHERE
  nilai_mahasiswa.nilai = 'D' OR nilai_mahasiswa.nilai = 'E'
;
