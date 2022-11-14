/* ===== VARIABLES ===== */

const URL = "https://pokeapi.co/api/v2/pokemon" //Vamos a llamar a los pokemon con el uso de la URL. Se coloca hasta pokemon para que solo con el nombre o numero llame al pokemon.
let nextUrl = "" //Se las coloca con let porque se las va a modificar
let prevUrl = ""

/* ===== GET HTML ELEMENTS ===== */
const app = document.querySelector(".app") //Seleccionamos toda la app
const searchBar = document.querySelector(".app__search") //Seleccionamos a la barra buscadora
const appContainer = document.querySelector(".app__container") //Seleccionamos al contenedor de los pokemones

/* ===== FUNCTIONS ===== */

//*******************************PRIMERA FORMA****************************

//Funcion para traernos los datos

function getData() {
        window.fetch(URL)
        .then((res) =>{ //Fetch (trae por defecto metodo GET) a traves de metodos va a buscar que hacer? Obtener datos, exportarlos, eliminarlos, etc.
        return res.json() //Con el .json() me trae un objeto en consola
    }).then((data) => {//Con el siguiente .then() obtenemos lo de la promesa anterior, ya que hay que consumirla 
        console.log(data)
        
        nextUrl = data.nextUrl
        prevUrl = data.previous

        // printPokemons(data.results)
    }) 
}

// getData()

//Para pintar los pokemon en el DOM 

// function printPokemons(data) {
//     console.log(data)
// }

/********************************/
//Forma mas abrevida de consumirla

// function getData() {
    
//     window.fetch(URL)
//     .then(res => res.json()) 
//     .then(data => { console.log(data.results)}) 
// }

// getData()
/***********************************/

//*******************************SEGUNDA FORMA****************************

//Async - Await

/*******SIN DESESTRUCTURACION********/

// async function getData() {
//     const res = await window.fetch(URL)
//     const data = await res.json()

//     nextUrl = data.nextUrl
//     prevUrl = data.previous

//     printPokemons(data.results)
// }

/*******CON DESESTRUCTURACION********/

async function getData(url) { //url metida despues 
    
    const res = await window.fetch(url) //url metida despues 
    const {next, previous, results} = await res.json()

    nextUrl = next
    prevUrl = previous

    printPokemons(results) 
}

/*Mostrando ahora si los pokemones en pantalla*/

/*********************Sin Destructuracion******************/
// function printPokemons(data) {
//     let html = ""

//     for (const pokemon of data)
//     console.log(pokemon)
// }

/*********************Con Destructuracion******************/
async function printPokemons(data) { //Esta funcion trae el nombre, habilidades, IMAGENES, id, etc.
    let html = ""

    for (const {url} of data) {
        const res = await window.fetch(url)
        // const result = await res.json()
        const {name, sprites} = await res.json()

        html += `
        <div class = "app__item">
            <img class = "app__item--img" src = "${sprites.other["official-artwork"].front_default}" alt= "${name}">
            <h2 class = "app__item--name">${name}</h2>
        </div>
        `

        //Se podria llamar con other.official-artwork, pero como esta el "-" se usan los "[]"
        /*console.log(name, sprites.other["official-artwork"].front_default)*/ //sprites contiene todo tipo de imagenes del mismo pokemon, y hay que procurar escoger la mas clara
    }

    appContainer.innerHTML = html
}

//Dando utilidad a los botones

const btnNext = () => {nextUrl ? getData(nextUrl) : window.alert("Nada que mostrar")} //Ambos botones comprueban si se tiene data

const btnPrev = () => {prevUrl ? getData(prevUrl) : window.alert("Nada que mostrar")}

getData(URL) //URL metida despues 


/*******ESTO ES SOLO PARA EL LISTENER DE LA BARRA DE BUSQUEDA**********/

async function printPokemon({value}) { //Esta funcion trae el nombre, habilidades, IMAGENES, id, etc.
    let html = ""
    const res = await window.fetch(URL + `/${value}`)
    const {name, sprites} = await res.json()
    // console.log(pokemon)
    
    html += `
    <div class = "app__item">
        <img class = "app__item--img" src = "${sprites.other["official-artwork"].front_default}" alt= "${name}">
        <h2 class = "app__item--name">${name}</h2>
    </div>
    `
    return html
}

// /* ===== LISTENERS ===== */
/*Lo mejor es entrar a .app y acceder a los botones*/
/*Tarda un poquito en llamar, pero es porque se tiene que preguntar al servidor*/

app.addEventListener("click", ({target}) => {
    if (target.classList.contains("button--prev")) btnPrev //Cuando el usuario de click va acceder a la variables btnPrev
    ()
    if (target.classList.contains("button--next")) btnNext
    ()
    if (target.classList.contains("button--initial")) 
    getData(URL)
})

//AHORA VAMOS CON LA BARRA DE BUSQUEDA

searchBar.addEventListener("change", async({target}) => {
    if(target.value !== " "){ //Por si el usuario busca algo vacio
        const html = await printPokemon(target)
        appContainer.innerHTML = html
    }else {
        getData(URL)
    }
})

