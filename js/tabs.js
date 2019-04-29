let tabs = Array.from(document.getElementById("tabs").children);
let buttons = Array.from(document.getElementById("buttons").children);

for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", function(){

        for (let i = 0; i < tabs.length; i++) {
            tabs[i].classList.remove("active");
            buttons[i].classList.remove("active");
        }
        
        tabs[i].classList.add("active");
        buttons[i].classList.add("active");
    });
}