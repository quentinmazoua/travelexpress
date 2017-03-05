// PAGE LOAD 

$( document ).ready(function() 
{
    //Test utilisateur // user = new User(1, "a", "b");
    currentPage = Cookies.get('page');
    if(currentPage == undefined)
    {
        navTo("accueil");
    }
    else
    {
        navTo(currentPage);
    }

    if(user == undefined)
    {
        setAccountMenuText("Connexion / Inscription");
    }
    else
    {
        setAccountMenuText("Mon compte");
    }

// EVENTS
    
    // CLICK ACCUEIL
    $("#menu_home").click(function()
    {
        console.log("menu home");
        if(currentPage != 'accueil')
        {
            navTo('accueil');
        }
    });

    // CLICK COMPTE
    $("#menu_account").click(function()
    {
        console.log("menu account");
        if(currentPage != 'account')
        {
            if(user == undefined)
            {
                navTo('connexion');
            }
            else
            {
                navTo('mon compte');
            }
        }
    });

    // CLICK TRAJETS
    $("#menu_trajets").click(function()
    {
        console.log("menu trajets");
        if(currentPage != 'trajets')
        {
            navTo('trajets');
        }
    });

    // CLICK CONTACT
    $("#menu_contact").click(function()
    {
        console.log("menu contact");
        if(currentPage != 'contact')
        {
            navTo('contact');
        }
    });

    $("#content").on("click", "#btngoToInscription", function()
    {
        navTo('inscription');
    });

    $("#content").on("click", "#btnAnnulerInscription", function()
    {
        navTo('connexion');
    });

    $("#content").on("click", "#panelRechercheTitre", function()
    {
        $("#panelRecherche").toggle();
    });
// END EVENTS
});

// END PAGE LOAD

function User(id, prenom, nom)
{
    this.id = id;
    this.prenom = prenom;
    this.nom = nom;
}

var currentPage;
var user;

function navTo(page = 'accueil')
{
    $("#content").load("views/"+page+".html");
    currentPage = page;
    page+=" - TravelExpress";
    document.title = page.charAt(0).toUpperCase()+page.slice(1);
    Cookies.set('page', currentPage);
}

function setAccountMenuText(text)
{
    $("#spanAccount").html(text);

    //$("#spanAccount").css({"top":"0px"});
}

// Affiche une notification
function notification(type, message)
{
	var n = noty({
		layout: 'bottomLeft',
		theme: 'relax',
		text: message,
		type: type,
		animation: {
			open: {height: 'toggle'}, // jQuery animate function property object
			close: {height: 'toggle'}, // jQuery animate function property object
			easing: 'swing', // easing
			speed: 500 // opening & closing animation speed
		}
	});
}