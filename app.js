const drop = document.querySelector('#drop');
const gallery = document.querySelector('#gallery');

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
        addToGallery(fileURL);
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