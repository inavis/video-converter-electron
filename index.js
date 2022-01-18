//import electron
var app = require('electron').app
const ipc = require('electron').ipcMain;

//to find os of device
const os = require('os');

//import dialog
const {dialog} = require('electron');

//to create window in  application 
var BrowserWindow = require('electron').BrowserWindow

//creating main window which is initially null
var mainWindow = null;

console.log("main.js executed")

//initialize main window when app is ready
app.on('ready',function(){
    mainWindow = new BrowserWindow({
        resizable : false,
        height:600,
        width:800,
        webPreferences:{
            nodeIntegration:true, // to use  node modules within application
            contextIsolation: false,
            enableRemoteModule: true,
        }
    })

    //main.html will be loaded in desktop application
    //get file using file protocol
    mainWindow.loadURL("file://" + __dirname + '/main.html')

    //once main window is closed need to release memory
    mainWindow.on('closed',function(){
        mainWindow=null;
    })
})


//listening to event from renderer
ipc.on("choose-file-dialog-box",function(event){
    console.log("button is clicked");

    //we need find os before opening file diaalog box
    if(os.platform() === "linux" || os.platform()==="win32"){
        dialog.showOpenDialog(null,{
            properties:['openFile'] //returns promise
        }).then((result)=>{
            console.log(result.filePaths)// array of filepaths

            //send this to renderer
            event.sender.send("selected-file",result.filePaths[0])//selecting one file only
        }).catch((err)=>{
            console.log(err)
        })
    }
    //for other os
    else{
        dialog.showOpenDialog(null,{
            properties:['openFile','openDirectory'] //here we can open directory also
        }).then((result)=>{
            console.log(result.filePaths)// array of filepaths

            //send this to renderer
            event.sender.send("selected-file",result.filePaths[0])//selecting one file only
        }).catch((err)=>{
            console.log(err)
        })
    }   
})
