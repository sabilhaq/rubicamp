import Table from "cli-table";

export default class MataKuliahView {
  showFeatures() {
    const breadOptions = ["daftar", "cari", "tambah", "hapus", "kembali"];
    console.log("======================================================");
    console.log("silakan pilih opsi di bawah ini");
    for (let i = 0; i < breadOptions.length; i++) {
      if (i == breadOptions.length - 1) {
        console.log(`[${i + 1}] ${breadOptions[i]}`);
      } else {
        console.log(`[${i + 1}] ${breadOptions[i]} mata kuliah`);
      }
    }
    console.log("======================================================");
  }

  showAllSubjects(subjects) {
    var table = new Table({
      head: ["ID", "Nama", "SKS", "ID Jurusan"],
      colWidths: [5, 40, 5, 15],
    });

    subjects.forEach((subject) => {
      let arr = [];
      arr.push(subject.id_mk, subject.nama, subject.sks, subject.id_jurusan);
      table.push(arr);
    });
    console.log("======================================================");
    console.log(table.toString());
  }

  showOneSubject(subject) {
    console.log("======================================================");
    console.log("subject details");
    console.log("======================================================");
    console.log(`id\t\t: ${subject.id_mk}`);
    console.log(`nama\t\t: ${subject.nama}`);
    console.log(`sks\t\t: ${subject.sks}`);
    console.log(`id jurusan\t: ${subject.id_jurusan}`);
  }
}
