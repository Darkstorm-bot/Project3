const tasksList = document.getElementById('tasksList');
const addTaskButton = document.querySelector('.btn-add-task');
const taskEntryForm = document.querySelector('.task-entry-form');
const taskEntryFormButton = document.querySelector('.btn-add-task');

addTaskButton.addEventListener('click', () => {
  taskEntryForm.style.display = 'block';

  taskEntryFormButton.addEventListener('click', (event) => {
    event.preventDefault();
  
    const taskName = document.querySelector('#taskName').value;
    const dueDate = document.querySelector('#dueDate').value;
    const dueTime = document.querySelector('#dueTime').value;

    if (taskName && dueDate && dueTime ){
  
    const taskItem = createTaskItem({name: taskName, dueDate: dueDate, dueTime: dueTime});
  
    tasksList.appendChild(taskItem);
    taskEntryForm.reset();
  } else {
    alert(' Please Provide task name, due date, and due time');
  }
});
  
  function createTaskItem(task) {
    const taskItem = document.createElement('tr');
    taskItem.classList.add('task-item');
  
    const taskNameCell = document.createElement('td');
    taskNameCell.textContent = task.name;
    taskItem.appendChild(taskNameCell);
  
    const dueDateCell = document.createElement('td');
    dueDateCell.textContent = task.dueDate;
    taskItem.appendChild(dueDateCell);
  
    const dueTimeCell = document.createElement('td');
    dueTimeCell.textContent = task.dueTime;
    taskItem.appendChild(dueTimeCell);
  
    const statusCell = document.createElement('td');
    statusCell.textContent = 'Incomplete';
    statusCell.classList.add('task-status', 'incomplete');
    taskItem.appendChild(statusCell);
  
    const checkboxCell = document.createElement('td');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkboxCell.appendChild(checkbox);
    taskItem.appendChild(checkboxCell);
  
    return taskItem;
  }
  
  tasksList.addEventListener('click', (event) => {
    if (event.target.type === 'checkbox') {
      const taskItem = event.target.parentElement.parentElement;
      const statusCell = taskItem.querySelector('.task-status');
  
      if (event.target.checked) {
        statusCell.textContent = 'Complete';
        statusCell.classList.add('complete');
        statusCell.classList.remove('incomplete');
        event.target.disabled = true;
        taskItem.classList.add('completed-task'); 
        taskItem.style.textDecoration ='line-through';
        setTimeout(() => {
          taskItem.remove();
        }, 6000);
      } else {
        statusCell.textContent = 'Incomplete';
        statusCell.classList.add('incomplete');
        statusCell.classList.remove('complete');
      }
    }
  });
  

  // If you have a form within the modal, you can focus on the first input field
  const inputField = modal.querySelector('input');
  inputField.focus();
});
  // Display a modal or form for adding a new task


// Fetch previous day's completed tasks
fetch('previous-day-tasks')
  .then(response => response.json())
  .then(data => {
    // Add completed tasks from previous day to the tasks list
    if (data.length > 0) {
      tasksList.innerHTML = '';

      for (const task of data) {
        const taskItem = createTaskItem(task);
        tasksList.appendChild(taskItem);
      }
    } else {
      tasksList.innerHTML = '<span>No completed tasks found</span>';
    }
  });

// Check for uncompleted tasks from the current day and automatically transfer them to the next day's list
setInterval(() => {
  // Retrieve today's date
  const today = new Date();
  const currentDate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

  // Check for uncompleted tasks from today
  fetch('uncompleted-tasks?date=' + currentDate)
    .then(response => response.json())
    .then(data => {
      if (data.length > 0) {
        // Transfer uncompleted tasks to the next day's list
        fetch('transfer-tasks?date=' + currentDate)
          .then(response => response.json())
          .then(data => {
            // Update tasks list with transferred tasks
            if (data.length > 0) {
              for (const task of data) {
                const taskItem = createTaskItem(task);
                tasksList.appendChild(taskItem);
              }
            }
          });
      }
    });
}, 1000 * 60 * 60 * 24); // Execute every 24 hours


const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

const checklist = document.querySelector('tasksList');

checklist.querySelectorAll('tr').forEach(taskItem => {
  const dueDateCell = taskItem.querySelector('.due-date');
  const dueDate = new Date(dueDateCell.textContent);

  if (dueDate >= tomorrow) {
    dueDateCell.classList.add('highlight');
  } else {
    dueDateCell.classList.remove('highlight');
  }
});





fetch('previous-day-tasks')
  .then(response => response.json())
  .then(data => {
    if (data.length > 0) {
      tasksList.innerHTML = '';

      for (const task of data) {
        const taskItem = createTaskItem(task);
        tasksList.appendChild(taskItem);
      }
    } else {
      tasksList.innerHTML = '<span>No completed tasks found</span>';
    }
  })
  .catch(error => {
    console.error('Error fetching previous day\'s completed tasks:', error);
  });
