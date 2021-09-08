import Table from "cli-table";

export default class KontrakView {
  showFeatures() {
    const breadOptions = ["daftar", "cari", "tambah", "hapus", "kembali"];
    console.log("======================================================");
    console.log("silakan pilih opsi di bawah ini");
    for (let i = 0; i < breadOptions.length; i++) {
      if (i == breadOptions.length - 1) {
        console.log(`[${i + 1}] ${breadOptions[i]}`);
      } else {
        console.log(`[${i + 1}] ${breadOptions[i]} kontrak`);
      }
    }
    console.log("======================================================");
  }

  showAllContracts(contracts) {
    console.log("contracts:", contracts);
    var table = new Table({
      head: ["ID", "Nilai", "NIM", "ID Mata Kuliah", "ID Dosen"],
      colWidths: [5, 10, 10, 20, 10],
    });

    contracts.forEach((contract) => {
      let arr = [];
      arr.push(
        contract.id_kontrak,
        contract.nilai,
        contract.nim,
        contract.id_mk,
        contract.id_dosen
      );
      table.push(arr);
    });
    console.log("======================================================");
    console.log(table.toString());
  }

  showOneContract(contract) {
    console.log("======================================================");
    console.log("contract details");
    console.log("======================================================");
    console.log(`id\t\t: ${contract.id_kontrak}`);
    console.log(`nilai\t\t: ${contract.nilai}`);
    console.log(`nim\t\t: ${contract.nim}`);
    console.log(`id mata kuliah\t: ${contract.id_mk}`);
    console.log(`id jurusan\t: ${contract.id_dosen}`);
  }
}
