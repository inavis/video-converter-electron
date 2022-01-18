//ELECTRON HAS 2 process - MAIN, RENDERER
//through ipc communicate between both

const ipc = require('electron').ipcRenderer
const fs = require('fs');
const randomString = require("random-string");

//to run file conversion command using cmd
const process = require('child_process');

const button = document.getElementById("upload");
const info = document.getElementById("info");
const container = document.getElementById("container");

//format to convert video
var format = "m3u8";

//directory to store converted files
var dir = "./media";
//need to create directory if it doesnot exist using fs
if(!fs.existsSync(dir)){
    fs.mkdirSync(dir)
}

var pathoffile="";

//send to main process once button is clicked need to open file explorer
button.addEventListener('click',function(event){
    ipc.send("choose-file-dialog-box")
    console.log("button clicked");
})


//getting response from main process
ipc.on("selected-file",function(event,paths){
    console.log(event,paths,paths.toLowerCase().includes(".mp4"));
    console.log(randomString)

    pathoffile=paths;

    //checks if file format is .mp4
    if(paths.toLowerCase().includes(".mp4")){

        //to remove any previous error message
        info.innerHTML="";

    container.innerHTML=`
    <br><br>
        <div class="text-center">
            <div class="text-white">The file <b><i>${paths}</i></b> is chosen to convert.</div>
        </div>
            <br><br>
        <div class="text-center flex">
            <div>
                <button id="convert" class="button2" onclick="convert()">Convert</button>
            </div>
            <div>
                <button id="convert" class="button2" onclick="choose()">Choose another file</button>
            </div>
        </div>
    `
        // convert(paths);
    
    }else{
        info.innerHTML=`
        <br><br>
        <div class="error-message">
            ERROR: choose only .mp4 format files
        </div>
        <br><br>
    `
    }

})

function choose(){
    ipc.send("choose-file-dialog-box")
}

function convert(){
    //display message in application
    console.log("paths",pathoffile)
    container.innerHTML=`
    <br><br>
    <div class="text-white text-center">
      Conversion of  <b><i>${pathoffile}</i></b> may take some time.<br> Please wait ....
    </div>
    <br><br>
    <div class="text-center">
        <div class="loader"></div>
    </div>
`

// Ex: ffmpeg -i "C:\\Users\\SK\\Desktop\\wedding teaser.MP4" output2.m3u8

//execute conversion using ffmpeg
process.exec(`ffmpeg -i "${pathoffile}" media/${randomString()}_video.${format}`,
    function(error,stdout,stderr){
        console.log(stdout)
        if(error!==null){console.log(error)}
        //display message in application and button again
        container.innerHTML=`
        <br><br>
        <div class="text-center">
            <div class="text-white">
                Conversion of file <b><i>${pathoffile}</i></b> completed successfully.
                <br>
                Files are downloaded in <b><i>video-converter-mp4-hls-win32-x64/media</i></b> folder
            </div>
            <br><br>
            <div>
                    <button id="convert" class="button2" onclick="choose()">Choose another file to convert</button>
            </div>
        </div>
        <br><br>
    `

    //Sending system/Desktop Notification once completed
    Notification.requestPermission().then(function(result){
        var notification = new Notification("Conversion Completed",{
            body:"File converted successfully from .mp4 to hls(.m3u8)"
        });

    })
    })
}