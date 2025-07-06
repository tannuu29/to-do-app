document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('input-task');
    const addBtn = document.getElementById('add-btn');
    const taskList = document.getElementById('task-list');
    const emptyImg = document.querySelector('.empty-img');
    const todosContainer = document.querySelector('.todos-container')
    const progress = document.getElementById('progress');
    const progressNumbers = document.getElementById('numbers');
    const clearAll = document.getElementById("clear-all");


    const toggleEmptyState = () => {
        emptyImg.style.display = taskList.children.length === 0 ? 'block' : 'none';
        todosContainer.style.width = taskList.children.length > 0 ? '100%' : '50%';
    };

    const updateProgress = (checkCompletion = true) => {
        const totalTasks = taskList.children.length;
        const completedTasks = taskList.querySelectorAll('.checkbox:checked').length;

        progress.style.width = totalTasks ? `${(completedTasks / totalTasks) * 100}%` : '0%';
        progressNumbers.textContent = `${completedTasks} / ${totalTasks}`;

        if (checkCompletion && totalTasks > 0 && completedTasks === totalTasks) {
            Confetti();
        }
    };

    const saveTaskToLocalStorage = () => {
        const tasks = Array.from(taskList.querySelectorAll('li')).map(newTask => ({
            text: newTask.querySelector('span').textContent,
            completed: newTask.querySelector('.checkbox').checked
        }));
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    const loadTasksFromLocalStorage = () => {
        const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
        savedTasks.forEach(({ text, completed }) => addTask(text, completed, false));
        toggleEmptyState();
        updateProgress();
    }
    const addTask = (text, completed = false, checkCompletion = true) => {
        // event.preventDefault();
        const taskText = text || taskInput.value.trim();
        if (!taskText) {
            return;
        }
        const newTask = document.createElement('li');
        // newTask.textContent = taskText;
        newTask.innerHTML = `
        <input type ="checkbox" class="checkbox" ${completed ? 'checked' : ''}>
        <span>${taskText}</span>
        <div class="task-buttons">
            <button class="edit-btn"><i class="fa-solid fa-pen"></i></button>
            <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
            
        `;

        const editBtn = newTask.querySelector('.edit-btn');
        const checkbox = newTask.querySelector('.checkbox');
        // editBtn.style.backgroundColor = "yellow";
        if (completed) {
            newTask.classList.add('completed');
            editBtn.disabled = true;
            editBtn.style.opacity = '0.5';
            editBtn.style.pointerEvents = 'none';
        }

        checkbox.addEventListener('change', () => {
            const ischecked = checkbox.checked;
            newTask.classList.toggle('completed', ischecked);
            editBtn.disabled = ischecked;
            editBtn.style.opacity = ischecked ? '0.5' : '1';
            editBtn.style.pointerEvents = ischecked ? 'none' : 'auto';
            updateProgress();
            saveTaskToLocalStorage();
        });

        editBtn.addEventListener('click', () => {
            if (!checkbox.checked) {
                taskInput.value = newTask.querySelector('span').textContent;
                newTask.remove();
                toggleEmptyState();
                updateProgress(false);
                saveTaskToLocalStorage();
            }
        })
        newTask.querySelector('.delete-btn').addEventListener('click', () => {
            newTask.remove();
            toggleEmptyState();
            updateProgress();
            saveTaskToLocalStorage();
        });

        clearAll.addEventListener("click", function () {
                taskList.innerHTML = "";
                toggleEmptyState();
                updateProgress();
                localStorage.removeItem(newTask); 
        });


        taskList.appendChild(newTask);
        taskInput.value = "";
        toggleEmptyState();
        updateProgress(checkCompletion);
        saveTaskToLocalStorage();
    };

    addBtn.addEventListener('click', () => addTask());
    taskInput.addEventListener('keypress', (e) => {
        if (e.key == 'Enter') {
            e.preventDefault();
            addTask();
        }
    });

    loadTasksFromLocalStorage();
});


const Confetti = () => {
    const count = 200,
        defaults = {
            origin: { y: 0.7 },
        };

    function fire(particleRatio, opts) {
        confetti(
            Object.assign({}, defaults, opts, {
                particleCount: Math.floor(count * particleRatio),
            })
        );
    }

    fire(0.25, {
        spread: 26,
        startVelocity: 55,
    });

    fire(0.2, {
        spread: 60,
    });

    fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8,
    });

    fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2,
    });

    fire(0.1, {
        spread: 120,
        startVelocity: 45,
    });
}
