import Table from "cli-table";

export default class JurusanView {
  showFeatures() {
    const breadOptions = ["daftar", "cari", "tambah", "hapus", "kembali"];
    console.log("======================================================");
    console.log("silakan pilih opsi di bawah ini");
    for (let i = 0; i < breadOptions.length; i++) {
      if (i == breadOptions.length - 1) {
        console.log(`[${i + 1}] ${breadOptions[i]}`);
      } else {
        console.log(`[${i + 1}] ${breadOptions[i]} jurusan`);
      }
    }
    console.log("======================================================");
  }

  showAllMajors(majors) {
    var table = new Table({
      head: ["ID", "Nama Jurusan"],
      colWidths: [5, 40],
    });

    majors.forEach((major) => {
      let arr = [];
      arr.push(major.id_jurusan, major.namajurusan);
      table.push(arr);
    });
    console.log("======================================================");
    console.log(table.toString());
  }

  showOneMajor(major) {
    console.log("======================================================");
    console.log("major details");
    console.log("======================================================");
    console.log(`id\t\t: ${major.id_jurusan}`);
    console.log(`nama jurusan\t: ${major.namajurusan}`);
  }
}
