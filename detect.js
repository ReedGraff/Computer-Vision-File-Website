dragOver.ondragover = dragOver.ondragenter = function(evt) {
    evt.preventDefault();
};
  
dragOver.ondrop = function(evt) {
    // pretty simple -- but not for IE :(
    fileUpload.files = evt.dataTransfer.files;
    
    // If you want to use some of the dropped files
    const dT = new DataTransfer();
    dT.items.add(evt.dataTransfer.files[0]);
    fileUpload.files = dT.files;

    evt.preventDefault();

    document.getElementById("file_text").innerText = "File " + document.getElementById("fileUpload").value + " successfully uploaded";

    preview();
};




function preview() {
    // Get and save image
    const file = document.querySelector('#fileUpload').files[0];
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        localStorage.setItem("image", reader.result);
        document.getElementById("imagePreview").setAttribute("src", localStorage.getItem("image"))
    };
}

async function MLDetection() {
    document.getElementById("canvas_out").innerHTML = "";
    
    const MODEL_URL = "AI/models";
    
    await faceapi.loadSsdMobilenetv1Model(MODEL_URL);
    await faceapi.loadFaceLandmarkModel(MODEL_URL);
    await faceapi.loadFaceRecognitionModel(MODEL_URL);
    
    const file = document.querySelector('#imagePreview');
    const canvas = faceapi.createCanvasFromMedia(file);
    console.log(canvas);
    canvas.id = "final_canvas";

    document.getElementById("canvas_out").appendChild(canvas);

    let fullFaceDescriptions = await faceapi.detectAllFaces(file).withFaceLandmarks().withFaceDescriptors();
    faceapi.draw.drawDetections(canvas, fullFaceDescriptions);
}

function SaveCanvas() {
    var canvas = document.getElementById("final_canvas");
    var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");

    window.location.href=image; // it will save locally
}