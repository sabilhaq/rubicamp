const params = process.argv;
const fs = require('fs');

const readData = () => JSON.parse(fs.readFileSync('todo.json', 'utf-8'));

const writeData = (data) => fs.writeFileSync('todo.json', JSON.stringify(data, null, 2), 'utf-8');

const help = () => {
  console.log('>>> JS TODO <<<');
  console.log('$ node todo.js <command>');
  console.log('$ node todo.js list');
  console.log('$ node todo.js task');
  console.log('$ node todo.js task <task_id>');
  console.log('$ node todo.js add <task_content>');
  console.log('$ node todo.js delete <task_id>');
  console.log('$ node todo.js complete <task_id>');
  console.log('$ node todo.js uncomplete <task_id>');
  console.log('$ node todo.js list:outstanding asc|desc');
  console.log('$ node todo.js list:completed asc|desc');
  console.log('$ node todo.js tag <task_id> <tag_name_1> <tag_name_2> ... <tag_name_N>');
  console.log('$ node todo.js filter:<tag_name>');
};

let todos = readData();
const id = params[3];

switch (params[2]) {
  case 'list':
    console.log('Daftar Pekerjaan');
    todos.forEach((todo, index) => {
      console.log(`${index + 1}. [${todo.complete ? 'x' : ' '}] ${todo.title}`);
    });
    break;

  case 'task':
    if (id < 1 || id > todos.length) {
      console.log(`id : ${id}, tidak ditemukan`);
    } else {
      console.log(`daftar kerjaan dengan id : ${id} adalah :`);
      console.log(`title    : ${todos[id - 1].title}`);
      console.log(`complete : ${todos[id - 1].complete ? 'done' : 'not yet'}`);
      console.log(`tags     : ${todos[id - 1].tags}`);
    }
    break;

  case 'add':
    const title = params.slice(3).join(' ');
    todos.push({ title, complete: false, tags: [] });
    writeData(todos);
    console.log(`"${title}" telah ditambahkan`);
    break;

  case 'delete':
    if (id < 1 || id > todos.length) {
      console.log(`id : ${id}, tidak ditemukan`);
    } else {
      console.log(`"${todos[id - 1].title}" telah dihapus dari daftar`);
      todos.splice(id - 1, 1);
      writeData(todos);
    }
    break;

  case 'complete':
    if (id < 1 || id > todos.length) {
      console.log(`id : ${id}, tidak ditemukan`);
    } else {
      console.log(`"${todos[id - 1].title}" telah selesai`);
      todos[id - 1].complete = true;
      writeData(todos);
    }
    break;

  case 'uncomplete':
    if (id < 1 || id > todos.length) {
      console.log(`id : ${id}, tidak ditemukan`);
    } else {
      console.log(`"${todos[id - 1].title}" status selesai dibatalkan`);
      todos[id - 1].complete = false;
      writeData(todos);
    }
    break;

  case 'list:outstanding':
    console.log('Daftar Pekerjaan yang Belum Dikerjakan');
    if (params[3] == 'asc') {
      for (let i = 0; i < todos.length; i++) {
        if (!todos[i].complete) {
          console.log(`${i + 1}. [${todos[i].complete ? 'x' : ' '}] ${todos[i].title}`);
        }
      }
    } else if (params[3] == 'desc') {
      for (let i = todos.length - 1; i >= 0; i--) {
        if (!todos[i].complete) {
          console.log(`${i + 1}. [${todos[i].complete ? 'x' : ' '}] ${todos[i].title}`);
        }
      }
    } else {
      console.log('tolong sertakan mode urutnya seperti asc atau desc');
    }
    break;

  case 'list:completed':
    console.log('Daftar Pekerjaan yang Sudah Dikerjakan');
    if (params[3] == 'asc') {
      for (let i = 0; i < todos.length; i++) {
        if (todos[i].complete) {
          console.log(`${i + 1}. [${todos[i].complete ? 'x' : ' '}] ${todos[i].title}`);
        }
      }
    } else if (params[3] == 'desc') {
      for (let i = todos.length - 1; i >= 0; i--) {
        if (todos[i].complete) {
          console.log(`${i + 1}. [${todos[i].complete ? 'x' : ' '}] ${todos[i].title}`);
        }
      }
    } else {
      console.log('tolong sertakan mode urutnya seperti asc atau desc');
    }
    break;

  case 'tag':
    if (id < 1 || id > todos.length) {
      console.log(`id : ${id}, tidak ditemukan`);
    } else {
      const tags = params.slice(4);
      let tagAdded = [];
      tags.forEach((tag) => {
        if (!todos[id - 1].tags.includes(tag)) {
          todos[id - 1].tags.push(tag);
          tagAdded.push(tag);
        }
      });
      writeData(todos);
      console.log(`Tag "${tagAdded}" telah ditambahkan ke daftar "${todos[id - 1].title}"`);
    }
    break;

  default:
    if (params[2]?.split(':')[0] == 'filter') {
      console.log(`Hasil pencarian dengan tag "${params[2].split(':')[1]}":`);
      todos.forEach((todo, index) => {
        if (todo.tags.includes(params[2].split(':')[1])) {
          console.log(`${index + 1}. [${todo.complete ? 'x' : ' '}] ${todo.title}`);
        }
      });
    } else {
      help();
    }
    break;
}
