$(document).ready(function() {
    let taskNumberArray = [];
    const LOCAL_STORAGE_TASKS = 'tasks';

    loadTasksFromLocalStorage();
    
    $('#button-submit').on('click', event => {
        event.preventDefault();
        const newTaskTxt = $('#form3').val();
        $('#form3').val('');
        
        const newID = assignAndAddTaskID();

        if(newID){
            saveTaskToLocalStorage(newTaskTxt, newID);
            createNewTask(newTaskTxt, newID);
        }
    })
    
    function createNewTask(text, id){
        const $listGroup = $('#list-group');
        const $listGroupItem = $('<li></li>', {
            class: 'list-group-item d-flex justify-content-between align-items-center border-start-0 border-top-0 border-end-0 border-bottom rounded-0 mb-2',
            id: id
        });
        const $containerItemContent = $('<div></div>', {
            class: 'd-flex align-items-center'
        });
        const $input = $('<input>', {
            class: 'form-check-input me-2',
            type: 'checkbox'
        });
        const $taskText = $('<span></span>', {
            class: 'span',
            text: text
        });
        
        $containerItemContent.append($input, $taskText);
        
        const $removeLink = $('<a></a>').attr({
            href: '#!',
            'data-mdb-tooltip-init': '',
            title: 'Remove item'
        });
        const $removeIcon = $('<i></i>', {
            class: 'fas fa-times text-primary custom-styling-remove-button',
            text: 'Remove'
        });
        $removeLink.append($removeIcon);
        
        $listGroupItem.append($containerItemContent, $removeLink);
        $listGroup.append($listGroupItem);
    }
    
    function saveTaskToLocalStorage(text, id){
        let tasks = JSON.parse(localStorage.getItem(LOCAL_STORAGE_TASKS)) || [];
        tasks.push({ id: id, text: text });
        localStorage.setItem(LOCAL_STORAGE_TASKS, JSON.stringify(tasks));
    }
    
    function assignAndAddTaskID() {
        const randomValue = Math.floor(Math.random() * 10) + 1;
        if(taskNumberArray.length < 10){ 
            if (taskNumberArray.includes(randomValue)) {
                return assignAndAddTaskID();
            } else {
                taskNumberArray.push(randomValue);
                return randomValue;
            }
        } else {
            alert('Вже достатьньо, виконай вже існуючі');
        }
    }
    
    function showModal(text,id){
        $('#modal').css('display', 'block');
        $('#modal').attr('saveID', id);
        $('#modal-body').val(text);
    }
    
    $('#list-group').on('click', 'li', function(event){
        let textEventTarget = undefined;
        const IDElementTarget = $(event.target).closest('li').attr('ID');
        
        if ($(event.target).hasClass('list-group-item')) {
            textEventTarget = $(event.target).find('span').text(3);
            showModal(textEventTarget, IDElementTarget);
        } else if($(event.target).hasClass('span')){
            textEventTarget = $(event.target).text();
            showModal(textEventTarget,IDElementTarget);
        } else if ($(event.target).hasClass('form-check-input')) {
            console.log('Checkbox was clicked');
        } else if ($(event.target).hasClass('fa-times')) {
            console.log('Remove icon was clicked');
            const removeID = $(event.target).closest('li').attr('id');
            $(event.target).closest('li').remove();
            updateTasksLocalStorage(removeID);
        }
    })
    
    $('#modal-window-hide-button').on('click', () =>{
        $('#modal').css('display', 'none');
    })
    
    $('#save-changes-button').on('click', function saveChanges(){
        const IDelement = $('#modal').attr('saveID');
        const savingNewValue = $('#modal-body').val();

        let tasks = JSON.parse(localStorage.getItem(LOCAL_STORAGE_TASKS)) || [];
        tasks = tasks.map(task => {
            if (task.id === Number(IDelement)){
                task.text = savingNewValue;
            }
            return task;
        });
        localStorage.setItem(LOCAL_STORAGE_TASKS, JSON.stringify(tasks));

        $('#list-group li').each(function() {
            if ($(this).attr('id') === IDelement) {
                $(this).find('span').text(savingNewValue);
            }
        });
        
        $('#modal').css('display', 'none');
    });
     
    function updateTasksLocalStorage(removeID) {
        let tasks = JSON.parse(localStorage.getItem(LOCAL_STORAGE_TASKS)) || [];
        upTasks = tasks.filter(task =>task.id !== Number(removeID));
        localStorage.setItem(LOCAL_STORAGE_TASKS, JSON.stringify(upTasks));
        taskNumberArray = taskNumberArray.filter(number => number !== Number(removeID));
    }
    
    function loadTasksFromLocalStorage(){ 
        let tasks = JSON.parse(localStorage.getItem(LOCAL_STORAGE_TASKS)) || [];
        tasks.forEach(loadedTask => {
            createNewTask(loadedTask.text, loadedTask.id);
            taskNumberArray.push(loadedTask.id);
        });
    }
});
