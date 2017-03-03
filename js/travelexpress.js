var currentPage;

function navTo(page = 'home')
{
    $("#content").load(page+".html");
}

$("#menu_home").click(function(){
    console.log("menu home");
    if(currentPage != 'home')
    {
        navTo('home');
        currentPage = 'home';
    }
});

$( document ).ready(function() {
    if(currentPage == undefined)
    {
        navTo("home");
    }
    console.log("ready!");
});