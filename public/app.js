

  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  const soundsRef = db.collection('sounds');

  const storage = firebase.storage();

  soundsRef.onSnapshot( snapshot => {
      let update = snapshot.docChanges();
      console.log(update);
      update.forEach( sound => {
        console.log(sound.doc.data());
        const soundPath = sound.doc.data().soundURL;
        // addToGallery(imgPath);
        console.log(soundPath);
        
        downloadSound(soundPath);
        // waveforms.push( new WaveForm(soundPath));

      })
  })



const drop = document.querySelector('#drop');
const gallery = document.querySelector('#gallery');
let buffers = [];
let soundFileData;
let soundFileDatas = [];
let numBuffers = 0;


//init web audio context
window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.oAudioContext;
const context = new AudioContext();
//master gain node
const master = context.createGain();
master.connect(context.destination);



window.addEventListener('dragover', (e) => {
    e.preventDefault();
})

window.addEventListener('drop', (e) => {
    e.preventDefault();
})

drop.addEventListener('drop', (e) => {
    e.preventDefault();
    const file =  e.dataTransfer.files[0];
    const fileSize = file.size / 1024 / 1024;
    const reader = new FileReader();

    reader.addEventListener('load', (e) => {
        let fileURL = reader.result;
        const metadata = { contentType : file.type};

        uploadFile(file, metadata);
        
        // addToGallery(fileURL);
    })

    if(file){
        if(fileSize > 1){
            alert('file must be smaller than 1 MB');
        } else {
            reader.readAsDataURL(file);
        }
    }
})

function addToGallery(url){
    console.log(url);
    const newGalleryItem = document.createElement('div');
    newGalleryItem.className = 'img-item';
    const imgElement = document.createElement('img');
    imgElement.src = url;
    newGalleryItem.appendChild(imgElement);
    gallery.appendChild(newGalleryItem);
}

function uploadFile(file, metadata){
    const uniqueID = window.crypto.getRandomValues(new Uint32Array(1))[0]
    const filePath = `sounds/${uniqueID}.mp3`;
    storage.ref().child(filePath).put(file, metadata).then((snapshot) => {
        snapshot.ref.getDownloadURL().then(downloadURL => {
            soundsRef.add({soundURL: downloadURL})
        })
    })  
}

function downloadSound(url){
    console.log(url);
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = function(event) {
      const blob = xhr.response;
      console.log(blob);
      loadSound(blob);
    };
    xhr.open('GET', url);
    xhr.send();
}


function loadSound(blob){
    const reader = new FileReader();
    reader.readAsArrayBuffer(blob);
    reader.addEventListener('load', (e) => {
        const array = reader.result;
        context.decodeAudioData(array, (b) => {

            buffers[numBuffers] = b;
            console.log(buffers[numBuffers]);
            console.log(b);
            soundFileData = buffers[numBuffers].getChannelData(0);
            soundFileDatas.push(soundFileData)
            numBuffers++


            // if(soundFileDatas.length < numTracks){
            //     soundFileDatas.push(soundFileData)
            //     numBuffers++
            // }
            
            console.log(buffers);

        },function(){
            console.log('loading failed');
            alert('loading failed');
        });
    })  
    
}