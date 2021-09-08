import MainView from "../views/MainView.js";
import User from "../models/User.js";
import Mahasiswa from "../models/Mahasiswa.js";
import MahasiswaView from "../views/MahasiswaView.js";
import Jurusan from "../models/Jurusan.js";
import JurusanView from "../views/JurusanView.js";
import Dosen from "../models/Dosen.js";
import DosenView from "../views/DosenView.js";
import MataKuliah from "../models/MataKuliah.js";
import MataKuliahView from "../views/MataKuliahView.js";
import Kontrak from "../models/Kontrak.js";
import KontrakView from "../views/KontrakView.js";

export default class UniversityController {
  constructor(rl, db) {
    this.rl = rl;
    this.user = new User(db);
    this.mainView = new MainView();
    this.student = new Mahasiswa(db);
    this.studentView = new MahasiswaView();
    this.majorView = new JurusanView();
    this.major = new Jurusan(db);
    this.lecturerView = new DosenView();
    this.lecturer = new Dosen(db);
    this.subjectView = new MataKuliahView();
    this.subject = new MataKuliah(db);
    this.contractView = new KontrakView();
    this.contract = new Kontrak(db);
  }

  start() {
    this.mainView.header();
    this.askUsername();
  }

  askUsername() {
    this.rl.question("username:", (username) => {
      this.user.getUserByUsername(username, (err, users) => {
        if (err) {
          console.log("users: ", users, err);
          console.log("terjadi kesalahan, silakan coba lagi");
          this.askUsername();
        } else if (users.length == 0) {
          console.log("username tidak terdaftar");
          console.log("======================================================");
          this.askUsername();
        } else {
          this.askPassword(users[0]);
        }
      });
    });
  }

  askPassword(user) {
    this.rl.question("password:", (password) => {
      if (user.password == password) {
        this.mainMenu(user);
      } else {
        console.log("password salah, silakan coba lagi");
        console.log("======================================================");
        this.askUsername();
      }
    });
  }

  mainMenu(user) {
    this.mainView.mainMenu(user);
    this.rl.question("masukkan salah satu no. dari opsi di atas:", (option) => {
      switch (option) {
        case "1":
          this.menuMahasiswa();
          break;
        case "2":
          this.menuJurusan();
          break;
        case "3":
          this.menuDosen();
          break;
        case "4":
          this.menuMataKuliah();
          break;
        case "5":
          this.menuKontrak();
          break;
        case "6":
          this.mainView.footer();
          this.askUsername();
          break;

        default:
          console.log("Anda salah memasukkan opsi");
          this.mainMenu(user);
          break;
      }
    });
  }

  menuMahasiswa(user) {
    this.studentView.showFeatures();

    this.rl.question("masukkan salah satu no. dari opsi di atas:", (option) => {
      switch (option) {
        case "1":
          this.student.getAll((err, students) => {
            if (err) {
              console.log("terjadi kesalahan, silakan coba lagi");
              this.menuMahasiswa();
            } else {
              this.studentView.showAllStudents(students);
              this.menuMahasiswa();
            }
          });
          break;
        case "2":
          this.askNIM();
          break;
        case "3": //tambah
          this.askDetailStudent();
          break;
        case "4": //hapus
          this.askNIMDelete();
          break;
        case "5": //kembali
          this.mainMenu();
          break;

        default:
          console.log("Anda salah memasukkan opsi");
          this.mainMenu(user);
          break;
      }
    });
  }

  askNIM() {
    this.rl.question("Masukkan NIM:", (nim) => {
      this.student.getStudentByNIM(nim, (err, students) => {
        if (err) {
          console.log("terjadi kesalahan, silakan coba lagi");
          this.askNIM();
        } else if (students.length == 0) {
          console.log(`mahasiswa dengan nim ${nim} tidak terdaftar`);
          console.log("======================================================");
          this.askNIM();
        } else {
          this.studentView.showOneStudent(students[0]);
          this.menuMahasiswa();
        }
      });
    });
  }

  askDetailStudent() {
    console.log("lengkapi data di bawah ini:");
    this.rl.question("NIM:", (nim) => {
      this.rl.question("nama:", (name) => {
        this.rl.question("jurusan:", (major) => {
          this.rl.question("alamat:", (address) => {
            this.student.add(nim, name, major, address, (err) => {
              if (err) {
                console.log("terjadi kesalahan, silakan coba lagi");
                this.askDetailStudent();
              } else {
                this.student.getAll((err, students) => {
                  if (err) {
                    console.log("terjadi kesalahan, silakan coba lagi");
                    this.menuMahasiswa();
                  } else {
                    this.studentView.showAllStudents(students);
                    this.menuMahasiswa();
                  }
                });
              }
            });
          });
        });
      });
    });
  }

  askNIMDelete() {
    this.rl.question("masukkan NIM mahasiswa yang akan dihapus:", (nim) => {
      this.student.deleteStudentByNIM(nim, (err) => {
        if (err) {
          console.log("terjadi kesalahan, silakan coba lagi");
          this.askNIM();
        } else {
          this.student.getAll((err, students) => {
            if (err) {
              console.log("terjadi kesalahan, silakan coba lagi");
              this.menuMahasiswa();
            } else {
              console.log(`mahasiswa dengan NIM ${nim} telah dihapus.`);
              this.studentView.showAllStudents(students);
              this.menuMahasiswa();
            }
          });
        }
      });
    });
  }

  menuJurusan() {
    this.majorView.showFeatures();

    this.rl.question("masukkan salah satu no. dari opsi di atas:", (option) => {
      switch (option) {
        case "1":
          this.major.getAll((err, majors) => {
            if (err) {
              console.log("terjadi kesalahan, silakan coba lagi");
              this.menuJurusan();
            } else {
              this.majorView.showAllMajors(majors);
              this.menuJurusan();
            }
          });
          break;
        case "2":
          this.askMajorID();
          break;
        case "3": //tambah
          this.askDetailMajor();
          break;
        case "4": //hapus
          this.askMajorIDDelete();
          break;
        case "5": //kembali
          this.mainMenu();
          break;

        default:
          console.log("Anda salah memasukkan opsi");
          this.mainMenu();
          break;
      }
    });
  }

  askMajorID() {
    this.rl.question("Masukkan ID jurusan:", (majorID) => {
      this.major.getMajorByID(majorID, (err, majors) => {
        if (err) {
          console.log("terjadi kesalahan, silakan coba lagi");
          this.askMajorID();
        } else if (majors.length == 0) {
          console.log(`jurusan dengan id ${majorID} tidak terdaftar`);
          console.log("======================================================");
          this.askMajorID();
        } else {
          this.majorView.showOneMajor(majors[0]);
          this.menuJurusan();
        }
      });
    });
  }

  askDetailMajor() {
    console.log("lengkapi data di bawah ini:");
    this.rl.question("nama jurusan:", (majorName) => {
      this.major.add(majorName, (err) => {
        if (err) {
          console.log("terjadi kesalahan, silakan coba lagi");
          this.askDetailMajor();
        } else {
          this.major.getAll((err, majors) => {
            if (err) {
              console.log("terjadi kesalahan, silakan coba lagi");
              this.menuJurusan();
            } else {
              this.majorView.showAllMajors(majors);
              this.menuJurusan();
            }
          });
        }
      });
    });
  }

  askMajorIDDelete() {
    this.rl.question("masukkan ID jurusan yang akan dihapus:", (majorID) => {
      this.major.deleteMajorByID(majorID, (err) => {
        if (err) {
          console.log("terjadi kesalahan, silakan coba lagi");
          this.askMajorIDDelete();
        } else {
          this.major.getAll((err, majors) => {
            if (err) {
              console.log("terjadi kesalahan, silakan coba lagi");
              this.menuJurusan();
            } else {
              console.log(`jurusan dengan ID ${majorID} telah dihapus.`);
              this.majorView.showAllMajors(majors);
              this.menuJurusan();
            }
          });
        }
      });
    });
  }

  // Dosen
  menuDosen() {
    this.lecturerView.showFeatures();

    this.rl.question("masukkan salah satu no. dari opsi di atas:", (option) => {
      switch (option) {
        case "1":
          this.lecturer.getAll((err, lecturers) => {
            if (err) {
              console.log("terjadi kesalahan, silakan coba lagi");
              this.menuDosen();
            } else {
              this.lecturerView.showAllLecturers(lecturers);
              this.menuDosen();
            }
          });
          break;
        case "2":
          this.askLecturerID();
          break;
        case "3": //tambah
          this.askDetailLecturer();
          break;
        case "4": //hapus
          this.askLecturerIDDelete();
          break;
        case "5": //kembali
          this.mainMenu();
          break;

        default:
          console.log("Anda salah memasukkan opsi");
          this.mainMenu();
          break;
      }
    });
  }

  askLecturerID() {
    this.rl.question("Masukkan ID Dosen:", (lecturerID) => {
      this.lecturer.getLecturerByID(lecturerID, (err, lecturers) => {
        if (err) {
          console.log("terjadi kesalahan, silakan coba lagi");
          this.askLecturerID();
        } else if (lecturers.length == 0) {
          console.log(`dosen dengan id ${lecturerID} tidak terdaftar`);
          console.log("======================================================");
          this.askLecturerID();
        } else {
          this.lecturerView.showOneLecturer(lecturers[0]);
          this.menuDosen();
        }
      });
    });
  }

  askDetailLecturer() {
    console.log("lengkapi data di bawah ini:");
    this.rl.question("nama dosen:", (lecturerName) => {
      this.lecturer.add(lecturerName, (err) => {
        if (err) {
          console.log("terjadi kesalahan, silakan coba lagi");
          this.askDetailLecturer();
        } else {
          this.lecturer.getAll((err, lecturers) => {
            if (err) {
              console.log("terjadi kesalahan, silakan coba lagi");
              this.menuDosen();
            } else {
              this.lecturerView.showAllLecturers(lecturers);
              this.menuDosen();
            }
          });
        }
      });
    });
  }

  askLecturerIDDelete() {
    this.rl.question("masukkan ID dosen yang akan dihapus:", (lecturerID) => {
      this.lecturer.deleteLecturerByID(lecturerID, (err) => {
        if (err) {
          console.log("terjadi kesalahan, silakan coba lagi");
          this.askLecturerIDDelete();
        } else {
          this.lecturer.getAll((err, lecturers) => {
            if (err) {
              console.log("terjadi kesalahan, silakan coba lagi");
              this.menuDosen();
            } else {
              console.log(`dosen dengan ID ${lecturerID} telah dihapus.`);
              this.lecturerView.showAllLecturers(lecturers);
              this.menuDosen();
            }
          });
        }
      });
    });
  }

  // Mata Kuliah Menu
  menuMataKuliah() {
    this.subjectView.showFeatures();

    this.rl.question("masukkan salah satu no. dari opsi di atas:", (option) => {
      switch (option) {
        case "1":
          this.subject.getAll((err, subjects) => {
            if (err) {
              console.log("terjadi kesalahan, silakan coba lagi");
              this.menuMataKuliah();
            } else {
              this.subjectView.showAllSubjects(subjects);
              this.menuMataKuliah();
            }
          });
          break;
        case "2":
          this.askSubjectID();
          break;
        case "3": //tambah
          this.askDetailSubject();
          break;
        case "4": //hapus
          this.askSubjectIDDelete();
          break;
        case "5": //kembali
          this.mainMenu();
          break;

        default:
          console.log("Anda salah memasukkan opsi");
          this.mainMenu(user);
          break;
      }
    });
  }

  askSubjectID() {
    this.rl.question("Masukkan ID mata kuliah:", (subjectID) => {
      this.subject.getSubjectByID(subjectID, (err, subjects) => {
        if (err) {
          console.log("terjadi kesalahan, silakan coba lagi");
          this.askSubjectID();
        } else if (subjects.length == 0) {
          console.log(`mata kuliah dengan id ${subjectID} tidak terdaftar`);
          console.log("======================================================");
          this.askSubjectID();
        } else {
          this.subjectView.showOneSubject(subjects[0]);
          this.menuMataKuliah();
        }
      });
    });
  }

  askDetailSubject() {
    console.log("lengkapi data di bawah ini:");
    this.rl.question("nama mata kuliah:", (subjectName) => {
      this.rl.question("jumlah sks:", (sks) => {
        this.rl.question("id jurusan:", (majorID) => {
          this.subject.add(subjectName, sks, majorID, (err) => {
            if (err) {
              console.log("terjadi kesalahan, silakan coba lagi");
              this.askDetailSubject();
            } else {
              this.subject.getAll((err, subjects) => {
                if (err) {
                  console.log("terjadi kesalahan, silakan coba lagi");
                  this.menuMataKuliah();
                } else {
                  this.subjectView.showAllSubjects(subjects);
                  this.menuMataKuliah();
                }
              });
            }
          });
        });
      });
    });
  }

  askSubjectIDDelete() {
    this.rl.question(
      "masukkan ID mata kuliah yang akan dihapus:",
      (subjectID) => {
        this.subject.deleteSubjectByID(subjectID, (err) => {
          if (err) {
            console.log("terjadi kesalahan, silakan coba lagi");
            this.askSubjectIDDelete();
          } else {
            this.subject.getAll((err, subjects) => {
              if (err) {
                console.log("terjadi kesalahan, silakan coba lagi");
                this.menuMataKuliah();
              } else {
                console.log(
                  `mata kuliah dengan ID ${subjectID} telah dihapus.`
                );
                this.subjectView.showAllSubjects(subjects);
                this.menuMataKuliah();
              }
            });
          }
        });
      }
    );
  }

  // Kontrak Menu
  menuKontrak() {
    this.contractView.showFeatures();

    this.rl.question("masukkan salah satu no. dari opsi di atas:", (option) => {
      switch (option) {
        case "1":
          this.contract.getAll((err, contracts) => {
            if (err) {
              console.log("terjadi kesalahan, silakan coba lagi");
              this.menuKontrak();
            } else {
              this.contractView.showAllContracts(contracts);
              this.menuKontrak();
            }
          });
          break;
        case "2":
          this.askContractID();
          break;
        case "3": //tambah
          this.askDetailContract();
          break;
        case "4": //hapus
          this.askContractIDDelete();
          break;
        case "5": //kembali
          this.mainMenu();
          break;

        default:
          console.log("Anda salah memasukkan opsi");
          this.mainMenu(user);
          break;
      }
    });
  }

  askContractID() {
    this.rl.question("Masukkan ID kontrak:", (contractID) => {
      this.contract.getContractByID(contractID, (err, contracts) => {
        if (err) {
          console.log("terjadi kesalahan, silakan coba lagi");
          this.askContractID();
        } else if (contracts.length == 0) {
          console.log(`kontrak dengan id ${contractID} tidak terdaftar`);
          console.log("======================================================");
          this.askContractID();
        } else {
          this.contractView.showOneContract(contracts[0]);
          this.menuKontrak();
        }
      });
    });
  }

  askDetailContract() {
    console.log("lengkapi data di bawah ini:");
    this.rl.question("nilai mata kuliah:", (nilai) => {
      this.rl.question("nim mahasiswa:", (nim) => {
        this.rl.question("id mata kuliah:", (id_mk) => {
          this.rl.question("id dosen:", (id_dosen) => {
            this.contract.add(nilai, nim, id_mk, id_dosen, (err) => {
              if (err) {
                console.log("terjadi kesalahan, silakan coba lagi");
                this.askDetailContract();
              } else {
                this.contract.getAll((err, contracts) => {
                  if (err) {
                    console.log("terjadi kesalahan, silakan coba lagi");
                    this.menuKontrak();
                  } else {
                    this.contractView.showAllContracts(contracts);
                    this.menuKontrak();
                  }
                });
              }
            });
          });
        });
      });
    });
  }

  askContractIDDelete() {
    this.rl.question("masukkan ID kontrak yang akan dihapus:", (contractID) => {
      this.contract.deleteContractByID(contractID, (err) => {
        if (err) {
          console.log("terjadi kesalahan, silakan coba lagi");
          this.askContractIDDelete();
        } else {
          this.contract.getAll((err, contracts) => {
            if (err) {
              console.log("terjadi kesalahan, silakan coba lagi");
              this.menuKontrak();
            } else {
              console.log(`kontrak dengan ID ${contractID} telah dihapus.`);
              this.contractView.showAllContracts(contracts);
              this.menuKontrak();
            }
          });
        }
      });
    });
  }
}
