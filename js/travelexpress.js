var currentPage;

function navTo(page = 'home')
{
    switch(page)
    {
        case 'home':
            $("#content").load("home.html");
        break;
    }
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
    navTo("home");
    console.log( "ready!" );
});

/*$(document).click(function(){
    console.log("menu home");
    if(currentPage != 'home')
    {
        navTo('home');
    }
});*/