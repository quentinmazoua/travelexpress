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

    // CLICK CONNEXION
    $("#content").on("click", "#btnConnexion", function()
    {
        var inputmail = $("#inputMail").val();
        var inputpass = $("#inputPassword").val();

        if(inputmail != "" && inputpass != "")
        {
            $.post('users_db', { user_action: 'connexion', mail: inputmail, password : inputpass }, function (data)
            {
                if(data != "false")
                {
                    user = JSON.parse(data);
                    localStorage.setItem('travelexpress_user', data);
                    notification('success', "Connexion réussie, "+user.prenom);
                    setAccountMenuText("Mon compte");
                    navTo('accueil');
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

    // CLICK BOUTON INSCRIPTION
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

    $("#content").on("click", "#panelMesResTitre", function()
    {
        $("#panelMesRes").toggle();
    });

    $("#content").on("click", "#panelMesTrajTitre", function()
    {
        $("#panelMesTraj").toggle();
    });

    $("#content").on("click", "#panelAnnulationsTitre", function()
    {
        $("#panelAnnulations").toggle();
    });

    $("#content").on("click", "#btnPreferences", function()
    {
        var modalPrefs = $('[data-remodal-id=modal]').remodal();
        modalPrefs.open();

        $("#listePrefs").remove();
        $("#modalDesc").append("<table id=listePrefs style='margin:auto'>");
        for(var i in user.preferences)
        {
            $("#listePrefs").append("<tr id=pref_"+i+" style='height:50px'>");
            $("#pref_"+i).append("<input type=text value='"+user.preferences[i]+"'>&nbsp;<button type='button' class='btn btn-danger btnSupprPref'><span class='glyphicon glyphicon-trash'></span></button>");
        }
    });

    $("body").on("click", "#btnAjouterPref", function()
    {
        var i = $("#listePrefs tr").length;
        if(i < 10)
        {
            $("#listePrefs").append("<tr id=pref_"+i+" style='height:50px'>");
            $("#pref_"+i).append("<input type=text>&nbsp;<button type='button' class='btn btn-danger btnSupprPref'><span class='glyphicon glyphicon-trash'></span></button>");
        }
    });

    $("body").on("click", "#btnEnregistrerPrefs", function()
    {
        user.preferences = [];
        for(var i = 0; i < $("#listePrefs tr").length; i++)
        {
            user.preferences.push($("#pref_"+i).children("input").val());
        }

        $.post('users_db', { user_action: 'maj_preferences', id:user.id, prefs:user.preferences.join(",") }, function (data)
        {
            if(data == "OK")
            {
                notification('success', 'Vos préférences ont bien été mises à jour');
            }
            else
            {
                notification('error', "Une erreur s'est produite, veuillez réessayer plus tard");
            }
        });
    });

    $("body").on("click", ".btnSupprPref", function()
    {
        $(this).parent().remove();
    });

    $("#content").on("click", "#btnDeconnexion", function()
    {
        user = undefined;
        localStorage.removeItem("travelexpress_user");
        setAccountMenuText("Connexion / Inscription");
        navTo('accueil');
    });

    $("#content").on("click", "#btnSupprCompte", function()
    {
        if(window.confirm("Êtes-vous sûr de vouloir supprimer votre compte ? (Cette action est irréversible)"))
        {
            $.post('users_db', { user_action: 'supprimer', id:user.id }, function (data)
            {
                $("#btnDeconnexion").click();
            });
        }
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

    // CLICK AJOUT TRAJETS
    $("#content").on("click", "#btnAjouterTrajet", function()
    {
        var inputVilleDep = $("#villeDepartAjout").val();
        var inputVilleDest = $("#villeDestinationAjout").val();
        var inputPlaces = $("#placesAjout").val();
        var inputDate = $("#dateTrajetAjout").val();
        var inputHeure = $("#heureTrajet").val()+":00";
        var inputFrequence = $('input[name=radioFrequence]:checked').val();

        console.log(inputVilleDep+" "+inputVilleDest+" "+inputPlaces+" "+inputDate+" "+inputHeure+" "+inputFrequence);

        $.post('trajets_db', { user_action: 'ajout',  conducteur:user.id, villeDep:inputVilleDep, villeDest:inputVilleDest, places:inputPlaces, date:inputDate, heure:inputHeure, frequence:inputFrequence }, function (data)
        {
            console.log(data);
            if(data == "OK")
            {
                notification('success', "Votre trajet a été publié avec succès");
                $("#villeDepartAjout").val("");
                $("#villeDestinationAjout").val("");
                $("#placesAjout").val("");
                $("#dateTrajetAjout").val("");
                $("#heureTrajet").val("");
            }
            else
            {
                notification('error', "Une erreur est survenue, veuillez réessayer plus tard");
            }
        });
    });

    // CLICK RECHERCHER TRAJETS
    $("#content").on("click", "#btnRechercherTrajets", function()
    {
        var inputVilleDep = $("#villeDepartRecherche").val();
        var inputVilleDest = $("#villeDestinationRecherche").val();
        var inputPlaces = $("#placesRecherche").val();
        var inputDate = $("#dateTrajetRecherche").val();

        $.post('trajets_db', { user_action: 'recherche',  villeDep:inputVilleDep, villeDest:inputVilleDest, places:inputPlaces, date:inputDate }, function (data)
        {
            if(data == "empty")
            {
                notification('info', "Aucun trajet ne correspond à ces critères");
            }
            else
            {
                data = JSON.parse(data);
                $("#resRecherche").remove();
                $("#content").append("<div id='resRecherche'>Horaires disponibles pour le trajet "+inputVilleDep+" - "+inputVilleDest+":<div style='height:20px'></div></div>");                
                $("#resRecherche").append("<table id='tableRes'></table>");

                for(var i = 0; i < data.length; i++)
                {
                    $("#tableRes").append("<tr id=res_"+i+" style='height:50px'></tr>");
                    $("#res_"+i).append(data[i].heure.substr(0, 5)+" "+data[i].places+" places disponibles <button class='btn btn-success btnReserver'><span style='display:none'>"+data[i].id+"</span>Réserver</button>");
                }
            }
        });
    });

    //CLICK RESERVER
    $("#content").on("click", ".btnReserver", function()
    {
        if(user != undefined)
        {
            var nbPlaces = $("#placesRecherche").val();
            if (window.confirm("Confirmer la réservation de "+nbPlaces+" places pour ce trajet ?")) 
            { 
                $.post('reservations_db', { user_action: 'reserver',  trajet:$(this).children().html() , passager:user.id, places:nbPlaces}, function (data)
                {
                    if(data == "OK")
                    {
                        notification('success', "Vos places ont bien été réservées");
                    } 
                    else
                    {
                        notification('error', "Une erreur est survenue, veuillez réessayer plus tard");
                    }
                });
                $("#resRecherche").remove();
            }
        }
        else
        {
            alert("Vous devez être connecté pour faire une réservation");
        }
    });

    $("#content").on("click", ".annulerRes", function()
    {
        if(window.confirm("Êtes-vous sûr de vouloir annuler cette réservation"))
        {
            $.post('reservations_db', { user_action: 'annuler',  reservation:$(this).children().html()}, function (data)
            {
                if(data == "OK")
                {
                    location.reload();
                } 
                else
                {
                    notification('error', "Une erreur est survenue, veuillez réessayer plus tard");
                }
            });
        }
    });

    $("#content").on("click", ".infosConduct", function()
    {
        $.post('reservations_db', { user_action: 'conducteur_reservation',  trajet:$(this).children().html()}, function (data)
        {
            $("#tab_infos").remove();
            var modalConduct = $('[data-remodal-id=modal-infos]').remodal();
            modalConduct.open();

            data = JSON.parse(data);

            $("#modalDescInfos").append("<table id=tab_infos style=margin:auto>");
            $("#tab_infos").append("<tr id=info_0></tr><tr id=info_1></tr><tr id=info_2></tr><tr id=info_3></tr>");
            $("#info_0").append("Prénom: "+data.prenom);
            $("#info_1").append("Nom: "+data.nom);
            $("#info_2").append("Adresse mail: "+data.mail);
            $("#info_3").append("Téléphone: "+data.telephone);
        });
    });

    $("#content").on("click", ".annulerTraj", function()
    {
        if(window.confirm("Confirmer l'envoi d'une demande de suppression de votre trajet ? (Attention, après trois annulations, l'accès à votre compte sera bloqué pour une durée de trois mois)"))
        {
            $.post('trajets_db', { user_action: 'annuler',  trajet:$(this).children().html()}, function (data)
            {
                if(data == "OK")
                {
                    location.reload();
                } 
                else
                {
                    notification('error', "Une erreur est survenue, veuillez réessayer plus tard");
                }
            });
        }
    });

    $("#content").on("click", ".validerAnnul", function()
    {
        if(window.confirm("Confirmer l'annulation de ce trajet ?"))
        {
            $.post('trajets_db', { user_action: 'supprimer',  trajet:$(this).children().html()}, function (data)
            {
                if(data == "OK")
                {
                    location.reload();
                } 
                else
                {
                    notification('error', "Une erreur est survenue, veuillez réessayer plus tard");
                }
            });
        }
    });

    $("#content").on("click", ".refuserAnnul", function()
    {
        if(window.confirm("Refuser l'annulation de ce trajet ?"))
        {
            $.post('trajets_db', { user_action: 'refuser',  trajet:$(this).children().html() }, function (data)
            {
                if(data == "OK")
                {
                    location.reload();
                } 
                else
                {
                    notification('error', "Une erreur est survenue, veuillez réessayer plus tard");
                }
            });
        }
    });

// END EVENTS
});

// END PAGE LOAD

function User(id, prenom, nom, mail, telephone, prefs)
{
    this.id = id;
    this.nom = nom;
    this.prenom = prenom;
    this.mail = mail;
    this.telephone = telephone;
    this.preferences = preferences;
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

// QUITTER LA PAGE OU REFRESH
    window.onunload = function (e)
    {
	    localStorage.setItem('travelexpress_user', JSON.stringify(user));
    };