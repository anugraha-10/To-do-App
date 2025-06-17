// Step 1: Get the elements
const addTaskBtn = document.getElementById('addTaskBtn');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const clearAllBtn = document.getElementById('clearAll');

// Function to add task
function addTask() {
  const taskText = taskInput.value.trim(); // get the value and remove extra spaces

  if (taskText === '') {
    alert('Please enter a task');
    return;
  }

  // Step 3: Create a new <li> element
  const li = document.createElement('li');
  li.draggable = true; // Make the list item draggable

  // Create checkbox
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'task-checkbox';
  
  // Create task text span
  const taskSpan = document.createElement('span');
  taskSpan.textContent = taskText;
  taskSpan.className = 'task-text';

  // Add checkbox change event
  checkbox.addEventListener('change', function() {
    taskSpan.classList.toggle('completed');
    updateTaskCount();
    saveTasks(); // Save tasks after completion status changes
  });

  // Add drag event listeners
  li.addEventListener('dragstart', function(e) {
    e.dataTransfer.setData('text/plain', ''); // Required for Firefox
    li.classList.add('dragging');
  });

  li.addEventListener('dragend', function() {
    li.classList.remove('dragging');
    saveTasks(); // Save tasks after reordering
  });

  // Optional: Add click to remove
  li.addEventListener('click', function(e) {
    if (e.target !== checkbox) { // Don't remove if clicking checkbox
      li.remove();
      updateTaskCount();
      saveTasks(); // Save tasks after removal
    }
  });

  // Add elements to li
  li.appendChild(checkbox);
  li.appendChild(taskSpan);

  // Step 4: Add it to the list
  taskList.appendChild(li);

  // Step 5: Clear input
  taskInput.value = '';
  updateTaskCount();
  saveTasks(); // Save tasks after adding a new task
}

// Function to update task count
function updateTaskCount() {
  const totalTasks = taskList.children.length;
  const completedTasks = taskList.querySelectorAll('.completed').length;
  const taskCount = document.getElementById('taskCount');
  if (taskCount) {
    taskCount.textContent = `Tasks: ${completedTasks}/${totalTasks}`;
    // Change color to green if all tasks are completed
    if (completedTasks === totalTasks && totalTasks > 0) {
      taskCount.style.color = "#008000";
    } else {
      taskCount.style.color = "#ff0000";
    }
  }
}

// Function to save tasks to localStorage
function saveTasks() {
  const tasks = [];
  taskList.querySelectorAll('li').forEach(li => {
    const taskText = li.querySelector('.task-text').textContent;
    const isCompleted = li.querySelector('.task-checkbox').checked;
    tasks.push({ text: taskText, completed: isCompleted });
  });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to load tasks from localStorage
function loadTasks() {
  const storedTasks = localStorage.getItem('tasks');
  if (storedTasks) {
    const tasks = JSON.parse(storedTasks);
    tasks.forEach(task => {
      const li = document.createElement('li');
      li.draggable = true;

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'task-checkbox';
      checkbox.checked = task.completed;
      
      const taskSpan = document.createElement('span');
      taskSpan.textContent = task.text;
      taskSpan.className = 'task-text';
      if (task.completed) {
        taskSpan.classList.add('completed');
      }

      checkbox.addEventListener('change', function() {
        taskSpan.classList.toggle('completed');
        updateTaskCount();
        saveTasks();
      });

      li.addEventListener('dragstart', function(e) {
        e.dataTransfer.setData('text/plain', '');
        li.classList.add('dragging');
      });

      li.addEventListener('dragend', function() {
        li.classList.remove('dragging');
        saveTasks();
      });

      li.addEventListener('click', function(e) {
        if (e.target !== checkbox) {
          li.remove();
          updateTaskCount();
          saveTasks();
        }
      });

      li.appendChild(checkbox);
      li.appendChild(taskSpan);
      taskList.appendChild(li);
    });
    updateTaskCount();
  }
}

// Initial load of tasks when the page loads
document.addEventListener('DOMContentLoaded', loadTasks);

// Add drag and drop event listeners to the task list
taskList.addEventListener('dragover', function(e) {
  e.preventDefault();
  const draggingItem = document.querySelector('.dragging');
  const siblings = [...taskList.querySelectorAll('li:not(.dragging)')];
  
  const nextSibling = siblings.find(sibling => {
    const box = sibling.getBoundingClientRect();
    const offset = e.clientY - box.top - box.height / 2;
    return offset < 0;
  });

  taskList.insertBefore(draggingItem, nextSibling);
});

// Step 2: Add click listener
addTaskBtn.addEventListener('click', addTask);

// Add keypress listener for Enter key
taskInput.addEventListener('keypress', function(event) {
  if (event.key === 'Enter') {
    addTask();
  }
});

// Clear all tasks
clearAllBtn.addEventListener('click', function() {
  taskList.textContent = '';
  updateTaskCount();
  saveTasks(); // Save tasks after clearing all
});
