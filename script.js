const tasksContainer = document.querySelector(".tasks-container");
const editContainer = document.querySelector(".edit-container");
const listContainer = document.querySelector(".list");

const addTask = document.querySelector("#addTask");
const inputAdd = document.querySelector("#inputTask");
const btnAdd = document.querySelector("#btnAddTask");
const inputEdit = document.querySelector("#inputEditTask");

const inputSearch = document.querySelector(".inputSearchTask");
const btnSearch = document.querySelector("#btnSearchTask");

const inputFilter = document.querySelector("#filterTask select");

let oldValueEdit;

const setError = (text, number = 2000) => {
  const errorMessage = document.querySelector("#error");
  errorMessage.innerHTML = text;
  inputAdd.classList.add("error");

  setTimeout(() => {
    errorMessage.innerHTML = "";
    inputAdd.classList.remove("error");
  }, number);
};

const checkExist = (text) => {
  const todos = document.querySelectorAll(".todo");
  let exists = false;

  todos.forEach((todo) => {
    let texts = todo.querySelector("h3").innerText.toLowerCase();
    const input = text.toLowerCase();

    if (texts === input) {
      exists = true;
    }
  });

  return exists;
};

const toggleHide = () => {
  editContainer.classList.toggle("hide");
  tasksContainer.classList.toggle("hide");
};

const newTask = (text, done = 0, save = 1) => {
  const todo = `
    
        <li class="todo 
            ${done 
            ? "done" 
            : ""
            }"
        >
            <h3>${text}</h3>
            <button class="todoTasks checkList">
                <i class="
                ${done 
                    ? "fa-solid fa-arrow-rotate-left" 
                    : "fa-solid fa-check"
                }
                "></i>
            </button>
            <button
                class="todoTasks editList">
                <i class="fa-solid fa-pen"></i>
            </button>
            <button
                class="todoTasks removeList">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </li>
    
    `;

  listContainer.innerHTML = listContainer.innerHTML + todo;

  if (save) {
    saveTodoLocalStorage({
      text,
      done,
    });
  }

  inputAdd.value = "";
  inputAdd.focus();
};

const editListTask = (text) => {
  const todos = document.querySelectorAll(".todo");

  todos.forEach((todo) => {
    let texts = todo.querySelector("h3");

    if (texts.innerText === oldValueEdit) {
      texts.innerText = text;

      editTodoLocalStorage(oldValueEdit, text);
    }
  });
};

const searchTask = (search) => {
  const todos = document.querySelectorAll(".todo");

  todos.forEach((h3) => {
    let texts = h3.querySelector("h3").innerText.toLowerCase();
    const newSearch = search.toLowerCase();

    h3.style.display = "flex";

    if (!texts.includes(newSearch)) {
      h3.style.display = "none";
    }
  });
};

const filterTask = (valueInputFilter) => {
  const todos = document.querySelectorAll(".todo");

  switch (valueInputFilter) {
    case "all":
      todos.forEach((todo) => (todo.style.display = "flex"));
      break;
    case "done":
      todos.forEach((todo) =>
        todo.classList.contains("done")
          ? (todo.style.display = "flex")
          : (todo.style.display = "none")
      );
      break;
    case "undone":
      todos.forEach((todo) =>
        !todo.classList.contains("done")
          ? (todo.style.display = "flex")
          : (todo.style.display = "none")
      );
      break;
    default:
      break;
  }
};

btnAdd.addEventListener("click", (e) => {
  e.preventDefault();

  const inputValue = inputAdd.value.trim();

  if (!inputValue) {
    setError("Informe o nome da tarefa.");
    inputAdd.focus();
    return;
  }

  const alreadyExist = checkExist(inputValue);
  if (alreadyExist) {
    setError("Já existe uma tarefa com esse nome.");

    inputAdd.value = "";
    inputAdd.focus();

    return;
  }

  newTask(inputValue);
});

document.addEventListener("click", (e) => {
  const target = e.target;
  const parentEl = target.closest("li");
  let title;

  if (parentEl && parentEl.querySelector("h3")) {
    title = parentEl.querySelector("h3").innerText;
  }

  if (target.classList.contains("removeList")) {
    parentEl.remove();
    removeTodoLocalStorage(title);
  }

  if (target.classList.contains("checkList")) {
    parentEl.classList.toggle("done");

    const isDone = parentEl.classList.contains("done");
    const icon = parentEl.querySelector("i");

    if (isDone) {
      icon.classList = "";
      icon.classList.add("fa-solid", "fa-arrow-rotate-left");
    } else {
      icon.classList = "";
      icon.classList.add("fa-solid", "fa-check");
    }

    statusTodoLocalStorage(title);
  }

  if (target.classList.contains("editList")) {
    toggleHide();
    oldValueEdit = parentEl.querySelector("h3").innerText;
    inputEdit.value = oldValueEdit;
  }

  if (target.classList.contains("btnCancelEdit")) {
    e.preventDefault();
    toggleHide();
  }
});

editContainer.addEventListener("submit", (e) => {
  e.preventDefault();

  if (inputEdit) {
    editListTask(inputEdit.value);
  }

  toggleHide();
});

inputSearch.addEventListener("keyup", (e) => {
  const search = e.target.value;

  searchTask(search);
});

btnSearch.addEventListener("click", (e) => {
  e.preventDefault();

  inputSearch.value = "";

  inputSearch.dispatchEvent(new Event("keyup"));
});

inputFilter.addEventListener("change", () => {
  const valueInputFilter = inputFilter.value;

  filterTask(valueInputFilter);
});

const getTodoLocalStorage = () => {
  const todos = JSON.parse(localStorage.getItem("todos")) || [];
  return todos;
};

const loadTodoLocalStorage = () => {
  const todos = getTodoLocalStorage();
  todos.forEach((todo) => {
    newTask(todo.text, todo.done, 0);
  });
};

const saveTodoLocalStorage = (todo) => {
  const todos = getTodoLocalStorage();

  todos.push(todo);

  localStorage.setItem("todos", JSON.stringify(todos));
};

const removeTodoLocalStorage = (todoText) => {
  const todos = getTodoLocalStorage();
  const filtered = todos.filter((todo) => todo.text.trim() !== todoText);

  localStorage.setItem("todos", JSON.stringify(filtered));
};


const statusTodoLocalStorage = (todoText) => {
  const todos = getTodoLocalStorage();

  todos.map((todo) =>
    todo.text === todoText ? (todo.done = !todo.done) : null
  );

  localStorage.setItem("todos", JSON.stringify(todos));
};

const editTodoLocalStorage = (oldText, newText) => {
  const todos = getTodoLocalStorage();

  todos.map((todo) => (todo.text === oldText ? (todo.text = newText) : null));

  localStorage.setItem("todos", JSON.stringify(todos));
};

loadTodoLocalStorage();
