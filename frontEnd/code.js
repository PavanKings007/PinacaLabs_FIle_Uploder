const form = document.querySelector('form');
const inputUpload = form.querySelector('.inputUpload');
const fileName = form.querySelector('p');
const conformName = document.querySelector('h4');
const upload = document.querySelector('button');
const buttonDiv = document.getElementById('button');
const svg = document.getElementById('cloudColor');
const sub = document.getElementById('sub');
const fileUploadDone = document.getElementById('fileUploadDone');
const mainContainer = document.getElementById('mainContainer');
const cloudColor = document.getElementById('cloudColor');
const slider = document.getElementById('slider');
const left = document.getElementById('left');
const massage = document.getElementById('massage');
const arrow = document.getElementById('arrow');

left.addEventListener('mouseover',()=>{
    massage.style.opacity = "1"
})
left.addEventListener('mouseleave',()=>{
    massage.style.opacity = ""
})

function slide(){
    
    arrow.style.transform = "rotateY(180deg)";

    const scrollDistance = 1200; // Adjust this value as needed

    // Calculate the new scrollLeft value
    const newScrollLeft = slider.scrollLeft + scrollDistance;

    // Scroll the slider to the new position
    slider.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth' // You can use 'auto' for instant scrolling
    });
}
function slideInvert(){
    arrow.style.transform = "rotateY(0deg)";

    const scrollDistance = 1200; // Adjust this value as needed

    // Calculate the new scrollLeft value
    const newScrollLeft = slider.scrollLeft - scrollDistance;

    // Scroll the slider to the new position
    slider.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth' // You can use 'auto' for instant scrolling
    });
}
let count = 0;
left.addEventListener('click',()=>{
    metaDataFileName.innerHTML = '---';
        metaDataFileSize.innerHTML = '---';
        metaDataFileFormate.innerHTML = '---';
        metaDataFileDate.innerHTML = '---';
        metaDataFilePath.innerHTML = '---';
        searchInput.value = '';
        resetForm();
        if(count == 0){
            slide();
        massage.innerHTML = "Upload...";
        count++;
    }
    else{
        slideInvert();
        massage.innerHTML = "Search...";
        count--;
    }

})

let fileData;

let mainContainerAfter = window.getComputedStyle(mainContainer,'::after'); 
let mainContainerBefore = window.getComputedStyle(mainContainer,'::before'); 

let userDetails = new Object();

form.addEventListener('click',()=>{
    inputUpload.click();
})
inputUpload.addEventListener('change',(e)=>{
    const date = new Date();
    const fullDate = date.getDate().toString()+"/"+date.getMonth().toString()+"/"+date.getFullYear().toString();
    const file = e.target.files[0];
fileData = file;
    fileName.innerHTML = file.name;
    fileName.style.color = '#cbe3f8';
    cloudColor.style.fill = "#cbe3f8";
    svg.style.fillOpacity = 1;
    form.addEventListener('mouseout',()=>{
        svg.style.fillOpacity = '1';
    })
    conformName.innerHTML = file.name;
    fileUploadDone.style.display = "flex";
    buttonDiv.style.justifyContent = 'space-between';
    const size = file.size.toString()

    const fileSize = dataConvert(size)
    userDetails = {
        filename:file.name,
        filesize:fileSize,
        uploadtimestrap:fullDate,
        fileformate:file.type.split('/')[1],
    }
    upload.removeAttribute('disabled')
    upload.style.cursor = 'pointer';
    upload.style.backgroundColor = '#0658fb';
    upload.style.color = '#f5f5f5';
})

form.addEventListener('mouseover',()=>{
    svg.style.fillOpacity = 0.4;
})
form.addEventListener('mouseout',()=>{
    svg.style.fillOpacity = '0.2';
})

function dataConvert(s){
const len = s.length;
let str = "";
if(len>=0 && len <7){
    str = s/1024;
    str = str.toString();
    str = str.substring(0,4);
    str += " kb";
}
if(len==7 && len <10){
    str = s/(1024*1024);
    str = str.toString();
    str = str.substring(0,4);
    str += " mb";

}
if(len>=10){
    str = s/(1024*1024*1024);
    str = str.toString();
    str = str.substring(0,4);
    str += " gb";

}
return str;
}
let metaDataFileName = document.getElementById('metaDataFileName');
let metaDataFileSize = document.getElementById('metaDataFileSize');
let metaDataFileFormate = document.getElementById('metaDataFileFormate');
let metaDataFileDate = document.getElementById('metaDataFileDate');
let metaDataFilePath = document.getElementById('metaDataFilePath');

function sendData(){
    // let formData = new FormData();
    // formData.append('uploadFileData', fileData);
    // formData.append('user', new Blob([JSON.stringify(userDetails)], { type: 'application/json' }));

    document.documentElement.style.setProperty("--afterDisplay", "block");


    fetch('http://localhost:8800/data',{
        method:'POST',
        headers:{
            "Content-Type":"application/json",
        },
        body:JSON.stringify(userDetails)
       
        
    }).then((response)=>{
        
        return response.json();
    }).then((data)=>{
    
        resetForm();

        metaDataFileName.innerHTML = data.metaData.filename;
        metaDataFileSize.innerHTML = data.metaData.filesize;
        metaDataFileFormate.innerHTML = data.metaData.fileformate;
        metaDataFileDate.innerHTML = data.metaData.uploadtimestrap;
        metaDataFilePath.innerHTML = data.metaData.path;
    }).catch((error)=>{
        alert(error);
    })
}


const searchInput = document.getElementById('searchInput');
function searchData(){
    const errorNoti = document.getElementById('errorNoti');


    const fileName = {
        'filename':searchInput.value
    }
    fetch('http://localhost:8800/search',{
        method:'POST',
        headers:{
            "Content-Type":"application/json",
        },
        body:JSON.stringify(fileName)
    }).then((response)=>{
        if(response.ok){
            return response.json();
        }
        else{
            return response.json();
        }
    }).then((data)=>{
        if(Object.keys(data)[0] === "error"){
                errorNoti.style.opacity = "1";

                setTimeout(() => {
                    errorNoti.style.opacity = "";
                  }, 2000);

                  slideInvert();
        massage.innerHTML = "Search...";
        count = 0;
        searchInput.value = '';
        }
        else{
            metaDataFileName.innerHTML = data.filename;
        metaDataFileSize.innerHTML = data.filesize;
        metaDataFileFormate.innerHTML = data.fileformate;
        metaDataFileDate.innerHTML = data.uploadtimestrap;
        metaDataFilePath.innerHTML = data.path;
        }
    }).catch((error)=>{
        alert(error);
    })

}

function handleSearchInput(event) {
    if (event.keyCode === 13) {
        document.getElementById("searchButton").click();
    }
  }

  function resetForm(){
    form.reset();
    fileName.style.color = '';
    cloudColor.style.fill = "";
    fileName.innerHTML = 'Select a File';
    upload.setAttribute('disabled', 'disabled');
    upload.style.cursor = '';
    cloudColor.style.fill = '';
    svg.style.fillOpacity = 0.2;
    form.addEventListener('mouseout',()=>{
        svg.style.fillOpacity = '0.2';
    })
    upload.style.backgroundColor = '';
    fileUploadDone.style.display = "";
    buttonDiv.style.justifyContent = '';
    userDetails = new Object(); 
    document.documentElement.style.setProperty("--afterDisplay", "none");
  }