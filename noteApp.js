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
const messages = {
    deleteMessage: { image: 'assets/images/done.svg', class: 'message-success', text: 'Заметка удалена'},
    addMessage: {image: 'assets/images/done.svg', class: 'message-success', text: 'Заметка добавлена' },
    messageWarning: {image: 'assets/images/warning.svg', class: 'message-warning', text: 'Заполните все поля'},
    messageWarningLength: {image: 'assets/images/warning.svg', class: 'message-warning', text: 'Максимальная длина заголовка - 50 символов'},
    messageWarningContentLength: {image: 'assets/images/warning.svg', class: 'message-warning', text: 'Максимальная длина описания - 300 символов'}
}

const model = {
    notes: [],
    isFilteringFavorites: false,
    //🔸 вспомогательные методы
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
    updateCentral(callbackFunction) {//универсальный метод обновления + автосохранение
        callbackFunction(this.notes)
        this.saveStorageNotes()
    },
    findNoteByID(noteFind) {
        return this.notes.find(n => n.id === noteFind)
    },

    //🔸 работа с данными
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
        this.updateCentral(notesArray => {
            const deleteIndex = this.findNoteByID(noteId)
            if (deleteIndex) {
                const deleteNoteIndex = notesArray.indexOf(deleteIndex)
                notesArray.splice(deleteNoteIndex, 1)
            }
        })
    },
    noteToggleFavorite(noteID) {
        this.updateCentral(notesArray => {//зря рефакторил😱, теперь я не могу обратится к notesArray и работаю только через this.notes
            const toggleNote = this.findNoteByID(noteID)//😱через find было бы надёжнее 
            if (toggleNote) toggleNote.isFavorite = !toggleNote.isFavorite
        })
    },
    listFavorite() {
        return this.notes.filter((favoriteNote) => favoriteNote.isFavorite === true)
    }
}

// 🔹 отображение
const view = {
    init() {

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
            if(!titleValue.trim() || !contentValue.trim()){
                this.showMessage(messages.messageWarning)
                return
            }
            if (titleValue.length > 50) {
                this.showMessage(messages.messageWarningLength)
                return
            }
            if (contentValue.length > 300) {
                this.showMessage(messages.messageWarningContentLength)
                return//т.к в addEventListener используется стрелочная функция, то можно использовать this
            }
            controller.addNote(titleValue, contentValue, color)

            title.value = ''
            content.value = ''
            //сброс на исходный цвет заметки
            document.querySelector('input[value="yellow"]').checked = true
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
            controller.getVisibleNotes(event.target.checked)//🔹change возвращает булевое значение при изменеии input типа checkbox            
        });

    },

    renderNotes(notes) {
        const emptyMessage = document.querySelector('.messages-box')//костыль для вывода сообщений о пустых заметках
        const list = document.querySelector('.notes-list')// фарширую этот тег заметками

        if (!notes.length) {
            emptyMessage.innerHTML = '<div class="empty-list">У вас нет ещё ни одной заметки. Заполните поля выше</div>';
            list.innerHTML = '';
        } else {
            emptyMessage.textContent = ''//удаляю старые сообщения

            let notesHTML = ''

            notes.forEach(el => {
                notesHTML += `
        <li id="${el.id}" class="${el.isFavorite ? 'favorite' : ''}">

            <div class="note-header" style="background-color: ${DICTIONARY_COLORS[el.color]}">
                <h3 class="note-title">${el.title}</h3>
                <div class="buttons">
                    <input class="favorite-icon" type="checkbox" ${el.isFavorite ? 'checked' : ''}>
                    <button class="delete-button" type="button"></button>
                </div>        
            </div>            
          <p class="note-content">${el.content}</p>           
        </li>      `
            })

            list.innerHTML = notesHTML
        }
    },
    renderNotesCount(count) {
        const currentCount = document.querySelector('.count')
        currentCount.textContent = count
    },
    showMessage(messageType) {
        const itemMessage = document.createElement('div')
        itemMessage.className = `message ${messageType.class ? messageType.class : ''}`
        itemMessage.innerHTML = `
        <img src="${messageType.image}">
        <span>${messageType.text}</span>        
        `

        document.querySelector('.messages-box').append(itemMessage)

        setTimeout(() => { itemMessage.remove() }, 3000)
    }
}
//🔹
const controller = {
    deleteNote(noteID) {
        model.deleteNote(noteID)

        this.getVisibleNotes(showFavoritesOnly = model.isFilteringFavorites)
        view.renderNotesCount(model.notes.length)
        view.showMessage(messages.deleteMessage)
    },
    addNote(title, content, color) {
        model.addNote(title, content, color)

        this.getVisibleNotes(showFavoritesOnly = model.isFilteringFavorites)
        view.renderNotesCount(model.notes.length)
        view.showMessage(messages.addMessage)
    },
    noteToggleFavorite(noteID) {
        model.noteToggleFavorite(noteID)
        this.getVisibleNotes(showFavoritesOnly = model.isFilteringFavorites)
    },
    //вспомогаетльный метод    
    getVisibleNotes(showFavoritesOnly) {
        model.isFilteringFavorites = showFavoritesOnly
        const visible = model.isFilteringFavorites ? model.listFavorite() : model.notes
        view.renderNotes(visible)
    },
}

function init() {
    model.launchLocalStorage()
    view.init()
}
document.addEventListener('DOMContentLoaded', init);