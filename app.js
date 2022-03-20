const $submitBtn = document.getElementById('submit');
const $title = document.getElementById('title');
const $description = document.getElementById('description');
const $cardsContainer = document.getElementById('cardsContainer');

//returns the current state of localStorage
function fetchLocalStorage() {
    const allItems = JSON.parse(localStorage.getItem('lists'));
    return allItems === null ? [] : allItems;
}

//It will delete the data on the basis of date Element in LocalStorage
function deleteItem(e) {

    // getting the value of the date element of the current card
    const date = e.target.parentElement.nextElementSibling.innerText;

    const allItems = fetchLocalStorage();

    const restItems = allItems.filter(item => item.date !== date);

    //set the remaining items to localStorage and then render the UI again
    localStorage.setItem('lists', JSON.stringify(restItems));

    renderUI();
}

//This will put the date to form in their respective fields and delete the current item such that date will not be duplicated
function editItem(e) {

    //for fetching description section of the card
    const descriptionElement = e.target.parentElement.previousElementSibling;

    //for fetching title section of the card
    const titleElement = descriptionElement.previousElementSibling;

    $description.value = descriptionElement.innerText;
    deleteItem(e);
}

function handleComplete(e) {
    let date = e.target.parentElement.lastElementChild.innerText;
    let allItems = fetchLocalStorage();
    for (let index = 0; index < allItems.length; index++) {
        if (allItems[index].date === date) {
            allItems[index].isCompleted = !allItems[index].isCompleted;
            break;
        }
    }
    localStorage.setItem('lists', JSON.stringify(allItems));
    renderUI();
}

//this function wil rerender the UI every time we perform any CRUD operation or reload the window
function renderUI() {

    const allItems = fetchLocalStorage();

    //making the container empty to prevent from duplicate elemets
    $cardsContainer.innerHTML = ``;

    allItems.forEach(item => {
        $cardsContainer.innerHTML += `<div class="cards" id=${item.isCompleted?'completed':'inComplete'}>
        <input id="check" type="checkbox" onclick=handleComplete(event) ${item.isCompleted?'checked':''}>
        
        <p>${item.description}</p>
        <div class="buttonContainer">
            <button id="delete" onclick=deleteItem(event)><i class="fas fa-trash"></i></button>
            <button id="edit" onclick=editItem(event)><i class="fas fa-edit"></i></button>
        </div>
        <p id="date">${item.date}</p>
    </div>`
    });
}

//takes an object and adds it to the localStorage
function addToLocalStorage(newItem) {
    let allItems = fetchLocalStorage();
    allItems.push(newItem);
    localStorage.setItem('lists', JSON.stringify(allItems));
}

//whenever we click the submit button this will do his job
$submitBtn.addEventListener('click', (e) => {

    e.preventDefault();
    const description = $description.value;
    if(description === "")
    {
        alert("Please add some task")
        return false;
    }

    const newItem = {
        description,
        date: new Date().toLocaleString(),
        isCompleted: false
    }
    addToLocalStorage(newItem);

    //make to form empty after saving the data.
    $description.value = "";

    renderUI();
});

renderUI();