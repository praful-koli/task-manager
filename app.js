const taskData = [{}];

function selector(element) {
  return document.querySelector(element);
}

// selector
const addTask = selector(".add-btn");
const taskName = selector(".task-name");
const taskDetails = selector(".task-details");
const taskImportant = selector(".check"); 
const taskPriority = selector(".priority"); 
const taskList = selector(".tasks-list"); 
const delteAllTask = selector(".delete-all-btn");

//  track current filter
let currentFilter = "all";

function setFilter(filterValue, btnEl) {
  currentFilter = filterValue;

  // update active tab highlight
  document.querySelectorAll(".filter-tab").forEach((btn) =>
    btn.classList.remove("active")
  );
  btnEl.classList.add("active");

  // re-render with the new filter
  loadTasksFromLocalStorage();
}
// ──────────────────────────────────────────────────────────────────────────

// logic function

//get task from localStorage
function getTasksLocalStorage() {
  return localStorage.getItem("task") || "[]";
}

//save task in localStorage
function saveTaskLocalStorage(task) {
  let oldTasks = JSON.parse(getTasksLocalStorage());
  oldTasks.unshift(task);
  let newTasks = JSON.stringify(oldTasks);
  localStorage.setItem("task", newTasks);
}

// ── NEW: update a single task's status in localStorage ─────────────────────
function updateTaskStatusInLocalStorage(title, newStatus) {
  let tasks = JSON.parse(getTasksLocalStorage());
  tasks = tasks.map((t) => {
    if (t.title === title) {
      return { ...t, status: newStatus };
    }
    return t;
  });
  localStorage.setItem("task", JSON.stringify(tasks));
}
// ──────────────────────────────────────────────────────────────────────────

// save task to localStorage
function addTasks(e) {
  const newTask = {
    title: taskName.value,
    description: taskDetails.value,
    priority: taskPriority.value,
    status: "Not Started",
    important: taskImportant.checked,
  };

  saveTaskLocalStorage(newTask);
  loadTasksFromLocalStorage();

  // reset inputs
  taskName.value = "";
  taskDetails.value = "";
  taskImportant.checked = false;
  taskPriority.value = "";
}

function loadTasksFromLocalStorage() {
  let tasks = JSON.parse(getTasksLocalStorage());

// apply filter 
  const statusMap = {
    "not-started": "Not Started",
    "in-progress": "In Progress",
    "completed": "Completed",
  };

  const filteredTasks =
    currentFilter === "all"
      ? tasks
      : tasks.filter((t) => t.status === statusMap[currentFilter]);
  // ──────────────────────────────────────────────────────────────────────

  taskList.innerHTML = "";






  filteredTasks.forEach((taskData) => {
    const task = document.createElement("div");
    task.classList.add("task");

    // restore left-border colour and icon based on saved status
    let borderColor = "#6B7280";
    let statusBtnIcon = "⏸";
    let statusBgColor = "#484747";

    if (taskData.status === "In Progress") {
      borderColor = "#8277F5";
      statusBtnIcon = "⚡";
      statusBgColor = "#8277F5";
    } else if (taskData.status === "Completed") {
      borderColor = "#2FCD69";
      statusBtnIcon = "✅";
      statusBgColor = "#2FCD69";
    }

    task.style.setProperty("border-left", `5px solid ${borderColor}`);

    task.innerHTML = `
      <div class="task-status-btn">${statusBtnIcon}</div>
      <div class="left">
        <div class="task-content">
          <p class="task-title">${taskData.title}</p>
          <p class="task-description">${taskData.description}</p>
        </div>
        <div class="status-display">
          <div class="task-text-priority ${taskData.priority}-priority">${taskData.priority}</div>
          <div class="task-status" style="background-color:${statusBgColor}">${taskData.status}</div>
          <div class="isimportant">${taskData.important ? "✨" : ""}</div>
        </div>
      </div>
      <div class="right">
        <i class="ri-close-line"></i>
      </div>
    `;

    // progress status
    const statusBtn = task.querySelector(".task-status-btn");
    const statusText = task.querySelector(".task-status");

    statusBtn.addEventListener("click", () => {
      let taskProgress = statusText.textContent;
      let nextStatus;

      if (taskProgress === "Not Started") {
        nextStatus = "In Progress";
        statusText.textContent = nextStatus;
        statusBtn.textContent = "⚡";
        task.style.setProperty("border-left", "5px solid #8277F5");
        statusText.style.backgroundColor = "#8277F5";
      } else if (taskProgress === "In Progress") {
        nextStatus = "Completed";
        statusText.textContent = nextStatus;
        statusBtn.textContent = "✅";
        task.style.setProperty("border-left", "5px solid #2FCD69");
        statusText.style.backgroundColor = "#2FCD69";
      } else {
        nextStatus = "Not Started";
        statusText.textContent = nextStatus;
        statusBtn.textContent = "⏸";
        task.style.setProperty("border-left", "5px solid #6B7280");
        statusText.style.backgroundColor = "#6B7280";
      }
      updateTaskStatusInLocalStorage(taskData.title, nextStatus);



    });

    // delete task
    const deleteTask = task.querySelector(".ri-close-line");
    deleteTask.addEventListener("click", () => {
      task.remove();
      let updatedTasks = JSON.parse(getTasksLocalStorage()).filter(
        (t) => t.title !== taskData.title
      );
      localStorage.setItem("task", JSON.stringify(updatedTasks));
      document.querySelector("#taskCount").textContent = updatedTasks.length;
    });

    taskList.append(task);
  });

  document.querySelector("#taskCount").textContent = tasks.length;
}






addTask.addEventListener("click", (e) => {
  addTasks(e);
});


delteAllTask.addEventListener("click", () => {
  localStorage.clear();
  loadTasksFromLocalStorage();
});

document.addEventListener("DOMContentLoaded", () => {
  loadTasksFromLocalStorage();
});