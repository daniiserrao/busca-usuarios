let inputSearch = null
let buttonSearch = null
let panelUsers = null
let panelStatistics = null
let users = []

window.addEventListener ('load', async () => {
    mapElements()
    await fetchUsers()
    console.log(users)
})

async function fetchUsers() {
    const res = await fetch ('https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo')
    const json = await res.json()
    users = json.results
}

function mapElements() {
    inputSearch = document.querySelector('#inputSearch')
    buttonSearch = document.querySelector('#buttonSearch')
    panelUsers = document.querySelector('#panelUsers')
    panelStatistics = document.querySelector('#panelStatistics')
}

