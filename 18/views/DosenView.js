import Table from "cli-table";

export default class DosenView {
  showFeatures() {
    const breadOptions = ["daftar", "cari", "tambah", "hapus", "kembali"];
    console.log("======================================================");
    console.log("silakan pilih opsi di bawah ini");
    for (let i = 0; i < breadOptions.length; i++) {
      if (i == breadOptions.length - 1) {
        console.log(`[${i + 1}] ${breadOptions[i]}`);
      } else {
        console.log(`[${i + 1}] ${breadOptions[i]} dosen`);
      }
    }
    console.log("======================================================");
  }

  showAllLecturers(lecturers) {
    var table = new Table({
      head: ["ID", "Nama"],
      colWidths: [5, 30],
    });

    lecturers.forEach((lecturer) => {
      let arr = [];
      arr.push(lecturer.id_dosen, lecturer.nama);
      table.push(arr);
    });
    console.log("======================================================");
    console.log(table.toString());
  }

  showOneLecturer(lecturer) {
    console.log("======================================================");
    console.log("lecturer details");
    console.log("======================================================");
    console.log(`id\t: ${lecturer.id_dosen}`);
    console.log(`nama\t: ${lecturer.nama}`);
  }
}
