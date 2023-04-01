// Variables
const addBox = document.querySelector(".add-box"),
    popupBox = document.querySelector(".container-popup"),
    popupTitle = popupBox.querySelector(".title-create-note"),
    btnClosePopup = document.querySelector(".btn-close-popup"),
    btnAddNote = document.querySelector(".btn-add-note"),
    nameNote = document.querySelector(".name-note"),
    descriptionNote = document.querySelector(".description-note");

// Returns values if a note exists in local storage, otherwise returns an empty array.
let notes = JSON.parse(localStorage.getItem("notes") || "[]");

let isUpdate = false, updateId;


// A list of month names to set the date of the notes
const monthNameList = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];


// Show Popup
addBox.addEventListener("click", () => {
    nameNote.focus();
    popupBox.classList.add("show");
});


// Show Notes
function showNotes() {
    document.querySelectorAll(".note").forEach(note => note.remove());
    if (notes.length) {
        notes.forEach((note) => {
            let liTag = `
            <li class="note">
            <div class="details">
            <p class="note-name">${note.name}</p>
            <span class="note-description">${note.description}</span>
            </div>
            <div class="bottom-content">
            <span class="note-date">${note.date}</span>
            <div class="controls">
            <i onclick="showControlMenu(this)" class="fa-solid fa-ellipsis"></i>
            <div class="note-control">
            <button onclick="editNoteHandler(${note.id},'${note.name}','${note.description}')" class="btn-edit-note">
                    <i class="fa-solid fa-pen"></i>
                    <span>Edit</span>
                </button>
                <button onclick="deleteNoteHandler(${note.id})" class="btn-delete-note">
                    <i class="fa-solid fa-trash"></i>
                   <span>Delete</span>
                </button>
             </div>
            </div>
             </div>
             </li>
             `;
            addBox.insertAdjacentHTML("afterend", liTag);
        })
    }
}
showNotes();


// Close Popup
btnClosePopup.addEventListener("click", () => {
    isUpdate = false;
    nameNote.value = "";
    descriptionNote.value = "";
    popupTitle.innerText = "Create A New Note";
    btnAddNote.innerText = "Add Note";
    popupBox.classList.remove("show");
});


// Create Note And Saving To Local Storage
btnAddNote.addEventListener("click", (e) => {
    e.preventDefault();

    let valueNameNote = nameNote.value,
        valueDescriptionNote = descriptionNote.value;
    if (valueNameNote) {
        // Get Date Current Create Note
        let date = new Date(),
            year = date.getFullYear(),
            month = monthNameList[date.getMonth()],
            day = date.getDate();

        let noteInfo = {
            id: Math.random() * 30,
            name: valueNameNote,
            description: valueDescriptionNote ? valueDescriptionNote : "Empty!",
            date: `${month} ${day}, ${year}`
        }

        if (!isUpdate) {
            notes.push(noteInfo); // Adding New Note To Notes 
        } else {
            isUpdate = false;
            notes = [...notes].map((note) => { // Update Specified Note
                if (note.id === updateId) {
                    return noteInfo
                }
                return note;
            });
        }
        localStorage.setItem("notes", JSON.stringify(notes)); // Saving Notes To LocaL Storage
        btnClosePopup.click();
        showNotes();
    }

});


// Edit Note
function editNoteHandler(id, name, description) {
    isUpdate = true;
    updateId = id;
    addBox.click();
    popupTitle.innerText = "Update A Note";
    btnAddNote.innerText = "Update Note";
    nameNote.value = name;
    descriptionNote.value = description;
}


// Function To Show The Control Menu To Delete And Edit The Note
function showControlMenu(CurrentElement) {
    CurrentElement.parentElement.lastElementChild.classList.add("show");
    // Removing Show Class From The Settings Menu On Document Click
    document.addEventListener("click", (e) => {
        if (e.target.tagName != "I" || e.target != CurrentElement) {
            CurrentElement.parentElement.lastElementChild.classList.remove("show");
        }
    })
}


// Delete Note
function deleteNoteHandler(id) {
    let newNotes = notes.filter((note) => note.id !== id);
    notes = [...newNotes];
    localStorage.setItem("notes", JSON.stringify(notes));
    showNotes();
}