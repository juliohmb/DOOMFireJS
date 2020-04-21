const firePixelsArray = []
const examplePaletteStr = "#00ffff, #00f7ff, #00eeff, #00e5ff, #00ddff, #00d5ff, #00ccff, #00c3ff, #00bbff, #00b3ff, #00aaff, #00a2ff, #0099ff, #0091ff, #0088ff, #0080ff, #0077ff, #006eff, #0066ff, #005eff, #0055ff, #004cff, #0044ff, #003cff, #0033ff, #002aff, #0022ff, #001aff, #0011ff, #0008ff, #0000ff, #0000c4, #0000a3, #00008c, #000059, #000000"
const originaColorPalette = ["#070707", "#1f0707", "#2f0f07", "#470f07", "#571707", "#671f07", "#771f07", "#8f2707", "#9f2f07", "#af3f07", "#bf4707", "#c74707", "#df4f07", "#df5707", "#df5707", "#d75f07", "#d75f07", "#d7670f", "#cf6f0f", "#cf770f", "#cf7f0f", "#cf8717", "#c78717", "#c78f17", "#c7971f", "#bf9f1f", "#bf9f1f", "#bfa727", "#bfa727", "#bfaf2f", "#b7af2f", "#b7b72f", "#b7b737", "#cfcf6f", "#dfdf9f", "#efefc7", "#ffffff"]
var fireColorsPalette = originaColorPalette
var interval
var stopInterval
var running = true

// configuration
const fireWidth = 45
const fireHeight = 45
const fireDecay = 3
const debug = false
var wind = true
// ---

// evt listeners
document.querySelector("#start").addEventListener("click", start)
document.querySelector("#stop").addEventListener("click", stop)
document.querySelector("#continue").addEventListener("click", play)
document.querySelector("input[type=range]").addEventListener("input", handleRange)
document.querySelector("#pause").addEventListener("click", pause)
document.querySelector("#frameFoward").addEventListener("click", calculateFirePropagation)
document.querySelector("#minIntensity").addEventListener("click", () => {setSource(0)})
document.querySelector("#maxIntensity").addEventListener("click", () => {setSource()})
document.querySelector("#toggleWind").addEventListener("click", toggleWind)
document.querySelector("#setPalette").addEventListener("click", setPalette)
document.querySelector("#examplePalette").addEventListener("click", examplePalette)
// ---

function start(){
    createFireDataStructure()
    setSource()
    render()
    if(interval == null){
        interval = setInterval(calculateFirePropagation, 50)
    }
    running = true
}

function stop(){
    stopInterval = setInterval(() => {
        const bottonPixel = firePixelsArray[fireWidth * fireHeight - 1]
        if (bottonPixel > 0){
            setSource(bottonPixel - 1)
        }
        else if(bottonPixel == 0){
            clearInterval(stopInterval)
            stopInterval = null
        }
    }, 50)
}

function play(){
    if(running === false){
        running = true
        calculateFirePropagation()
        interval = setInterval(calculateFirePropagation, 50)
    }
}

function handleRange(evt){
    setSource(evt.target.value)
}

function pause(){
    if(running === true){
        running = false
        clearInterval(interval)
        interval = null
    }
}

function setSource(intensity = 36){
    document.querySelector("input[type=range]").value = intensity
    const startIndexSource = (fireHeight * fireWidth) - fireWidth
    const endIndexSource = (fireHeight * fireWidth)
    for(let i = startIndexSource; i < endIndexSource; i++){
        firePixelsArray[i] = intensity
    }
}

function createFireDataStructure(){
    const numberOfPixels = fireWidth * fireHeight
    for (let i = 0; i < numberOfPixels; i++){
        firePixelsArray[i] = 0
    }
}

function toggleWind(){
    wind === true?wind = false:wind = true
}

function setPalette(){
    let paletteStr = document.querySelector("textarea").value
    let palette = paletteStr.split(",")
    if (palette.length == 36){
        palette = palette.map(i => {
            i = i.trim()
            return i
        })
        fireColorsPalette = palette.reverse()
    }else{
        if(paletteStr == ""){
            fireColorsPalette = originaColorPalette
        }else{
            alert("The palette MUST contain 36 colors!")
        }
    }
}

function examplePalette(){
    document.querySelector("textarea").value = examplePaletteStr
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

start()