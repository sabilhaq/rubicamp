import Table from "cli-table";

export default class MahasiswaView {
  showFeatures() {
    const breadOptions = ["daftar", "cari", "tambah", "hapus", "kembali"];
    console.log("======================================================");
    console.log("silakan pilih opsi di bawah ini");
    for (let i = 0; i < breadOptions.length; i++) {
      if (i == breadOptions.length - 1) {
        console.log(`[${i + 1}] ${breadOptions[i]}`);
      } else {
        console.log(`[${i + 1}] ${breadOptions[i]} murid`);
      }
    }
    console.log("======================================================");
  }

  showAllStudents(students) {
    var table = new Table({
      head: ["NIM", "Nama", "Alamat", "Jurusan"],
      colWidths: [15, 25, 30, 10],
    });

    students.forEach((student) => {
      let arr = [];
      arr.push(student.nim, student.nama, student.alamat, student.id_jurusan);
      table.push(arr);
    });
    console.log("======================================================");
    console.log(table.toString());
  }

  showOneStudent(student) {
    console.log("======================================================");
    console.log("student details");
    console.log("======================================================");
    console.log(`id\t: ${student.nim}`);
    console.log(`nama\t: ${student.nama}`);
    console.log(`alamat\t: ${student.alamat}`);
    console.log(`jurusan\t: ${student.id_jurusan}`);
  }
}
