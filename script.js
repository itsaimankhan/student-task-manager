const form = document.getElementById("task-form");
const titleInput = document.getElementById("task-title");
const descriptionInput = document.getElementById("task-description");
const taskList = document.getElementById("task-list");

const tasks = [];
let nextId = 1;

const searchLabel = document.createElement("label");
searchLabel.htmlFor = "task-search";
searchLabel.textContent = "Search Tasks";

const searchInput = document.createElement("input");
searchInput.id = "task-search";
searchInput.type = "search";
searchInput.placeholder = "Search by title or description";

taskList.before(searchLabel, searchInput);

function renderTasks() {
    taskList.replaceChildren();

    const query = searchInput.value.trim().toLowerCase();
    const visibleTasks = tasks.filter(task =>
        `${task.title} ${task.description}`.toLowerCase().includes(query)
    );

    if (visibleTasks.length === 0) {
        const message = document.createElement("p");
        message.textContent = query
            ? "No matching tasks."
            : "No tasks yet. Add your first task.";
        taskList.append(message);
        return;
    }

    visibleTasks.forEach(task => {
        const card = document.createElement("article");
        card.className = task.completed
            ? "task-card completed"
            : "task-card";

        const heading = document.createElement("h3");
        heading.textContent = task.title;

        const description = document.createElement("p");
        description.textContent = task.description;

        const status = document.createElement("p");
        status.textContent = task.completed ? "Completed" : "Pending";

        const actions = document.createElement("div");
        actions.className = "task-actions";

        const completeButton = document.createElement("button");
        completeButton.type = "button";
        completeButton.textContent = task.completed
            ? "Mark Pending"
            : "Mark Completed";
        completeButton.addEventListener("click", () => {
            task.completed = !task.completed;
            renderTasks();
        });

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => {
            const index = tasks.findIndex(item => item.id === task.id);
            if (index !== -1) tasks.splice(index, 1);
            renderTasks();
        });

        actions.append(completeButton, deleteButton);
        card.append(heading, description, status, actions);
        taskList.append(card);
    });
}

form.addEventListener("submit", event => {
    event.preventDefault();

    const title = titleInput.value.trim();
    if (!title) {
        titleInput.setCustomValidity("Enter a task title.");
        titleInput.reportValidity();
        return;
    }

    tasks.push({
        id: nextId++,
        title,
        description: descriptionInput.value.trim(),
        completed: false
    });

    form.reset();
    searchInput.value = "";
    renderTasks();
    titleInput.focus();
});

titleInput.addEventListener("input", () => {
    titleInput.setCustomValidity("");
});

searchInput.addEventListener("input", renderTasks);
renderTasks();