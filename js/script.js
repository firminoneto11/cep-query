
const get_url_or_null = () => {
    let element = document.getElementById('input')
    let validation = validate_cep(element.value)
    const url = `https://viacep.com.br/ws/${element.value}/json/`
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

const get_json = () => {
    const url_or_null = get_url_or_null()
    if (url_or_null === null) {
        return null
    } else {
        const request = new XMLHttpRequest()
        request.open('GET', url_or_null)
        request.send()
        request.onload = () => {
            if (request.status === 200) {
                let json_object = JSON.parse(request.response)
                const properties_list = []
                for (let attribute in json_object) {
                    properties_list.push(json_object[attribute])
                }
                if (properties_list.length === 1) {
                    cep_not_exists()
                } else {
                    console.log(properties_list)
                }
            } else {
                console.log('A API não está funcionando no momento.')
            }
        }

    }
}

// Defining the trigger function to the button
document.getElementById("search").addEventListener('click', get_json)
