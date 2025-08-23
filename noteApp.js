const MOCK_NOTES = [
    {
        id: 1,
        title: 'Работа с формами',
        content: 'К определённым полям формы можно обратиться через form.elements по значению, указанному в атрибуте name',
        color: 'green',
        isFavorite: false,
    },
    {
        id: 2,
        title: 'Флекс Флекс',
        content: 'К определённым полям формы можно обратиться через form.elements по значению, указанному в атрибуте name',
        color: 'purple',
        isFavorite: true,
    },
    // ...
]

const DICTIONARY_COLORS = {
    green: `var(--note-color-green)`,
    blue: `var(--note-color-blue)`,
    red: `var(--note-color-red)`,
    yellow: `var(--note-color-yellow)`,
    purple: `var(--note-color-purple)`,
    error: `var(--message-color-error)`,
    success: `var(--message-color-success)`,
}

const model = {

    notes: [],

    saveStorageNotes() { //хранение данных в кэши
        localStorage.setItem('notesStorage', JSON.stringify(this.notes))
    },
    launchLocalStorage() { // потом можно зарефакторить через тернальный оператор
        const DataStorage = localStorage.getItem('notesStorage')
        if (DataStorage) {
            this.notes = JSON.parse(DataStorage)
        } else {
            // this.notes = []
            this.notes = [...MOCK_NOTES]
            // this.saveStorageNotes() // спорное решение которое не сработает
        }
    },
    updateCentral(callbackFunction) {
        callbackFunction(this.notes)
        // (this.notes)callbackFunction

        this.saveStorageNotes()
    },
    /*👇
        addNote(title, content, color) {
    
            const newNote = { id: Math.random(), title: title, content: content, color, isFavorite: false }
    
            this.notes.unshift(newNote)        
        },
    
        deleteNote(noteId) {
            this.notes = this.notes.filter((n) => {
                return n.id !== noteId
            })       
        },
        noteToggleFavorite(noteID) {
            this.notes.forEach((n) => {
                if (n.id === noteID) {
                    n.isFavorite = !n.isFavorite
                }
            })        
        },
        listFavorite() {
            return this.notes.filter((favoriteNote) => favoriteNote.isFavorite === true)
        }☝ */
    addNote(title, content, color) {
        this.updateCentral(notesArray => {
            const newNote = {
                id: Math.random(),
                title,
                content,
                color,
                isFavorite: false
            }
            notesArray.unshift(newNote)
        })        
    },
    deleteNote(noteId) {
        this.updateCentral(notesArray =>{
             const deleteIndex = notesArray.findIndex(nid => nid.id === noteId)
             if (deleteIndex !== -1) notesArray.splice (deleteIndex, 1)
        })
    },
    noteToggleFavorite(noteID) {
        this.updateCentral(notesArray => {notesArray.forEach((n) => {
            if (n.id === noteID){
                n.isFavorite = !n.isFavorite
            }
            })})
    },
    listFavorite() {
            return this.notes.filter((favoriteNote) => favoriteNote.isFavorite === true)
        }

    
}

// 🔹 отображение
const view = {
    init() {
        // controller.launchLocalStorage() 🔥🔥🔥

        this.renderNotes(model.notes)
        this.renderNotesCount(model.notes.length) // сразу получаем текущее количество заметок

        const form = document.querySelector('.note-form')
        const title = document.querySelector('.input-title')// на всякий случай ?
        const content = document.querySelector('.input-text')// на всякий случай ?

        const noteList = document.querySelector('.notes-list')
        const checkboxFavoriteToRender = document.querySelector('.checkboxFavorite')


        form.addEventListener('submit', (event) => {
            event.preventDefault()
            const titleValue = document.querySelector('.input-title').value
            const contentValue = content.value
            const color = document.querySelector('input[name="color"]:checked').value
            //валидация
            if (titleValue.length === 0) {
                this.showMessage('Заголовок заметки пустой', 'error')
                return
            }

            if (contentValue.length === 0) {
                this.showMessage('Содержимое заметки пусто', 'error')
                return
            }

            if (titleValue.length > 50) {
                this.showMessage('Название заметки более 50 символов', 'error')
                return
            }

            if (contentValue.length > 300) {
                this.showMessage('Длина заметки более 300 символов', 'error')
                return//т.к в addEventListener используется стрелочная функция, то можно использовать this
            }
            controller.addNote(titleValue, contentValue, color)

            title.value = ''
            content.value = ''
        });

        noteList.addEventListener('click', function (event) {
            if (event.target.classList.contains('delete-button')) {
                const noteID = Number(event.target.closest('li').id)
                controller.deleteNote(noteID)
            }
            if (event.target.classList.contains('favorite-icon')) {
                const noteID = Number(event.target.closest('li').id)
                controller.noteToggleFavorite(noteID)
            }
        });

        checkboxFavoriteToRender.addEventListener('change', (event) => { //🔹особенность работы change с input
            controller.isCheckboxFavirite(event.target.checked)//🔹change возвращает булевое значение при изменеии input типа checkbox
        });

    },

    renderNotes(notes) {
        const emptyMessage = document.querySelector('.messages-box')//костыль для вывода сообщений о пустых заметках
        const list = document.querySelector('.notes-list')// фарширую этот тег заметками

        if (!model.notes.length) {
            emptyMessage.textContent = 'У вас нет ещё ни одной заметки. Заполните поля выше'

            list.innerHTML = ''
        } else {
            emptyMessage.textContent = ''//удаляю старые сообщения

            let notesHTML = ''

            notes.forEach(el => {
                notesHTML += `
        <li id="${el.id}" class="${el.isFavorite ? 'favorite' : ''}">

        <div class="note-header" style="background-color: ${DICTIONARY_COLORS[el.color]}">
        <b class="note-title">${el.title}</b>
        <img class="favorite-icon" src="${el.isFavorite ? 'assets/images/heart-active.svg' : 'assets/images/heart-inactive.svg'}" />
        <button class="delete-button" type="button">Удалить 🗑</button>
        </div>  
          
          <p class="note-conten">${el.content}</p> 
          
        </li>      `

            })

            list.innerHTML = notesHTML
        }
    },
    renderNotesCount(count) {
        const currentCount = document.querySelector('.count')
        currentCount.textContent = count
    },
    showMessage(msg, type = 'success') {
        const itemMessage = document.createElement('div')
        itemMessage.className = type === 'error' ? 'message-error' : 'message-success'
        itemMessage.textContent = msg

        document.querySelector('.messages-box').append(itemMessage)

        setTimeout(() => { itemMessage.remove() }, 3000)
    }
}
const controller = {
    deleteNote(noteID) {
        model.deleteNote(noteID)
        //запись 🔥🔥🔥
        // model.saveStorageNotes()

        view.renderNotes(model.notes)
        view.renderNotesCount(model.notes.length)
        view.showMessage('Заметка удалена')
    },
    addNote(title, content, color) {
        model.addNote(title, content, color)

        //запись 🔥🔥🔥
        // model.saveStorageNotes()

        view.renderNotes(model.notes)
        view.renderNotesCount(model.notes.length)
        view.showMessage('Заметка добавлена')
    },
    noteToggleFavorite(noteID) {
        model.noteToggleFavorite(noteID)
        //запись 🔥🔥🔥
        // model.saveStorageNotes()

        view.renderNotes(model.notes)
    },
    isCheckboxFavirite(isFavorite) {
        if (isFavorite) {
            model.listFavorite()//я напрямую обращаюсь в model и там мутирую массив
            view.renderNotes(model.listFavorite())
        } else {
            view.renderNotes(model.notes)
        }
    },
    // launchLocalStorage() {// хранение данных 🔥🔥🔥
    // model.launchLocalStorage()
    // }
}

function init() {
    view.init()
}
document.addEventListener('DOMContentLoaded', init);