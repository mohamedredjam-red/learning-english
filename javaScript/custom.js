// AOS
AOS.init({duration:1000, once:true})
const hamburger = document.getElementById("hamburger")
const menu = document.getElementById("menu")
hamburger.onclick = () =>{
    menu.classList.toggle("active")
}