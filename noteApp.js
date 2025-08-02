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
    notes: MOCK_NOTES,
    // notes: [],
    addNote(title, content, color) {

        const newNote = { id: Math.random(), title: title, content: content, color, isFavorite: false }

        this.notes.unshift(newNote)
    },

    deleteNote(noteId) {
        this.notes = this.notes.filter((n) => {
            return n.id !== noteId
        })
    },
    noteToggleFavorite(noteID){
        this.notes.forEach((n) => {
            if(n.id === noteID){
                n.isFavorite = !n.isFavorite
            }
        })
    },
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
                return
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
            if (event.target.classList.contains('favorite-icon')){
                const noteID = Number(event.target.closest('li').id)
                controller.noteToggleFavorite(noteID)
            }
        });

    },

    renderNotes(notes) {
        if (!model.notes.length) {
            const emptyMessage = document.querySelector('.messages-box')
            emptyMessage.textContent = '🔥 у тебя нет заметок'
        }

        const list = document.querySelector('.notes-list')
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
        // также здесь нужно будет повесить обработчики кликов на кнопки удаления и избранного

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
        view.renderNotes(model.notes)
        view.renderNotesCount(model.notes.length)
        view.showMessage('Заметка удалена')
    },
    addNote(title, content, color) {
        model.addNote(title, content, color)

        view.renderNotes(model.notes)
        view.renderNotesCount(model.notes.length)
        view.showMessage('Заметка добавлена')
    },
    noteToggleFavorite(noteID){
        model.noteToggleFavorite(noteID)
        view.renderNotes(model.notes)
    }


}

function init() {
    view.init()
}
document.addEventListener('DOMContentLoaded', init);