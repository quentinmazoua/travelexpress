<?php

    include 'models/db.php';

    if(DB::db_created())
    {
        if(isset($_POST['user_action']))
        {
            $action = $_POST['user_action'];

            if($action == "reserver")
            {
                reserver($_POST['trajet'], $_POST['passager'], $_POST['places']);
            }
            else if($action == "annuler")
            {
                annuler($_POST['reservation']);
            }
            else if($action == "reservations_utilisateur")
            {
                reservations_utilisateur($_POST['id']);
            }
            else if($action == "conducteur_reservation")
            {
                conducteur_reservation($_POST['trajet']);
            }
        }
    }

    function reserver($trajet, $passager, $places)
    {
        ajouterPlaces($trajet, -$places);

        $query = "INSERT INTO reservations(id_trajet, id_passager, places) VALUES(?, ?, ?)";
        $res = DB::requete($query, array($trajet, $passager, $places));
        echo "OK";
    }

    function annuler($reservation)
    {
        $id_places = getIDPlaces($reservation);
        ajouterPlaces($id_places["id_trajet"], $id_places["places"]);

        $query = "DELETE FROM reservations WHERE id_reservation = ?";
        DB::requete($query, array($reservation));
        echo "OK";
    }

    function reservations_utilisateur($id)
    {
        $query = "SELECT id_reservation, id_trajet FROM reservations WHERE id_passager = ?";
        $res = DB::requete($query, array($id));
        $res = $res->fetchAll(PDO::FETCH_ASSOC);

        $tab_res = array();

        foreach($res as $key=>$val)
        {
            $query = "SELECT * FROM trajets WHERE id = ?";
            $res2 = DB::requete($query, array($val["id_trajet"]));
            $res2 = $res2->fetch(PDO::FETCH_ASSOC);
            $res2["places"] = getPlacesReserv($val["id_reservation"]);
            $res2["id_reservation"] = $val["id_reservation"];
            $tab_res[] = $res2;
        }

        echo json_encode($tab_res);
    }

    function getPlacesReserv($id)
    {
        $query = "SELECT places FROM reservations WHERE id_reservation = ?";
        $res = DB::requete($query, array($id));
        $res = $res->fetch(PDO::FETCH_ASSOC);
        return $res["places"];
    }

    function ajouterPlaces($id, $plusOuMoins)
    {
        $query = "UPDATE trajets SET places = places + ? WHERE id = ?";
        DB::requete($query, array($plusOuMoins, $id));
    }

    function getIDPlaces($reserv)
    {
        $query = "SELECT id_trajet, places FROM reservations WHERE id_reservation = ?";
        $res = DB::requete($query, array($reserv));

        return $res->fetch(PDO::FETCH_ASSOC);
    }

    function conducteur_reservation($trajet)
    {
        $query = "SELECT idConducteur FROM trajets WHERE id = ?";
        $res = DB::requete($query, array($trajet));
        $res = $res->fetch(PDO::FETCH_ASSOC)["idConducteur"];

        $query = "SELECT prenom, nom, mail, telephone FROM utilisateurs WHERE id = ?";
        $res2 = DB::requete($query, array($res));

        echo json_encode($res2->fetch(PDO::FETCH_ASSOC));
    }
?>