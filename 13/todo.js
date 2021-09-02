const { argv } = require("process");
const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "$ node todo.js ",
});
const fs = require("fs");

if (argv[2] === undefined || argv[2] === "help") {
  console.log(">>> JS TODO <<<");
  let arr = [
    "<command>",
    "list",
    "task",
    "task <task_id>",
    "add <task_content>",
    "delete <task_id>",
    "complete <task_id>",
    "uncomplete <task_id>",
    "list:outstanding asc|desc",
    "list:completed asc|desc",
    "tag <task_id> <tag_name_1> <tag_name_2> ... <tag_name_N>",
    "filter:<tag_name>",
  ];

  for (let i = 0; i < arr.length; i++) {
    rl.prompt();
    console.log(arr[i]);
  }
  rl.close();
}

let todos = [];

function addOne(text) {
  if (fs.existsSync("todo.json")) {
    let data = fs.readFileSync("todo.json", "utf-8");
    let todos = JSON.parse(data);
    let todo = {
      text,
      checked: false,
      createdAt: Date.now(),
      tags: [],
    };
    todos.push(todo);
    let newData = JSON.stringify(todos);
    fs.writeFileSync("todo.json", newData);
  } else {
    let todo = {
      text,
      checked: false,
      createdAt: Date.now(),
      tags: [],
    };
    todos.push(todo);
    let data = JSON.stringify(todos);
    fs.writeFileSync("todo.json", data);
  }
}

function getListFilteredSorted(filter, sort) {
  if (fs.existsSync("todo.json")) {
    let data = fs.readFileSync("todo.json", "utf-8");
    let todos = JSON.parse(data);
    let filteredTodos = [];

    console.log("Daftar Pekerjaan");

    switch (filter) {
      case "outstanding":
        filteredTodos = todos.filter((task) => {
          return task.checked == false;
        });

        break;
      case "completed":
        filteredTodos = todos.filter((task) => {
          return task.checked == true;
        });
        break;
      case undefined:
        filteredTodos = todos;
        break;
      default:
        filteredTodos = todos.filter((task) => {
          return task.tags.includes(filter);
        });
        break;
    }

    switch (sort) {
      case "asc":
        todos.sort(function (a, b) {
          return a.createdAt - b.createdAt;
        });
        break;
      case "desc":
        todos.sort(function (a, b) {
          return b.createdAt - a.createdAt;
        });
        break;
      default:
        break;
    }

    for (let i = 0; i < filteredTodos.length; i++) {
      console.log(
        `${i + 1}. ${filteredTodos[i].checked ? "[x]" : "[ ]"} ${
          filteredTodos[i].text
        }.`
      );
    }
  }
}

function deleteOne(id) {
  if (fs.existsSync("todo.json")) {
    let data = fs.readFileSync("todo.json", "utf-8");
    let todos = JSON.parse(data);
    deletedTodo = todos[id].text;
    todos.splice(id, 1);

    let newData = JSON.stringify(todos);
    fs.writeFileSync("todo.json", newData);
    return deletedTodo;
  }
}

function completeOne(id) {
  if (fs.existsSync("todo.json")) {
    let data = fs.readFileSync("todo.json", "utf-8");
    let todos = JSON.parse(data);
    todos[id].checked = true;
    completedTodo = todos[id].text;
    let newData = JSON.stringify(todos);
    fs.writeFileSync("todo.json", newData);
    return completedTodo;
  }
}

function uncompleteOne(id) {
  if (fs.existsSync("todo.json")) {
    let data = fs.readFileSync("todo.json", "utf-8");
    let todos = JSON.parse(data);
    todos[id].checked = false;
    uncompletedTodo = todos[id].text;
    let newData = JSON.stringify(todos);
    fs.writeFileSync("todo.json", newData);
    return uncompletedTodo;
  }
}

function addTags(taskID, tags) {
  if (fs.existsSync("todo.json")) {
    let data = fs.readFileSync("todo.json", "utf-8");
    let todos = JSON.parse(data);

    for (let i = 0; i < tags.length; i++) {
      todos[taskID].tags.push(tags[i]);
    }
    todoText = todos[taskID].text;
    let newData = JSON.stringify(todos);
    fs.writeFileSync("todo.json", newData);
    return todoText;
  }
}

function todoList() {
  // add feature
  if (argv[2] == "add") {
    let content = argv.slice(3);
    let todo = content.join(" ");

    addOne(todo);
    console.log(`"${todo}" telah ditambahkan.`);
    rl.close();
  }

  // delete feature
  if (argv[2] == "delete") {
    let todo = deleteOne(argv[3] - 1);
    console.log(`'${todo}' telah dihapus dari daftar`);
    rl.close();
  }

  // complete feature
  if (argv[2] == "complete") {
    let todo = completeOne(argv[3] - 1);
    console.log(`"${todo}" telah selesai.`);
    rl.close();
  }

  // uncomplete feature
  if (argv[2] == "uncomplete") {
    let todo = uncompleteOne(argv[3] - 1);
    console.log(`"${todo}" status selesai dibatalkan.`);
    rl.close();
  }

  // get list sorted and filtered feature
  if (argv[2] !== undefined) {
    let filterArr = argv[2].split(":");
    if (filterArr[0] == "list" || filterArr[0] == "filter") {
      let filter;
      if (filterArr.length > 1) {
        filter = filterArr[1];
      }
      let sort = argv[3];
      getListFilteredSorted(filter, sort);
      rl.close();
    }
  }

  // add tags feature
  if (argv[2] == "tag") {
    let tagsText = argv.slice(4);
    let taskID = argv[3] - 1;
    let todo = addTags(taskID, tagsText);
    console.log(
      `Tag '${tagsText.toString()}' telah ditambahkan ke daftar '${todo}'`
    );
    rl.close();
  }
}

todoList();
