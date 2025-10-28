document.addEventListener('DOMContentLoaded', () => {
    loadTasksFromLocalStorage();
});

const taskInput = document.querySelector('#task-inp');
const addtaskbtn = document.querySelector('.task-input_button');
const taskList = document.querySelector('.task-list');
const emptyImage = document.querySelector('#empty_imp');
const todoContainer = document.querySelector('.to-do_list');
const progress = document.querySelector('#prog');
const prog_num = document.querySelector('#number');


// ✅ Toggle empty state image visibility
const toggleEmptyImage = () => {
    emptyImage.style.display = taskList.children.length === 0 ? 'block' : 'none';
    todoContainer.style.width = taskList.children.length > 0 ? '100%' : '50%';
};


// ✅ Update progress bar and trigger confetti
const updateProgress = () => {
    const totalTasks = taskList.children.length;
    const completedTasks = taskList.querySelectorAll('.task-checkbox:checked').length;

    progress.style.width = totalTasks ? `${(completedTasks / totalTasks) * 100}%` : '0%';
    prog_num.textContent = `${completedTasks} / ${totalTasks}`;

    // trigger confetti when all tasks are done
    if (totalTasks > 0 && completedTasks === totalTasks) {
        triggerConfetti();
    }
};


// ✅ Save tasks to localStorage
const saveLocal = () => {
    const tasks = Array.from(taskList.querySelectorAll('li')).map(li => ({
        text: li.querySelector('span').textContent,
        completed: li.querySelector('.task-checkbox').checked
    }));
    localStorage.setItem('tasks', JSON.stringify(tasks));
};


// ✅ Load tasks from localStorage
const loadTasksFromLocalStorage = () => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    savedTasks.forEach(({ text, completed }) => addtask(text, completed));
    toggleEmptyImage();
    updateProgress();
};


// ✅ Add a new task
const addtask = (text, completed = false) => {
    const tasktext = text || taskInput.value.trim();
    if (!tasktext) {
        alert("Please enter a task");
        return;
    }

    const li = document.createElement('li');
    li.innerHTML = `
        <input type="checkbox" class="task-checkbox" ${completed ? 'checked' : ''}/>
        <span>${tasktext}</span>
        <div class="task-actions">
            <button class="edit-btn"><i class="fa-solid fa-pen-to-square"></i></button>
            <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
        </div>
    `;

    const checkbox = li.querySelector('.task-checkbox');

    if (completed) {
        li.classList.add('completed');
        li.querySelector('.edit-btn').disabled = true;
        li.querySelector('.edit-btn').style.opacity = 0.6;
        li.querySelector('.edit-btn').style.pointerEvents = 'none';
    }

    checkbox.addEventListener('change', () => {
        const isChecked = checkbox.checked;
        li.classList.toggle('completed', isChecked);
        li.querySelector('.edit-btn').disabled = isChecked;
        li.querySelector('.edit-btn').style.opacity = isChecked ? 0.6 : 1;
        li.querySelector('.edit-btn').style.pointerEvents = isChecked ? 'none' : 'auto';
        updateProgress();
        saveLocal();
    });

    li.querySelector('.edit-btn').addEventListener('click', () => {
        if (!checkbox.checked) {
            taskInput.value = li.querySelector('span').textContent;
            li.remove();
            toggleEmptyImage();
            updateProgress();
            saveLocal();
        }
    });

    li.querySelector('.delete-btn').addEventListener('click', () => {
        li.remove();
        toggleEmptyImage();
        updateProgress();
        saveLocal();
    });

    taskList.appendChild(li);
    taskInput.value = '';
    toggleEmptyImage();
    updateProgress();
    saveLocal();
};


// ✅ Add task via button or Enter key
addtaskbtn.addEventListener('click', (e) => {
    e.preventDefault();
    addtask();
});

taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        addtask();
    }
});


// ✅ Confetti animation
const triggerConfetti = () => {
    const defaults = {
        spread: 360,
        ticks: 50,
        gravity: 0,
        decay: 0.94,
        startVelocity: 30,
        shapes: ["star"],
        colors: ["#FFE400", "#FFBD00", "#E89400", "#FFCA6C", "#FDFFB8"],
    };

    function shoot() {
        confetti({ ...defaults, particleCount: 40, scalar: 1.2, shapes: ["star"] });
        confetti({ ...defaults, particleCount: 10, scalar: 0.75, shapes: ["circle"] });
    }

    setTimeout(shoot, 0);
    setTimeout(shoot, 100);
    setTimeout(shoot, 200);
};
