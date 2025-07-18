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
        isFavorite: false,
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

//модель и работа с данными
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
}

// 🔹 отображение
const view = {
    init() {
        this.renderNotes(model.notes)
        this.renderNotesCount(model.notes.length) // сразу получаем текущее количество заметок

        const form = document.querySelector('.note-form')
        const title = document.querySelector('.input-title')
        const content = document.querySelector('.input-text')

        const noteList = document.querySelector('.notes-list')


        form.addEventListener('submit', (event) => {
            event.preventDefault()
            const titleValue = document.querySelector('.input-title').value
            const contentValue = content.value
            const color = document.querySelector('input[name="color"]:checked').value
            controller.addNote(titleValue, contentValue, color)

            title.value = ''
            content.value = ''
        });


        noteList.addEventListener('click', function (event) {
            if (event.target.classList.contains('delete-button')) {
                const noteID = Number(event.target.closest('li').id)
                controller.deleteNote(noteID)
            }
        });

    },

    renderNotes(notes) {
        //👇спорное решение       
        if (!model.notes.length) {
            const emptyMessage = document.querySelector('.messages-box')
            emptyMessage.textContent = '🔥 у тебя нет заметок'
        }
        //☝спорное решение

        const list = document.querySelector('.notes-list')
        // находим контейнер для заметок и рендерим заметки в него (если заметок нет, отображаем соответствующий текст)
        let notesHTML = ''

        notes.forEach(el => {
            notesHTML += `
        <li id="${el.id}" class="${el.isFavorite ? 'favorite' : ''}">

        <div class="note-header" style="background-color: ${DICTIONARY_COLORS[el.color]}">
        <b class="note-title">${el.title}</b>
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
    showMessage(msg) {
        // показывает сообщение
        const infoMessage = document.querySelector('.messages-box')
        infoMessage.textContent = msg
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
        // здесь можно добавить валидацию полей
        const infoVallidationTitle = document.querySelector('.input-title').value
        const infoVallidationContent = document.querySelector('.input-text').value
        if (infoVallidationTitle.length > 50 || infoVallidationContent.length > 300 || infoVallidationTitle.trim().length === 0) {
            view.showMessage('некорректный ввод')
        }

        model.addNote(title, content, color)

        view.renderNotes(model.notes)
        view.renderNotesCount(model.notes.length)
        view.showMessage('Заметка добавлена')
    },


}

function init() {
    view.init()
}
init() 