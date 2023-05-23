const createTaskForm = document.getElementById('createTaskForm')
createTaskForm.innerHTML = ''
const btnCreateTask = document.getElementById('btnCreateTask')
const createTaskTemplateForm = document.getElementById('createTaskTemplate').innerHTML
const body = document.getElementsByTagName('body')
const upcomingDiv = document.getElementById('upcoming')
const inProgressDiv = document.getElementById('inProgress')
const completedDiv = document.getElementById('completed')
const taskCard = document.getElementById('taskCardTemplate').content.children[0]
const dateDiv = document.getElementById('date')
const timeDiv = document.getElementById('time')
// const menuItems = document.getElementById('menuItems').children

// console.table(entries)

// Array.from(menuItems).forEach(e => {
//     e.addEventListener('click', () => {
//         Array.from(menuItems).forEach(elem => {
//             if (elem.classList.contains('active')) {
//                 elem.classList.remove('active')
//             }
//         })
//         e.classList.add('active')
//     })
// })

// localStorage.clear()

function findKey(cardId) {
    const entries = Object.entries(localStorage)
    let titleKey
    Array.from(entries).forEach(e => {
        let taskKey = e[0]  
        let index = ''
        for (let j = 3; j < taskKey.length; j++) {
            index = index + taskKey.charAt(j)
        }

        if (taskKey == `CKU${cardId}`) {
            titleKey = taskKey
        } else if (taskKey == `CKI${cardId}`) {
            titleKey = taskKey
        } else if (taskKey == `CKC${cardId}`) {
            titleKey = taskKey
        }
    })
    return titleKey
}

const printDateTime = () => {
    let date = new Date()
    dateDiv.innerText = date.toLocaleDateString()
    timeDiv.innerText = date.toLocaleTimeString()
}

const onReload = () => {
    for (let i = 0; i < localStorage.length; i++) {
        if (localStorage.key(i).charAt(2) === 'U') {
            let taskKey = localStorage.key(i)
            render(upcomingDiv, taskKey)
        } else if (localStorage.key(i).charAt(2) === 'I') {
            let taskKey = localStorage.key(i)
            render(inProgressDiv, taskKey)
        } else if (localStorage.key(i).charAt(2) === 'C') {
            let taskKey = localStorage.key(i)
            render(completedDiv, taskKey)
        }
    }
}

const render = (parentDiv, taskKey) => {
    taskCard.children[0].innerHTML = `<p><strong>${JSON.parse(localStorage.getItem(taskKey))[0]}</strong></p>`
    taskCard.children[1].innerHTML = `<p>${JSON.parse(localStorage.getItem(taskKey))[1]}</p>`
    taskCardContainer = document.createElement('div')
    taskCardContainer.classList.add('task-card-box')
    taskCardContainer.classList.add(`${JSON.parse(localStorage.getItem(taskKey))[2]}`)
    taskCardContainer.innerHTML = taskCard.innerHTML
    parentDiv.appendChild(taskCardContainer)
    taskCardContainer.classList.add('scroll-down')
    createTaskForm.innerHTML = ''
    btnCreateTask.innerHTML = 'Create Task'
}

const scrap = (event) => {
    let targetCard = event.target.parentElement.parentElement
    targetCard.classList.remove('scroll-down')
    targetCard.classList.add('scroll-up')
    targetCard.innerHTML = ''
    targetCard.style.padding = '0'

    targetCard.addEventListener('animationend', () => {
        remove(targetCard)
    })
}
const remove = (target) => {
    // target.remove()
    const entries = Object.entries(localStorage)
    // console.log(target.classList[1])
    entries.forEach((e, i) => { 
        // console.log(i)
        key = e[0]
        console.log(e[0][0]+e[0][1])
        if(e[0][0]+e[0][1] == 'CK'){
            let index =''   
            for (let j = 3; j < key.length; j++) {
                index = index + key.charAt(j)
            }
            if(index == target.classList[1]){
                localStorage.removeItem(localStorage.key(i))
                console.log('deleted ',i)
            }
        }
    })
    target.remove()
}

const removeLocalStorage = (titleKey, descKey) => {
    localStorage.removeItem(titleKey)
    localStorage.removeItem(descKey)
}

const move = (event) => {
    let cardType = event.target.parentElement.parentElement.parentElement
    let cardId = event.target.parentElement.parentElement.classList[1]
    console.log('cardId', cardId)
    let titleKey = findKey(cardId)
    console.log(titleKey)
    // let descKey = titleKey.replace('H', 'D')

    if (cardType.classList.contains('upcoming')) {
        let heading = localStorage.getItem(titleKey)
        render(inProgressDiv, titleKey) 
        let newTitleKey = titleKey.replace('U', 'I')
        localStorage.setItem(newTitleKey, heading)
        removeLocalStorage(titleKey)
        scrap(event)
    } else if (cardType.classList.contains('in-progress')) {
        let heading = localStorage.getItem(titleKey)
        render(completedDiv, titleKey)
        let newTitleKey = titleKey.replace('I', 'C')
        localStorage.setItem(newTitleKey, heading)
        removeLocalStorage(titleKey)
        scrap(event)
    } else if (cardType.classList.contains('completed')) {
        scrap(event)
    }
}


// body[0].style.backgroundImage = "url('resources/polygon-scatter-haikei.svg')"

btnCreateTask.addEventListener('click', (e) => {
    if (createTaskForm.hasChildNodes()) {
        createTaskForm.innerHTML = ''
        btnCreateTask.innerHTML = 'Create Task'
        createTaskForm.classList.add('pre-innerHtml')
        createTaskForm.classList.remove('post-innerHtml')
    } else {
        createTaskForm.innerHTML = createTaskTemplateForm
        btnCreateTask.innerHTML = 'Cancel'
        createTaskForm.classList.remove('pre-innerHtml')
        createTaskForm.classList.add('post-innerHtml')

        const btnTaskAdd = document.getElementById('btnTaskAdd')
        const taskHeading = document.getElementById('taskHeading')
        const taskDescription = document.getElementById('taskDescription')
        const taskType = document.getElementById('taskType')

        btnTaskAdd.addEventListener('click', (e) => {
            const taskHeadingValue = taskHeading.value
            const taskDescriptionValue = taskDescription.value

            if (taskHeadingValue != '' && taskDescriptionValue != '') {

                if (localStorage.getItem('count') !== null) {
                    let count = parseInt(localStorage.getItem('count'))
                    count++
                    localStorage.setItem('count', count)
                } else {
                    localStorage.setItem('count', 0)
                }

                if (taskType.value == 'upcoming') {
                    let taskKey = `CKU${localStorage.getItem('count')}`
                    let taskValue = [taskHeadingValue, taskDescriptionValue, localStorage.getItem('count')]
                    taskValue = JSON.stringify(taskValue)
                    localStorage.setItem(taskKey, taskValue)
                    render(upcomingDiv, taskKey)

                } else if (taskType.value == 'inProgress') {
                    let taskKey = `CKI${localStorage.getItem('count')}`
                    let taskValue = [taskHeadingValue, taskDescriptionValue, localStorage.getItem('count')]
                    taskValue = JSON.stringify(taskValue)
                    localStorage.setItem(taskKey, taskValue)
                    render(inProgressDiv, taskKey)

                } else if (taskType.value == 'completed') {
                    let taskKey = `CKC${localStorage.getItem('count')}`
                    let taskValue = [taskHeadingValue, taskDescriptionValue, localStorage.getItem('count')]
                    taskValue = JSON.stringify(taskValue)
                    localStorage.setItem(taskKey, taskValue)
                    render(completedDiv, taskKey)

                }
            }

        })

    }

})



onReload()