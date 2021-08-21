//selecting all required elements
const dropArea = document.querySelector(".drag-area"),
dragText = dropArea.querySelector("header"),
button = document.querySelector("#button"),
input = dropArea.querySelector("input");
const Name = document.querySelector(".name")
let file; //this is a global variable and we'll use it inside multiple functions
let file_event;

button.onclick = ()=>{
  input.click(); //if user click on the button then the input also clicked
}

input.addEventListener("change", event =>{
  //getting user select file and [0] this means if user select multiple files then we'll select only the first one
  //  handleImageUpload(event)
  file_event=event;
  file = input.files[0];
  dropArea.classList.add("active");
  showFile(); //calling function
});


// //If user Drag File Over DropArea
// dropArea.addEventListener("dragover", event=>{
//   event.preventDefault(); //preventing from default behaviour
//   dropArea.classList.add("active");
//   dragText.textContent = "Release to Upload File";
// });

// //If user leave dragged File from DropArea
// dropArea.addEventListener("dragleave", ()=>{
//   dropArea.classList.remove("active");
//   dragText.textContent = "Drag & Drop to Upload File";
// });

// //If user drop File on DropArea
// dropArea.addEventListener("drop", event =>{
//   event.preventDefault(); //preventing from default behaviour
//   // handleImageUpload(event);
//   //getting user select file and [0] this means if user select multiple files then we'll select only the first one
//   file = event.dataTransfer.files[0];
//   showFile(); //calling function
// });



function showFile(){
  let fileType = file.type; //getting selected file type
  let validExtensions = ["text/csv"]; //adding some valid image extensions in array
  if(validExtensions.includes(fileType)){ //if user selected file is an image file
    let fileReader = new FileReader(); //creating new FileReader object
    fileReader.onload = ()=>{
      let fileURL = fileReader.result; //passing user file source in fileURL variable
      let imgTag = `<input value="${file.name}" alt=""/>`; //creating an img tag and passing user selected file source inside src attribute
      Name.innerHTML = imgTag; //adding that created img tag inside dropArea container
    }
    fileReader.readAsDataURL(file);
    

// This will upload the file after having read it

  }else{
    alert("This is not a CSV File!");
    dropArea.classList.remove("active");
    dragText.textContent = "Drag & Drop to Upload File";
  }
}


document.getElementById("sendbutton").onclick=()=>{
  handleImageUpload(file_event)
}





const handleImageUpload = event => {
  const files = event.target.files
  const formData = new FormData()
  formData.append('file', files[0])

  fetch('http://localhost:3000/csvtojson', {
    method: 'POST',
    body: formData
  })
  .then(response => {
    return response.json().then((data) => {
      var jsonObj = {};
for (var i = 0 ; i < data.length; i++) {
    jsonObj["position" + (i+1)] = data[i];
}
      console.log(data);
      localStorage.setItem('user', JSON.stringify(data));
      window.location.assign("table.html")


  }).catch((err) => {
      console.log(err);
  });
  })
  .catch(error => {
    console.error(error)
  })
}



/////////////////////////////////////////////////////



