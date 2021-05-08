
const error_layout = () => {
    const input_field = document.getElementById('input')
    input_field.style.border = "solid 2px rgb(255, 0, 0)"
}

const normal_layout = () => {
    // TODO: Fix the hover/focus logic after an error
    const input_field = document.getElementById('input')
    const regular_border = (ele) => ele.style.border = "#5d5d5d 2px solid"
    const hover_border = (ele) => ele.style.border = "#88d453 2px solid"
    const focus_border = (ele) => ele.style.border = "rgb(86, 4, 194) 2px solid"
    regular_border(input_field)

    // Hover & Focus
    input_field.onmouseover = hover_border(input_field)
    input_field.onmouseleave = regular_border(input_field)
    input_field.onfocus = focus_border(input_field)
}

const get_json = () => {
    // Storing the typed value in a variable
    let input_element = document.getElementById('input')
    let typed_cep = input_element.value
    input_element.value = ""

    // Treating the inputted data
    const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
    if (typed_cep.length === 0) {
        error_layout()
        return null
    }
    for (let i in typed_cep) {
        if (numbers.includes(typed_cep[i])) {
            continue
        } else {
            error_layout()
            return null
        }
    }
    normal_layout()
    const url = `https://viacep.com.br/ws/${typed_cep}/json/`
    console.log(url)
}


async function getEmployees(url) {
    let response = await fetch(url)
    let data = await response.json()
    return data
}

getEmployees().then((data) => console.log(data))
