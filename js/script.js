
const focus = (css_text) => {
    const style_tag = document.createElement('style')
    style_tag.appendChild(document.createTextNode(css_text))
    document.getElementsByTagName('head')[0].appendChild(style_tag)
}

const error_layout = (element) => {
    // Changing class name
    element.classList.remove('input')
    element.classList.add('input_error')
    element.placeholder = "O CEP informado é inválido. Tente novamente, utilizando apenas números!"
}

const normal_layout = (element) => {
    element.classList.remove('input_error')
    element.classList.add('input')
    element.placeholder = "Insira um número de CEP (Apenas números)."
}

const get_json = () => {
    // Storing the typed value in a variable
    let input_element = document.getElementsByClassName('input')[0]
    let typed_cep = input_element.value
    input_element.value = ""

    // Treating the inputted data
    const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
    if (typed_cep.length === 0) {
        error_layout(input_element)
        return null
    }
    for (let i in typed_cep) {
        if (numbers.includes(typed_cep[i])) {
            continue
        } else {
            error_layout(input_element)
            return null
        }
    }
    normal_layout(input_element)
    const url = `https://viacep.com.br/ws/${typed_cep}/json/`
    console.log(url)
}


// Async function to get the API Data
async function getEmployees(url) {
    let response = await fetch(url)
    let data = await response.json()
    return data
}

getEmployees().then((data) => console.log(data))
