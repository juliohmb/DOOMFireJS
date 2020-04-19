const firePixelsArray = []
const fireWidth = 40
const fireHeight = 40

const fireColorsPalette = [{"r":7,"g":7,"b":7},{"r":31,"g":7,"b":7},{"r":47,"g":15,"b":7},{"r":71,"g":15,"b":7},{"r":87,"g":23,"b":7},{"r":103,"g":31,"b":7},{"r":119,"g":31,"b":7},{"r":143,"g":39,"b":7},{"r":159,"g":47,"b":7},{"r":175,"g":63,"b":7},{"r":191,"g":71,"b":7},{"r":199,"g":71,"b":7},{"r":223,"g":79,"b":7},{"r":223,"g":87,"b":7},{"r":223,"g":87,"b":7},{"r":215,"g":95,"b":7},{"r":215,"g":95,"b":7},{"r":215,"g":103,"b":15},{"r":207,"g":111,"b":15},{"r":207,"g":119,"b":15},{"r":207,"g":127,"b":15},{"r":207,"g":135,"b":23},{"r":199,"g":135,"b":23},{"r":199,"g":143,"b":23},{"r":199,"g":151,"b":31},{"r":191,"g":159,"b":31},{"r":191,"g":159,"b":31},{"r":191,"g":167,"b":39},{"r":191,"g":167,"b":39},{"r":191,"g":175,"b":47},{"r":183,"g":175,"b":47},{"r":183,"g":183,"b":47},{"r":183,"g":183,"b":55},{"r":207,"g":207,"b":111},{"r":223,"g":223,"b":159},{"r":239,"g":239,"b":199},{"r":255,"g":255,"b":255}]

var debug = false
var wind = true

var interval

var running = true

function start(){
    createFireDataStructure()
    setSource()
    render()
    if(interval == null){
        interval = setInterval(calculateFirePropagation, 50)
    }
    running = true
}

function pause(){
    if(running === true){
        running = false
        clearInterval(interval)
        interval = null
    }
}

function createFireDataStructure(){
    const numberOfPixels = fireWidth * fireHeight

    for (let i = 0; i < numberOfPixels; i++){
        firePixelsArray[i] = 0
    }
}

function setSource(){
    const startIndexSource = (fireHeight * fireWidth) - fireWidth
    const endIndexSource = (fireHeight * fireWidth)
    for(let i = startIndexSource; i < endIndexSource; i++){
        firePixelsArray[i] = 36
    }
}

function calculateFirePropagation(){
    for(let i = 0; i < (fireHeight * fireWidth) - fireWidth; i++){
        let bellowIntensity = firePixelsArray[i + fireWidth]
        let decay = Math.floor(Math.random() * 3 )
        let currentIntensity = bellowIntensity - (decay)
        if(wind === true){
            currentIntensity >= 0?firePixelsArray[i - (decay)] = currentIntensity:firePixelsArray[i] = 0;
        }else{
            currentIntensity >= 0?firePixelsArray[i] = currentIntensity:firePixelsArray[i] = 0;
        }
    }
    render()
}

function render(){
        let table = "<table>"
        for (let i = 0; i < fireHeight; i++){
            table += "<tr>"
            for(let j = 0; j < fireWidth; j++){
                let index = i * fireWidth + j
                if (debug === true){
                    table += `<td><span>${firePixelsArray[index]}</span ><span class="index">${index}</span></td>`
                }else{
                    table += `<td class="debugOff" style="background-color:rgb(${fireColorsPalette[firePixelsArray[index]].r}, ${fireColorsPalette[firePixelsArray[index]].g}, ${fireColorsPalette[firePixelsArray[index]].b})"></td>`
                }
            }
            table += "</tr>"
        }
        table += "</table>"
        document.querySelector("#canvas").innerHTML = table
}

function toggleWind(){
    wind === true?wind = false:wind = true
}


start()