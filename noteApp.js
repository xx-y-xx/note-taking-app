const MOCK_NOTES = [
    {
        id: 1,
        title: 'Работа с формами',
        content: 'К определённым полям формы можно обратиться через form.elements по значению, указанному в атрибуте name',
        color: 'green',
        isFavorite: false,
    },
    // ...
]

const colors = {
    GREEN: 'green',
    BLUE: 'blue',
    RED: 'red',
    YELLOW: 'yellow',
    PURPLE: 'purple',
}

//модель и работа с данными
model = {
    notes: MOCK_NOTES, // notes: [],

    addNote(title, content, color) {

        const newNote = { id: Math.random(), title, conten, color, isFavorite: false }

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
            const title = document.querySelector('.input-title').value
            const content = content.value
            // Получение выбранного цвета! (появится чуть позже)
            const color = 'green'; // временно, пока не реализовали выбор цвета
            controller.addNote(title, content, color)

            title.value = ''
            content.value = ''
        }),


        noteList.addEventListener('click', function (event) {
            if (event.target.classList.contains('delete-button')) {
                const noteID = Number(event.target.closets('li').id)
                controller.deleteNote(noteID)
            }
        }),

            renderNotes(notes) {
            const list = document.querySelector('.notes-list')
            // находим контейнер для заметок и рендерим заметки в него (если заметок нет, отображаем соответствующий текст)
            let notesHTML = ''

            notes.forEach(el => {
                notesHTML += `
        <li id="${el.id}" class="${el.isFavorite ? 'favorite' : ''}">
          <b class="task-title">${el.title}</b>
          <p>${el.content}</p> 
          <button class="delete-button" type="button">Удалить 🗑</button>
        </li>
      `
                // не понимаю, как добавить выбранный цвет пользователем для заметки
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
        }
    },

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