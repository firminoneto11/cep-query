let inputted_cep
let coords = []

const get_url_or_null = () => {
    let element = document.getElementById('input')
    let validation = validate_cep(element.value)
    const url = `https://viacep.com.br/ws/${element.value}/json/`
    inputted_cep = element.value
    element.value = ""

    // This code will check if the input given is valid as a CEP number and will return the url if it is
    // or false if it is not. Also, it will apply some visual changes to the input element to show the user
    // that what he typed is not valid.
    if (validation) {
        if (element.className === "input") {
            element.placeholder = "Insira um número de CEP (Apenas números)."
            return url
        } else {
            element.placeholder = "Insira um número de CEP (Apenas números)."
            element.classList.remove('input_error')
            element.classList.add('input')
            return url
        }
    } else {
        if (element.className === "input") {
            element.placeholder = "O CEP informado é inválido. Tente novamente, utilizando apenas números!"
            element.classList.remove('input')
            element.classList.add('input_error')
            return null

        } else {
            element.placeholder = "O CEP informado é inválido. Tente novamente, utilizando apenas números!"
            return null
        }
    }
}

const cep_not_exists = () => {
    // This function will change the css layout of the input field if the API doesn't returns any valid value
    const element = document.getElementById("input")
    if (element.className === 'input') {
        element.placeholder = "O CEP informado não existe. Tente novamente."
        element.classList.remove('input')
        element.classList.add('input_error')
    } else {
        element.placeholder = "O CEP informado não existe. Tente novamente."
    }
    // Hiding the map
    const mapa = document.getElementsByClassName('map')[0]
    if (mapa.style.visibility == 'visible') {
        mapa.style.visibility = 'hidden'
    }
}

const validate_cep = (inputted_string) => {
    /*
    This function is expecting to receive a string and will check if the whole string is a valid number.
    If it is, it will return true and if it isn't, false.
    */
    const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
    if (inputted_string.length !== 8) {
        return false
    }
    for (let index in inputted_string) {
        if (numbers.includes(inputted_string[index])) {
            continue
        } else {
            return false
        }
    }
    return true
}

const update_table = () => {
    /* This function will update the table, to make sure that the new content doesn't override the old content */
    let tb = document.getElementById('tbody')
    document.getElementById('table').removeChild(tb)
    let new_tbody = document.createElement('tbody')
    let new_tr = document.createElement('tr')
    new_tbody.id = 'tbody'
    document.getElementById('table').appendChild(new_tbody)
    document.getElementById('tbody').appendChild(new_tr)
    const table = document.getElementById('table')
    if (table.style.display === 'block') {
        table.style.display = 'none'
    } else {
        document.getElementById('table').style.display = 'none'
    }
}

const update_map = () => {
    const mapa = document.getElementsByClassName('map')[0]
    if (mapa.style.visibility == 'hidden') {
        mapa.style.visibility = 'visible'
    }
}

async function get_lat_long(geocode_url) {
    if (coords.length > 0) {
        coords.pop()
        coords.pop()
    }
    const response = await fetch(geocode_url)
    const data = await response.json()
    // Treating the data
    let cd = []
    let results = data.results
    results = results[0]
    for (let att in results) {
        if (att === 'geometry') {
            let gmty = results[att]
            let new_lat = gmty.location.lat
            let new_lng = gmty.location.lng
            cd.push(new_lat)
            cd.push(new_lng)
        }
    }
    // Returning the treated data
    coords = [cd[0], cd[1]]
}

async function get_json() {
    // Restarting the css display from the table
    update_table()
    // Getting either the url or a null value
    const url_or_null = get_url_or_null()
    const properties_list = []
    if (url_or_null === null) {
        return null
    } else {
        // Sending a new request to the API
        const request = new XMLHttpRequest()
        request.open('GET', url_or_null)
        request.send()
        request.onload = async () => {
            if (request.status === 200) {
                let json_object = JSON.parse(request.response)
                for (let attribute in json_object) {
                    if (attribute == 'logradouro' || attribute == 'bairro' || attribute == 'localidade' || attribute == 'uf' || attribute == 'complemento' || attribute == 'cep') {
                        properties_list.push(json_object[attribute])
                    }
                }
                // This part will check if the CEP exists or not
                if (properties_list.length !== 6) {
                    cep_not_exists()
                    return null
                } else {
                    // Ordering the data in order to display it
                    const address = {
                        'rua': properties_list[1],
                        'bairro': properties_list[3],
                        'cidade': properties_list[4],
                        'estado': properties_list[5],
                        'complemento': properties_list[2],
                        'cep': properties_list[0]
                    }
                    // Inserting the data filtered from the JSON returned by the API
                    const tbody = document.getElementById('tbody')
                    for (let attribute in address) {
                        if (address[attribute].length === 0) {
                            address[attribute] = 'N/T'
                        }
                        let table_data = document.createElement('td')
                        table_data.classList.add('td')
                        table_data.innerHTML = address[attribute]
                        tbody.firstChild.appendChild(table_data)
                        switch (attribute) {
                            case 'rua':
                                document.getElementsByClassName('td')[0].setAttribute('data-label', 'Rua')
                                break
                            case 'bairro':
                                document.getElementsByClassName('td')[1].setAttribute('data-label', 'Bairro')
                                break
                            case 'cidade':
                                document.getElementsByClassName('td')[2].setAttribute('data-label', 'Cidade')
                                break
                            case 'estado':
                                document.getElementsByClassName('td')[3].setAttribute('data-label', 'Estado')
                                break
                            case 'complemento':
                                document.getElementsByClassName('td')[4].setAttribute('data-label', 'Complemento')
                                break
                            default:
                                document.getElementsByClassName('td')[5].setAttribute('data-label', 'CEP')
                        }
                    }
                    // Displaying the table onto the screen after is fully filled
                    let table = document.getElementById('table')
                    table.style.display = 'table'
                    // Getting new new_coords based on CEP
                    geolocation_json = `https://maps.googleapis.com/maps/api/geocode/json?address=${inputted_cep}&key=AIzaSyCDH3MaFhz3QjbMd-XvYc79DoBj0XE5x_8`

                    // Setting the new_coords to the map
                    await get_lat_long(geolocation_json)
                    map.setCenter(new google.maps.LatLng(coords[0], coords[1]))
                    update_map()
                }
            } else {
                console.log('A API não está funcionando no momento.')
                return null
            }
        }
    }
}


// Defining the trigger function to the button
document.getElementById("search").addEventListener('click', get_json)

// Adding the 'enter' button to also trigger the event
const input_field = document.getElementById("input")
input_field.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        event.preventDefault()
        document.getElementById("search").click();
    }
})

// Attaching the update_table() function to the onload property, in case that the table loads with the
// display block activated
document.getElementById('table').onload = update_table()
