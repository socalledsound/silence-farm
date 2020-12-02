const CANVASWIDTH = 1000;
const CANVASHEIGHT = 800;
const numTracks = 8;

const TRACKHEIGHT = CANVASHEIGHT/numTracks;

const tracks = Array.from({length: numTracks});
const colors = Array.from({ length: numTracks}, (item) => {
    return ({
        r: Math.floor(Math.random()*255),
        g: Math.floor(Math.random()*255),
        b: Math.floor(Math.random()*255),
        a: 200,
    })
})
const fadeVals = Array.from({ length: numTracks}, (item) => 190);

const trackOffsets = Array.from({ length: numTracks }, (item) => Math.random() * (CANVASHEIGHT - (TRACKHEIGHT * 6)) + 100);

//settings defaults, later add knobs
let attack = 0.40;
let release = 0.40;
let density = 1.0;
let spread = 1.2;
let reverb = 0.5;
let pan = 0.1;
let trans = 1.25;


let pauses1 = [250, 250, 250, 125, 1000];
let pauses1Mapped = pauses1.map(pause => pause * 10);
let pauseCount1 = 0;

let pauses2 = [100, 100, 100, 250];
let pauses2Mapped = pauses2.map(pause => pause * 50);
let pauseCount2 = 0;

const voices = [];
const grains = [];
let voiceTracks = Array.from({length: numTracks});
voiceTracks.forEach((track, i) => {
    voiceTracks[i] = [];
});
// console.log(voiceTracks);

let grainDensity = 50, randomGrains = 50, grainCount = 0;



// console.log(pauses1, pauses2);
createSequentialGrain(pauses1Mapped, pauseCount1, 0, 0.6);


createSequentialGrain(pauses2Mapped, pauseCount2, 1, 1.5);

createSequentialGrain(pauses1Mapped, pauseCount1, 2, 0.8);

createSequentialGrain(pauses2Mapped, pauseCount2, 3, 1.2);

createSequentialGrain(pauses2Mapped, pauseCount2, 4, 0.9);

createSequentialGrain(ppauses2Mapped, pauseCount2, 5, 1.6);




function setup(){
    createCanvas(CANVASWIDTH, CANVASHEIGHT);
    background(0);
}

function draw(){
   
    background(0);
    if(soundFileData){
        soundFileDatas.forEach((soundFileData, i) =>{
            drawWaveform(soundFileData, i, trackOffsets[i]);
        })
       
    } else {
        drawPlaceholders();
    }

    voiceTracks.forEach((track, i) => {
        if(track.length  > 0){
            track.forEach((voice) => {
                voice.grains.forEach(grain => {
                    grain.checkLife(millis());
                    // console.log(grain.alive);
                    if(grain.alive){
                        grain.display(i);
                    } else {
                        voice.grains.splice(grain.num,1);
                    }    
                })
            })
        }
    })


}



function createSequentialGrain(pauseArray, count, bufnum, rate){
    if(soundFileDatas[bufnum]){
        // console.log(bufnum);
        let v = new Voice(random(200), bufnum, attack, release, spread, density);
        v.addGrain(random(50, width-50), random(0, height), rate);
        voiceTracks[bufnum].push(v);
        
        count++
    }
    // console.log(pauseArray, count)
        setTimeout(() => createSequentialGrain(pauseArray, count, bufnum, rate), pauseArray[count % pauseArray.length])
}



function createRandomGrain(){
    // grainDensity = Math.floor(Math.random() * randomGrains + grainDensity);
  
    if(soundFileData){
    let v = new Voice(random(200), bufnum, attack, release, spread, density);
    v.addGrain(random(0, width), random(0, height));
    // grainCount++
    voices.push(v);
    }
}



function mousePressed(){
    grainDensity = Math.floor(Math.random() * randomGrains + grainDensity);
    let v = new Voice(random(200), bufnum, attack, release, spread, density);
    v.addGrain(mouseX, mouseY);
    grainCount++
    voices.push(v);
    const interval = random(100);
    // setTimeout( () => addGrain(v), interval);
}

function addGrain(v){
    v.addGrain(mouseX, mouseY);
    if(grainCount < grainDensity){
        const interval = random(100);
        setTimeout( () => addGrain(v), interval);
    }
}


function drawWaveform(soundFileData, trackNumber, trackOffset){
    const step = Math.ceil( soundFileData.length / width );
    // const trackOffset = TRACKHEIGHT * trackNumber;
    // const trackOffset = random(0, CANVASHEIGHT-TRACKHEIGHT);
    const amp = (TRACKHEIGHT); // 200
    let thisColor = [colors[trackNumber].r, colors[trackNumber].g, colors[trackNumber].b, colors[trackNumber].a - fadeVals[trackNumber]];
    
    stroke(thisColor);

    for( var i=0; i < width; i++ ){
        var min = 1.0;
        var max = -1.0;
     
        for( j=0; j < step; j++) {
            
            var datum = soundFileData[(i * step) + j]; 

            if (datum < min){
                min = datum;
            }else if(datum > max){
                max = datum;
            }
                       
        }
       

        // i = 0 ...1000;
        //amp = 200
        //1 + min 
        strokeWeight(1);
        fill(0);
        rect(i, ((1 + min ) * amp) + trackOffset, 1, (Math.max(1, (max-min) * amp )));
        // ellipse(i, (1+min)*amp, 1, Math.max(1,(max-min)*amp))
    }
}

function drawPlaceholders(){
    tracks.forEach((track, i) => {
        
        stroke(255);
        text(`track ${i+1}`, 20, (i+1) * TRACKHEIGHT - TRACKHEIGHT * 0.75);
        line(0, (i+1) * TRACKHEIGHT, CANVASWIDTH, (i+1) * TRACKHEIGHT);
    })
    
}