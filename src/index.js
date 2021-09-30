const todoList = document.querySelector('#todos');
const form = document.querySelector('#addTodo');
const ulTodo = document.querySelectorAll('ul');
const inputName = document.querySelector('#todoValue');

async function getTodos(){
    try{
        const result = await fetch('http://localhost:3000/todos')
        const todos = await result.json();
        return fillTodo(todos)
    } catch(err) {
        console.log(err);
    }
}
getTodos()

async function postTodos(todo){
    try{
        const result = await fetch('http://localhost:3000/todos', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(todo)
        })
          .then(res => res.json())
          .then(() => location.reload());
    } catch(err) {
        console.log(err);
    }
}

const editTodos = (todoId, teste) => {
    try{
        return fetch(`http://localhost:3000/todos/${todoId}`, {
            method: 'PATCH',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({completed: teste})
        })
    }catch(err) {
        console.log(err);
    }
}

const deleteTodos = (todoId) => {
    try{
        return fetch(`http://localhost:3000/todos/${todoId}`, {
            method: 'DELETE'
        })
        .then(res => res.json())
        .then(() => location.reload());
    }catch(err) {
        console.log(err);
    }
}

const getTodoForm = () => {
    const date = new Date().toLocaleDateString();
    if(inputName.value == null) return;
    const todo = {
        name: inputName.value,
        date: date,
        completed: false
    }
    return todo;
}

const fillTodo = (todos) => {
    todos.forEach(todo => {            
        if(todo.completed){
            const newTodoHTML = `
            <li class="list-group-item d-flex justify-content-between align-items-start" data-id=${todo.id}>
            <div class="ms-2 me-auto">
            <span class="fw-bold completed">${ todo.name }</span>
            <div>Added in ${ todo.date }</div> 
            </div>
            <span class="deleteTodo"><i class="fa fa-trash"></i></span>
            </li>
            `
            todoList.innerHTML = todoList.innerHTML + newTodoHTML 
        } else {
            const newTodoHTML = `
            <li class="list-group-item d-flex justify-content-between align-items-start" data-id=${todo.id}>
            <div class="ms-2 me-auto">
            <span class="fw-bold">${ todo.name }</span>
            <div>Added in ${ todo.date }</div> 
            </div>
            <span class="deleteTodo"><i class="fa fa-trash"></i></span>
            </li>
            `
            todoList.innerHTML = todoList.innerHTML + newTodoHTML            
        }
    })
}

const delegate = (el, evt, sel, handler) => {
    el.addEventListener(evt, function(event) {
        var t = event.target;
        while (t && t !== this) {
            if (t.matches(sel)) {
                handler.call(t, event);
            }
            t = t.parentNode;
        }
    });
}

form.addEventListener('submit', function (e) {
    e.preventDefault();
    if(inputName.value === '') return;
    const todoData = getTodoForm();
    sendDataToAPI(todoData);
    form.reset();
});


ulTodo.forEach(t => 
    delegate(document, "click", ".fw-bold", function(e) {
        this.classList.toggle('completed');
        let todoId = this.parentElement.parentElement.dataset.id;
        if(this.className === 'fw-bold completed'){
            editTodos(todoId, true);
        } else {
            editTodos(todoId, false);
        } 
    })
);

ulTodo.forEach(t => 
    delegate(document, "click", ".deleteTodo", function(e) {
        let todoId = this.parentElement.dataset.id;
        deleteTodos(todoId);
    })
);




