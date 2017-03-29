// FOOTER

$( window ).resize(function() 
{
    setFooterHeight();
});

function setFooterHeight()
{
    var winHeight = $(window).innerHeight();
    var contentHeight = $('#menu').outerHeight() + $('#content').outerHeight() + $('#footer').outerHeight();

    if(winHeight > contentHeight)
    {
        $('#footer').css('position','absolute');
        $('#footer').css('bottom','0');
    }
    else 
    {
        $('#footer').css('position','relative');
    }
}

// PAGE LOAD 

$( document ).ready(function() 
{
    //Test utilisateur // user = new User(1, "a", "b");
    var userJSON = localStorage.getItem('travelexpress_user');
    if(userJSON != 'undefined')
    {
        user = JSON.parse(userJSON);
    }
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

    setFooterHeight();

// EVENTS
    
    // CLICK ACCUEIL
    $("#menu_home").click(function()
    {
        if(currentPage != 'accueil')
        {
            navTo('accueil');
        }
    });

    // CLICK COMPTE
    $("#menu_account").click(function()
    {
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
        if(currentPage != 'trajets')
        {
            navTo('trajets');
        }
    });

    // CLICK CONTACT
    $("#menu_contact").click(function()
    {
        if(currentPage != 'contact')
        {
            navTo('contact');
        }
    });

    $("#content").on("click", "#btnConnexion", function()
    {
        var inputmail = $("#inputMail").val();
        var inputpass = $("#inputPassword").val();

        if(inputmail != "" && inputpass != "")
        {
            $.post('users_db', { user_action: 'connexion', mail: inputmail, password : inputpass }, function (data)
            {
                //TODO script de connexion php qui retourne le prenom et le nom de la personne si le compte existe dans la db
                console.log(data);
                if(data != "false")
                {
                    user = JSON.parse(data);
                    localStorage.setItem('travelexpress_user', data);
                    notification('success', "Connexion réussie, "+user.prenom);
                    setAccountMenuText("Mon compte");
                    navTo('accueil');
                    
                    /*while(!$("#prenomUtilisateur").length)
                    {

                    }*/
                    $("#prenomUtilisateur").html = user.prenom;
                }
                else
                {
                    notification('error', "La connexion a échoué");
                    $("#inputMail").val("");
                    $("#inputPassword").val("");
                }
             });
        }
        else
        {
            notification('error', "Tous les champs doivent être remplis");
        }
    });

    $("#content").on("click", "#btnInscription", function()
    {
        var inputprenom, inputnom, inputmail, inputtel, inputpass;
        inputprenom = $("#inputPrenomInsc").val();
        inputnom = $("#inputNomInsc").val();
        inputmail = $("#inputMailInsc").val();
        inputtel = $("#inputTelInsc").val();
        inputpass = $("#inputPasswordInsc").val();

        if(inputprenom == "" || inputnom == "" | inputmail == "" || inputtel == "" || inputpass == "")
        {
            notification('error', "Tous les champs doivent être remplis");
        }
        else
        {
            $.post('users_db', { user_action: 'inscription', prenom: inputprenom, nom: inputnom, mail: inputmail, tel:inputtel, pass : inputpass }, function (data)
            {
                
                console.log(data);
                if(data != "false")
                {
                    if(data == "mailTaken")
                    {
                        $("#inputMailInsc").val("");
                        notification('error', "Cette adresse mail est déjà utilisée");
                    }
                    else
                    {
                        notification('success', "Inscription réussie, bienvenue "+inputprenom);
                        navTo('accueil');
                    }
                    $("#prenomUtilisateur").html = inputprenom;
                }
                else
                {
                    notification('error', "L'inscription a échoué, veuillez réessayer plus tard");
                    $("#inputPrenomInsc").val("");
                    $("#inputNomInsc").val("");
                    $("#inputMailInsc").val("");
                    $("#inputTelInsc").val("");
                    $("#inputPasswordInsc").val("");
                }
             });
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

    $("#content").on("click", "#panelAjoutTrajetTitre", function()
    {
        $("#panelAjoutTrajetContent").toggle();
    });

    $("#content").on("click", "#panelRechercheTitre", function()
    {
        $("#panelRecherche").toggle();
    });

    $("#content").on("click", "#btnDeconnexion", function()
    {
        user = undefined;
        localStorage.removeItem("travelexpress_user");
        setAccountMenuText("Connexion / Inscription");
        navTo('accueil');
    });

    $("#content").on("keypress", "#inputPassword", function(e)
    {
        if(e.which == 13)
        {
            $("#btnConnexion").click();
            return false;
        }
    });

    $("#content").on("keypress", "#inputPasswordInsc", function(e)
    {
        if(e.which == 13)
        {
            $("#btnInscription").click();
            return false;
        }
    });
// END EVENTS
});

// END PAGE LOAD

function User(id, prenom, nom, mail, telephone)
{
    this.id = id;
    this.nom = nom;
    this.prenom = prenom;
    this.mail = mail;
    this.telephone = telephone;
}

var currentPage;
var user;

function navTo(page = 'accueil')
{
    $("#content").load(page.replace(" ", "-"));
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