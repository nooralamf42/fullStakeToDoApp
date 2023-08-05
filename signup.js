const form = document.querySelector("form");
const emailValidation = document.getElementById("userEmail");
const API = "https://todoapi-five.vercel.app/auth/signup";
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
    let userName = document.getElementById("userName").value;
    const formData = new FormData(form);
    fetch(API, {
        method: "POST",
        body: formData
    })
    .then(response=> response.json())
    .then(data=>{
        loader.classList.add("d-none")
        try{
            if(data.token.toUpperCase()){
                const token= data.token
                localStorage.setItem("authToken", token)
                window.location.href = "/index.html";
                localStorage.setItem("userName", userName)
            }
        }catch{
            const errorMessage = `${data.error.keyValue.email} already exists!`;
            emailValidation.classList.add("is-invalid")
            setTimeout(()=>{
                emailValidation.classList.remove("is-invalid")
            }, 2500)
            console.log(errorMessage)
        }
    })
}

