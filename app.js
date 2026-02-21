const taskData = [{}];

function selector(element) {
  return document.querySelector(element);
}

/**
 *  console.log("taskName:", taskName.value);          // text input
    console.log("taskDetails:", taskDetails.value);    // textarea/text input
    console.log("taskImportant:", taskImportant.checked); // checkbox true/false
    console.log("taskPriority:", taskPriority.value);  // select value
 */
// status

// selector
const addTask = selector(".add-btn");
const taskName = selector(".task-name"); // fixed: added "."
const taskDetails = selector(".task-details");
const taskImportant = selector(".check"); // is task important or not
const taskPriority = selector(".priority"); // task priority low medium high
const taskList = selector(".tasks-list"); // add task in  the box
const delteAllTask = selector('.delete-all-btn')

// logic function

getTask = localStorage.getItem("t");
//get task form localstroage
function getTasksLocalStorage() {
  return localStorage.getItem("task") || "[]";
}

//save task in localstorage
function saveTaskLocalStorage(task) {
  let oldTasks = JSON.parse(getTasksLocalStorage());
  oldTasks.unshift(task);
  let newTasks = JSON.stringify(oldTasks);
  localStorage.setItem("task", newTasks);
}
// save task to localstorage
function addTasks(e) {
  const newTask = {
    title: taskName.value,
    description: taskDetails.value,
    priority: taskPriority.value,
    status: "Not Started",
    important: taskImportant.checked,
  };

  saveTaskLocalStorage(newTask);
  loadTasksFromLocalStorage()
 
  // reset inputs
  taskName.value = "";
  taskDetails.value = "";
  taskImportant.checked = false;
  taskPriority.value = "";
}


function taskPriorityColor(priority) {
    const taskPriorityText = document.querySelector('.task-text-priority')
    if (priority === "low"){
        taskPriorityText.classList.add('low-priority')
    } else if(priority === "medium") {
         taskPriorityText.classList.add('medium-priority')
    } else {
        taskPriorityText.classList.add('high-priority')
    }
}

function loadTasksFromLocalStorage() {
  const tasks = JSON.parse(getTasksLocalStorage());
taskList.innerHTML = ''
  tasks.forEach((taskData) => {
    const task = document.createElement("div");
    task.classList.add("task");
    
    task.innerHTML = `
           <div class="task-status-btn">⏸</div>
             <div class="left">
               <div class="task-content">
                  <p class="task-title">${taskData.title}</p>
                  <p class="task-description">${taskData.description}</p>
               </div>
            <div class="status-display">
          <div class="task-text-priority">${taskData.priority}</div>
        <div class="task-status">${taskData.status}</div>
        <div class="isimportant">${taskData.important ? "✨" : ""}</div>
      </div>
    </div>
    <div class="right">
      <i class="ri-close-line"></i>
    </div>
        `;
  


//  progress status
  const statusBtn = task.querySelector(".task-status-btn");
  const statusText = task.querySelector(".task-status");

  statusBtn.addEventListener("click", () => {
    let taskProgress = statusText.textContent;

    if (taskProgress === "Not Started") {
      statusText.textContent = "In Progress";
      statusBtn.textContent = "⚡";
      task.style.setProperty("border-left", "5px solid #8277F5");
      statusText.style.backgroundColor = "#8277F5";
    } else if (taskProgress === "In Progress") {
      statusText.textContent = "Completed";
      statusBtn.textContent = "✅";
      task.style.setProperty("border-left", "5px solid #2FCD69");
      statusText.style.backgroundColor = "#2FCD69";
    } else {
      statusText.textContent = "Not Started";
      statusBtn.textContent = "⏸";
      task.style.setProperty("border-left", "5px solid #6B7280");
      statusText.style.backgroundColor = "#6B7280";
    }
  });

  //delete task
    const deleteTask = task.querySelector(".ri-close-line");
    deleteTask.addEventListener("click", (e) => {
      task.remove();
       let updatedTasks = JSON.parse(getTasksLocalStorage())
       .filter(t => t.title != taskData.title)
        
        localStorage.setItem('task' ,JSON.stringify(updatedTasks))
    });

    taskList.append(task);

  });

   document.querySelector('#taskCount').textContent = `${JSON.parse(getTasksLocalStorage()).length}`
}

// event
addTask.addEventListener("click", (e) => {
  addTasks(e);
});

// delete all task
delteAllTask.addEventListener('click',()=>{
    localStorage.clear()
    loadTasksFromLocalStorage()
}) 

document.addEventListener("DOMContentLoaded", () => {
  loadTasksFromLocalStorage();
});

