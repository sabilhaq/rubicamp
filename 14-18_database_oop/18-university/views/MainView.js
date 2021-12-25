export default class MainView {
  constructor() {}

  header() {
    console.log("======================================================");
    console.log("Welcome to Universitas Pendidikan Indonesia");
    console.log("Jl Setiabudhi No. 255");
    console.log("======================================================");
  }

  mainMenu(user) {
    if (user) {
      console.log(
        `\nWelcome, ${user.username}. Your access level is: ${user.role}`
      );
    }
    console.log("======================================================");
    console.log("silakan pilih opsi di bawah ini");
    const tableOptions = [
      "Mahasiswa",
      "Jurusan",
      "dosen",
      "mata kuliah",
      "kontrak",
      "keluar",
    ];
    for (let i = 0; i < tableOptions.length; i++) {
      console.log(`[${i + 1}] ${tableOptions[i]}`);
    }
    console.log("======================================================");
  }

  footer() {
    console.log("======================================================");
    console.log("kamu telah keluar.");
    this.header();
  }
}
