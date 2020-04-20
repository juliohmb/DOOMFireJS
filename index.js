const firePixelsArray = []
const fireColorsPalette = ["#070707", "#1f0707", "#2f0f07", "#470f07", "#571707", "#671f07", "#771f07", "#8f2707", "#9f2f07", "#af3f07", "#bf4707", "#c74707", "#df4f07", "#df5707", "#df5707", "#d75f07", "#d75f07", "#d7670f", "#cf6f0f", "#cf770f", "#cf7f0f", "#cf8717", "#c78717", "#c78f17", "#c7971f", "#bf9f1f", "#bf9f1f", "#bfa727", "#bfa727", "#bfaf2f", "#b7af2f", "#b7b72f", "#b7b737", "#cfcf6f", "#dfdf9f", "#efefc7", "#ffffff"]
var interval
var stopnterval
var running = true
// configuration
const fireWidth = 45
const fireHeight = 45
var debug = false
var wind = true
const fireDecay = 3
// ---


function start(){
    createFireDataStructure()
    setSource()
    render()
    clearInterval(stopnterval)
    stopnterval = null
    clearInterval(interval)
    interval = null
    if(interval == null){
        interval = setInterval(calculateFirePropagation, 50)
    }
    running = true
}

function stop(){
    let max = firePixelsArray[fireHeight * fireWidth - 1]
    stopnterval = setInterval(() => {
        if(max <= 0){
            clearInterval(stopnterval)
            stopnterval = null
        }else{
            max -= 1
            setSource(max)
        }
    }, 50)
}

function pause(){
    if(running === true){
        running = false
        clearInterval(interval)
        interval = null
    }
}

function play(){
    if(running === false){
        running = true
        calculateFirePropagation()
        interval = setInterval(calculateFirePropagation, 50)
    }
}

function createFireDataStructure(){
    const numberOfPixels = fireWidth * fireHeight

    for (let i = 0; i < numberOfPixels; i++){
        firePixelsArray[i] = 0
    }
}

function setSource(intensity = 36){
    const startIndexSource = (fireHeight * fireWidth) - fireWidth
    const endIndexSource = (fireHeight * fireWidth)
    for(let i = startIndexSource; i < endIndexSource; i++){
        firePixelsArray[i] = intensity
    }
}

function calculateFirePropagation(){
    for(let i = 0; i < (fireHeight * fireWidth) - fireWidth; i++){
        let decay = Math.floor(Math.random() * fireDecay)
        let bellowIntensity = firePixelsArray[i + fireWidth]
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
        const cv = document.querySelector("canvas")
        cv.width = fireWidth
        cv.height = fireHeight
        let context = cv.getContext("2d")
        for (let i = 0; i < fireHeight; i++){
            table += "<tr>"
            for(let j = 0; j < fireWidth; j++){
                let index = i * fireWidth + j
                if (debug === true){
                    table += `<td><span>${firePixelsArray[index]}</span ><span class="index">${index}</span></td>`
                }
                else{
                    context.fillStyle = fireColorsPalette[firePixelsArray[index]]
                    context.fillRect(j, i, 1, 1)
                }
            }
            table += "</tr>"
        }
        table += "</table>"
        document.querySelector("#canvasDiv").innerHTML = table
}   

function toggleWind(){
    wind === true?wind = false:wind = true
}


start()