let container = document.getElementById('img-container');

// If the width and height of the image are not known or to adjust the image to the container of it
let options = {
    width: 650,
    height: 650,
    //zoomWidth: 450,
    offset: {vertical: 80, horizontal: 5},
    fillContainer: true,
    scale: .68
};

//window.imageZoom = new ImageZoom(container, options)

gallery = (img) => {
    options.img = img.src;
    document.getElementById('prim-image').src = img.src
    // window.imageZoom.kill();
    // window.imageZoom = new ImageZoom(container, options);
} 

addOptions = (num) => {
    let sel = document.getElementById('quantity')
    //console.log(sel);
    
    for (let i = 1; i < num; i++) {
        let element = document.createElement('option')
        element.text = i+1
        element.value = i+1
        sel.add(element)  
    }
}