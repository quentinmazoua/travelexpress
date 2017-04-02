<?php

    include 'models/db.php';

    if(DB::db_created())
    {
        if(isset($_POST['user_action']))
        {
            $action = $_POST['user_action'];

            if($action == "ajout")
            {
                ajoutTrajet($_POST['conducteur'], $_POST['villeDep'], $_POST['villeDest'], $_POST['places'], $_POST['date'], $_POST['heure'], $_POST['frequence']);
            }
            else if($action == "recherche")
            {
                recherche($_POST['villeDep'], $_POST['villeDest'], $_POST['places'], $_POST['date']);
            }
            else if($action == "trajets_utilisateur")
            {
                trajets_utilisateur($_POST['id']);
            }
            else if($action == "annuler")
            {
                annuler($_POST['trajet']);
            }
            else if($action == "liste_annulations")
            {
                liste_annulations();
            }
            else if($action == "refuser")
            {
                refuser_annulation($_POST['trajet']);
            }
            else if($action == "supprimer")
            {
                supprimerTrajet($_POST['trajet']);
            }
        }
    }

    function ajoutTrajet($conducteur, $villeDep, $villeDest, $places, $date, $heure, $frequence)
    {
        switch($frequence)
        {
            case "uneFois":
                $frequence = 0;
                break;
            case "hebdo":
                $frequence = 1;
                break;
            case "mensuel":
                $frequence = 2;
                break;
        }
        $query = "INSERT INTO trajets(idConducteur, villeDepart, villeDestination, places, date, heure, frequence) VALUES (?, ?, ?, ?, ?, ?, ?)";
        
        $res = DB::requete($query, array($conducteur, $villeDep, $villeDest, $places, $date, $heure, $frequence)); 

        echo "OK";
    }

    function recherche($villeDep, $villeDest, $places, $date)
    {
        $query = "SELECT * FROM trajets WHERE villeDepart = ? AND villeDestination = ? AND places >= ? AND statut = 0";

        $res = DB::requete($query, array($villeDep, $villeDest, $places));
        $res = $res->fetchAll(PDO::FETCH_ASSOC);
        if($res == array())
        {
            echo "empty";
        }
        else
        {
            $tab_traj = array();
            $i = 0;
            foreach($res as $trajet)
            {
                if($trajet['frequence'] == 0)
                {
                    if($trajet['date'] == $date)
                    {
                        $tab_traj[] = $res[$i];
                    }
                }
                elseif($trajet['frequence'] == 1)
                {
                    if(date('w', strtotime($trajet['date'])) == date('w', strtotime($date)))
                    {
                        $tab_traj[] = $res[$i];
                    }
                }
                else
                {
                    if(date('d', strtotime($trajet['date'])) == date('d', strtotime($date)))
                    {
                        $tab_traj[] = $res[$i];
                    }
                }
                $i++;
            }
            echo json_encode($tab_traj);
        }
    }

    function trajets_utilisateur($id)
    {
        $query = "SELECT * FROM trajets WHERE idConducteur = ?";
        $res = DB::requete($query, array($id));

        echo json_encode($res->fetchAll(PDO::FETCH_ASSOC));
    }

    function annuler($trajet)
    {
        $query = "UPDATE trajets SET statut = 1 WHERE id = ?";
        DB::requete($query, array($trajet));

        echo "OK";
    }

    function liste_annulations()
    {
        $query = "SELECT * FROM trajets WHERE statut = 1";
        $res = DB::requete($query, array());

        echo json_encode($res->fetchAll(PDO::FETCH_ASSOC));
    }

    function refuser_annulation($trajet)
    {
        $query = "UPDATE trajets SET statut = 0 WHERE id = ?";
        DB::requete($query, array($trajet));

        echo "OK";
    }

    function supprimerTrajet($trajet)
    {
        $query = "DELETE FROM trajets WHERE id = ?";
        DB::requete($query, array($trajet));

        echo "OK";
    }

?>