let inputSearch = null
let buttonSearch = null
let panelUsers = null
let panelStatistics = null
let users = []

const formatter = Intl.NumberFormat('pt-BR')

window.addEventListener ('load', async () => {
    mapElements()
    await fetchUsers()
    
    addEvents()
})

function mapElements() {
    inputSearch = document.querySelector('#search')
    buttonSearch = document.querySelector('#buttonSearch')
    panelUsers = document.querySelector('#panelUsers')
    panelStatistics = document.querySelector('#panelStatistics')
}

async function fetchUsers() {
    const res = await fetch ('https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo')
    const json = await res.json()
    users = json.results.map(({login, name, dob, gender, picture}) => {
        const fullName = `${name.first} ${name.last}`
        
        return{
            id: login.uuid,
            name: fullName,
            nameLowerCase: fullName.toLowerCase(),
            age: dob.age,
            gender: gender,
            picture: picture.large
        }
    }).sort((a, b) => {
        return a.name.localeCompare(b.name)
    })
}

function addEvents() {
    inputSearch.addEventListener('keyup', handleKeyUp)
}

function handleKeyUp(event) {
    const currentKey = event.key

    if (currentKey !== 'Enter') {
        return
    }

    const filterText = event.target.value

    if(filterText.trim() !== '') {
        filterUsers(filterText)
    }
}

function filterUsers(filterText) {
    const filterTextLowerCase = filterText.toLowerCase()

    const filteredUsers = users.filter(user => {
        return user.nameLowerCase.includes(filterTextLowerCase)
    })

    renderUsers(filteredUsers)
    renderStatistics(filteredUsers)
}

function renderUsers(users){
    panelUsers.innerHTML = ''

    const h3 = document.createElement('h3')
    if (users.length == 1) {
        h3.textContent = `${users.length} usuário encontrado`
    }
    else h3.textContent = `${users.length} usuários encontrados`

    const ul =document.createElement('ul')

    users.forEach(user => {
        const li = document.createElement('li')
        li.classList.add('flex-row')
        li.classList.add('space-bottom')

        const img = `<img class="avatar" src="${user.picture}" alt="${user.name}">`
        const userData = `<span>${user.name}, ${user.age}</span>`

        li.innerHTML = `${img}${userData}`

        ul.appendChild(li)
    })

    panelUsers.appendChild(h3)
    panelUsers.appendChild(ul)
}

function renderStatistics(users) {
    const countMale = users.filter(user => user.gender === 'male').length
    const countFemale = users.filter(user => user.gender === 'female').length
    const ageSum = users.reduce((accumulator, current) => {
        return accumulator + current.age
    }, 0)
    const ageAverage = ageSum / users.length || 0


    panelStatistics.innerHTML =
    `
        <h3>Estatísticas</3>

        <ul>
            <li><strong>Sexo masculino:</strong> ${countMale}</li>
            <li><strong>Sexo feminino:</strong> ${countFemale}</li>
            <li><strong>Soma das idades:</strong> ${formatNumber(ageSum)}</li>
            <li><strong>Média das idades:</strong> ${formatAverage(ageAverage)}</li>
        </ul>
    `
}

function formatNumber(number) {
    return formatter.format(number)
}

function formatAverage(number) {
    return number.toFixed(2).replace('.', ',')
}