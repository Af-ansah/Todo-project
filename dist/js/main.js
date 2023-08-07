class Todo {
  constructor(text, completed = false) {
    this.id = this.generateID();
    this.text = text;
    this.completed = completed;
  }

  generateID = () => new Date().getUTCMilliseconds();
  static create = (text, completed) => {
    const instance = new Todo(text, completed);
    return instance;
  };
}

const todoListParent = document.getElementById("todo-list");
const checkboxElements = document.querySelectorAll(".checkbox");
const todoCheckbox = document.getElementById("todo-checkbox");
const todoInput = document.getElementById("todo-input");
const filterBtn = document.querySelectorAll(".filter-btn");
const todoClearCompletedBtn = document.getElementById("btn-clear-completed");

const STATUS = {
  ALL: "all",
  ACTIVE: "active",
  COMPLETED: "completed",
};

let status = STATUS.ALL;

let todos = [
  Todo.create("Go to the market", true),
  Todo.create("Stop Singing GLoria"),
  Todo.create("You will go home", true),
  Todo.create("Go to the market"),
];
let filteredTodos = [];

const toggleFilterButton = (status = "all") => {
  filterBtn.forEach((el) => {
    el.getAttribute("data-value") === status
      ? el.classList.add("active")
      : el.classList.remove("active");
  });
};

const checkboxClickHandler = function () {
  const isActive = this.classList.contains("active");
  console.log(this.classList);
  if (isActive) {
    this.classList.remove("active");
  } else {
    this.classList.add("active");
  }
};

const deleteTodoHandler = function () {
  const li = this.parentElement.parentElement;
  const key = li.getAttribute("data-key");
  document.querySelector(`li[data-key='${key}']`).remove();
  todos = [...todos].filter((todo) => todo.id !== key);
};

const liNode = (id, text, completed = false) => {
  const html = `<li class="todo-list__item" data-key="${id}">
  <div class="card">
    <button data-completed="${completed}" class="checkbox ${
    completed ? "active" : ""
  }">
  <img src="./dist/images/icon-check.svg" alt=""></button>
    <p>${text}</p>
    <button class="close-btn">
      <img width="15px" src="./dist/images/icon-cross.svg" alt="" />
    </button>
  </div>
</li>`;

  return html;
};

const listTodos = (_todos, status = "all") => {
  // remove all existing li from parents tree
  document.querySelectorAll("li[data-key]").forEach((el) => {
    el.remove();
  });
  _todos.forEach((todo) => {
    const element = liNode(todo.id, todo.text, todo.completed);
    todoListParent.insertAdjacentHTML("afterbegin", element);
  });

  document.querySelectorAll(".checkbox").forEach((_el) => {
    _el.addEventListener("click", checkboxClickHandler);
  });

  document.querySelectorAll(".close-btn").forEach((el) => {
    el.addEventListener("click", deleteTodoHandler);
  });

  toggleFilterButton(status);
};

const addNewTodo = (id, text, completed) => {
  todoListParent.insertAdjacentHTML("afterbegin", liNode(id, text, completed));
};

checkboxElements.forEach((el) => {
  // console.log(el);
  // el.addEventListener("click", checkboxClickHandler);
});

//
todoInput.addEventListener("keydown", function (e) {
  if (e.key.toLowerCase() === "enter" || e.keyCode === 13) {
    const checked = document
      .getElementById("todo-checkbox")
      .classList.contains("active");
    const list = [...todos];
    const todo = Todo.create(e.target.value, checked);
    list.push(todo);
    todos = list;
    addNewTodo(todo.id, todo.text, todo.completed);
    // clear
    todoCheckbox.classList.remove("active");
    todoInput.value = "";
  }
});

todoClearCompletedBtn.addEventListener("click", function () {
  const _todos = [...todos].map((todo) => Todo.create(todo.text));
  todos = _todos;
  listTodos(todos);
});

filterBtn.forEach((el) => {
  el.addEventListener("click", function () {
    const _status = this.getAttribute("data-value");
    const list = [...todos].filter((todo) =>
      _status === STATUS.ACTIVE
        ? !todo.completed
        : _status === STATUS.COMPLETED
        ? todo.completed
        : true
    );
    listTodos(list);
    toggleFilterButton(_status);
  });
});

listTodos(todos);
