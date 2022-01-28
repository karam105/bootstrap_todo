const url = "https://ub0y8s8ie1.execute-api.us-west-1.amazonaws.com/dev";
var userEmail = localStorage.getItem("loggedInUserEmail");
var username = localStorage.getItem("loggedInUsername");

var input = document.getElementById("inputToDo");
var dateValue = document.getElementById("inputDueDate");
var updateButton = document.getElementById("update");
var clearUpdate = document.getElementById("clearUpdate");
var submission = document.getElementById("submission");

var userNameField = document.getElementById("userNameField");
userNameField.innerText = username;
var userEmailField = document.getElementById("userEmailField");
userEmailField.innerText = userEmail;

var dataTable = document.getElementById("dataTable");
var todoTableBody = document.createElement('tbody');
todoTableBody.id = "tbodyID";
dataTable.append(todoTableBody);

var modal = document.getElementById('id01');
var cancelModal = document.getElementById('cancelButton');
var deleteModal = document.getElementById('deleteButton');

var shardIDs = [];

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

function getTodos() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url + "/?user_email=" + userEmail);

    var div = document.getElementById("nothingExists");
    todoTableBody.innerHTML = "";
    div.innerHTML = '';

    xhr.onreadystatechange = () => {
        if(xhr.readyState === XMLHttpRequest.DONE) {
            const res = JSON.parse(xhr.responseText);
            if(res.Items.length == 0) {
                div.innerHTML = `<span>Nothing Exists in ToDo list</span>`;
            }
            else {
                for(var i = 0; i < res.Items.length; i++) {
                    fetchAllToDos(i, res.Items[i].shard_id, res.Items[i].item, res.Items[i].status, res.Items[i].dueDate);
                }
            }
        }
    };

    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(null);
}

function fetchAllToDos(index, shard_id, todo, status, dueDate) {
    shardIDs.push(shard_id);
    var today = new Date();
    var date = new Date(dueDate);

    var m = date.getMonth();
    var d = date.getDate() + 1;
    var y = date.getFullYear();

    var finalDate = new Date(y,m,d);
    
    today.setHours(0,0,0,0);

    if(status === "incomplete") {
        var todoTableBodyRow = document.createElement('tr');
        todoTableBodyRow.index = index;
        todoTableBodyRow.item = todo;
        todoTableBodyRow.status = status;
        todoTableBodyRow.date = dueDate;
        todoTableBodyRow.shard = shard_id;

        var item = document.createElement('td');
        item.innerText = todo;
        var due = document.createElement('td');
        due.innerText = finalDate.toDateString();
        if(today < finalDate) {
            due.style.fontWeight = 'bold';
            due.className = "bg-success";
        }
        else if(today > finalDate) {
            due.style.fontWeight = 'bold';
            due.className = "bg-danger";
        }
        else {
            due.style.fontWeight = 'bold';
            due.className = "bg-warning";
        }

        var complete = document.createElement('td');
        var checkMark = document.createElement('img');
        checkMark.src = '/images/no-check-square.PNG';
        checkMark.addEventListener('click', handleDeleteOrCheckOrEdit);
        checkMark.alt = 'checkButton';
        checkMark.style.cursor = 'pointer';
        checkMark.title = 'Check Complete';

        var deleteItem = document.createElement('img');
        deleteItem.src = '/images/delete.PNG';
        deleteItem.addEventListener('click', handleDeleteOrCheckOrEdit);
        deleteItem.alt = 'deleteButton';
        deleteItem.style.cursor = 'pointer';
        deleteItem.title = 'Delete Item';

        var editItem = document.createElement('img');
        editItem.src = '/images/edit.PNG';
        editItem.addEventListener('click', handleDeleteOrCheckOrEdit);
        editItem.alt = 'editButton';
        editItem.style.cursor = 'pointer';
        editItem.title = 'Edit Item';

        complete.append(checkMark, editItem, deleteItem);
        todoTableBodyRow.append(item, due, complete);
        todoTableBody.append(todoTableBodyRow);
    }
    else {
        var todoTableBodyRow = document.createElement('tr');
        todoTableBodyRow.index = index;
        todoTableBodyRow.item = todo;
        todoTableBodyRow.status = status;
        todoTableBodyRow.date = dueDate;
        todoTableBodyRow.shard = shard_id;

        var item = document.createElement('td');
        item.innerText = todo;
        var due = document.createElement('td');
        due.innerText = finalDate.toDateString();
        if(today < finalDate) {
            due.style.fontWeight = 'bold';
            due.className = "bg-success";
        }
        else if(today > finalDate) {
            due.style.fontWeight = 'bold';
            due.className = "bg-danger";
        }
        else {
            due.style.fontWeight = 'bold';
            due.className = "bg-warning";
        }

        var complete = document.createElement('td');
        var checkMark = document.createElement('img');
        checkMark.src = '/images/check-square.PNG';
        checkMark.addEventListener('click', handleDeleteOrCheckOrEdit);
        checkMark.alt = 'checkButton';
        checkMark.style.cursor = 'pointer';
        checkMark.title = 'Check Complete';

        var deleteItem = document.createElement('img');
        deleteItem.src = '/images/delete.PNG';
        deleteItem.addEventListener('click', handleDeleteOrCheckOrEdit);
        deleteItem.alt = 'deleteButton';
        deleteItem.style.cursor = 'pointer';
        deleteItem.title = 'Delete Item';

        var editItem = document.createElement('img');
        editItem.src = '/images/edit.PNG';
        editItem.addEventListener('click', handleDeleteOrCheckOrEdit);
        editItem.alt = 'editButton';
        editItem.style.cursor = 'pointer';
        editItem.title = 'Edit Item';

        complete.append(checkMark, editItem, deleteItem);
        todoTableBodyRow.append(item, due, complete);
        todoTableBodyRow.style.textDecoration = 'line-through';
        todoTableBody.append(todoTableBodyRow);
    }
}

function handleDeleteOrCheckOrEdit(e) {
    if(e.target.alt == 'checkButton') {
        checkTodo(e);
    }
    if(e.target.alt == 'deleteButton') {
        deleteTodo(e);
    }
    if(e.target.alt == 'editButton') {
        editTodo(e);
    }
}

function checkTodo(e) {
    var item = e.target.parentNode.parentNode;
    var shardToUpdate = item.shard;
    var date = item.date;
    var todo = item.item;
    if(item.style.textDecoration == 'line-through') {
        item.style.textDecoration = 'none';
        e.target.src = '../images/no-check-square.PNG';
        updateStatus(shardToUpdate, "incomplete", date, todo);
    }
    else {
        item.style.textDecoration = 'line-through';
        e.target.src = '../images/check-square.PNG';
        updateStatus(shardToUpdate, "complete", date, todo);
    }
}

function updateStatus(shard, status, date, todo) {
    const xhr = new XMLHttpRequest();
    xhr.open('PATCH', url);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify({"shard_id":shard,"item": todo, "dueDate": date, "status":status}));
}

function postToDo() {
    event.preventDefault();
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify({"user_email":userEmail, "item": input.value, "status": "incomplete", "dueDate": dateValue.value}));
    input.value = '';
    dateValue.value = '';
    setTimeout(getTodos, 2000);
}

function deleteTodo(e) {
    document.getElementById('id01').style.display='block';
    cancelModal.addEventListener('click', function() {
        document.getElementById('id01').style.display = "none";
    });
    deleteModal.addEventListener('click', function() {
        var item = e.target.parentNode.parentNode;
        todoTableBody.removeChild(item);
        deleteFromTable(e);
        document.getElementById('id01').style.display = "none";
    });
}

function deleteFromTable(e) {
    var toDelete = e.target.parentNode.parentNode.shard;
    const xhr = new XMLHttpRequest();
    xhr.open("DELETE", url);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify({"shard_id": toDelete}));
}

const once = {
    once : true
};

function editTodo(e) {
    event.preventDefault();
    var shardToUpdate = e.target.parentNode.parentNode.shard;
    input.value = e.target.parentNode.parentNode.item;
    dateValue.value = e.target.parentNode.parentNode.date;
    var status = e.target.parentNode.parentNode.status;

    updateButton.classList.remove('invisible');
    updateButton.classList.add('visible');

    clearUpdate.classList.remove('invisible');
    clearUpdate.classList.add('visible');

    submission.disabled = true;

    var handler = function() {updateItem(shardToUpdate, input.value, dateValue.value, status)};
    updateButton.addEventListener("click", handler, once);
}

function clearUpdateFields() {
    updateButton.classList.remove('visible');
    updateButton.classList.add('invisible');
    clearUpdate.classList.remove('visible');
    clearUpdate.classList.add('invisible');
    submission.disabled = false;
    input.value = '';
    dateValue.value = '';
}

function updateItem(shard, todo, date, status) {
    const xhr = new XMLHttpRequest();
    xhr.open('PATCH', url);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify({"shard_id":shard,"item": todo, "dueDate": date, "status":status}));

    updateButton.classList.remove('visible');
    updateButton.classList.add('invisible');
    clearUpdate.classList.remove('visible');
    clearUpdate.classList.add('invisible');

    submission.disabled = false;
    input.value = '';
    dateValue.value = '';

    setTimeout(getTodos, 2000);
}

function sortTable(n) {
    var rows, switching, i, x, y, shouldSwitch, dir, switchCount = 0;
    switching = true;
    dir = 'asc';

    while(switching) {
        switching = false;
        rows = dataTable.rows;
        for(i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("td")[n];
            y = rows[i + 1].getElementsByTagName("td")[n];

            if(dir == 'asc') {
                if(x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            }
            else if(dir == 'desc') {
                if(x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            }
        }

        if(shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            switchCount++;
        }
        else {
            if(switchCount == 0 && dir == 'asc') {
                dir = 'desc';
                switching = true;
            }
        }
    }
}

function signOutButton() {
    event.preventDefault();

    var poolData = {
        UserPoolId: _config.cognito.userPoolId,
        ClientId: _config.cognito.clientId,
    };

    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    var userData = {
        Username: userEmail,
        Pool: userPool,
    };

    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.signOut();
    setTimeout(() => {
        location.href = './index.html';
    }, 1000);
}

function backPageButton() {
    location.href = './choice.html';
}

function getUserAttributes(cognitoUser) {
    cognitoUser.getUserAttributes(function(err, result) {
        if(err) {
            alert(err.message || JSON.stringify(err));
            return;
        }
        for(i = 0; i < result.length; i++) {
            console.log('attribute ' + result[i].getName() + ' has value ' + result[i].getValue());
        };
    });
}

window.addEventListener('load', function() {
    setTimeout(getTodos, 1000);
})