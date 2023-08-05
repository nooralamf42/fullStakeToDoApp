const form = document.querySelector("form");
const emailValidation = document.getElementById("userEmail");
const userPass = document.getElementById("userPass");
const API = "https://todoapi-five.vercel.app/auth/login";
const loader = document.querySelector(".loader");

form.addEventListener("submit", (event)=>{
    event.preventDefault()
    submitForm()
})

if(localStorage.getItem("authToken")){
    window.location.href= "./index.html"
}

const submitForm = () =>{
    loader.classList.remove("d-none")
    let email = document.getElementById("userEmail").value;
    console.log(email)
    const formData = new FormData(form);
    fetch(API, {
        method: "POST",
        body: formData
    })
    .then(response=> response.json())
    .then(data=>{
       if(data.hasOwnProperty("authUser")){
        if(data.hasOwnProperty("authToken")){
            localStorage.setItem("authToken", data.authToken)
            localStorage.setItem("userName", email)
            window.location.href = "./index.html"
        }
        else{
            userPass.classList.add("is-invalid");
            setTimeout(()=>{
                userPass.classList.remove("is-invalid");
            }, 2000)
        }
        loader.classList.add("d-none")
       }
       else{
        emailValidation.classList.add("is-invalid");
        setTimeout(()=>{
            emailValidation.classList.remove("is-invalid");
        }, 2000)
       }
    })
}

