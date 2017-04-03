<?php

    include 'models/db.php';

    if(DB::db_created())
    {
        if(isset($_POST['user_action']))
        {
            $action = $_POST['user_action'];

            if($action == "connexion")
            {
                connexion($_POST['mail'], $_POST['password']);
            }
            else if($action == "inscription")
            {
                inscription($_POST['prenom'], $_POST['nom'], $_POST['mail'], $_POST['tel'], $_POST['pass']);
            }
            else if($action == "supprimer")
            {
                supprimer($_POST['id']);
            }
            else if($action == "maj_preferences")
            {
                maj_preferences($_POST['id'], $_POST['prefs']);
            }
        }
    }

    function connexion($mail, $pass)
    {
        $query = "SELECT id, nom, prenom, mail, telephone, preferences FROM utilisateurs WHERE mail = ? AND password = ?";
        
        $res = DB::requete($query, array($mail, $pass));
        $res = $res->fetch(PDO::FETCH_ASSOC);
        if($res != false)
        {
            $res['preferences'] = explode(',', $res['preferences']);
            if($res['preferences'][0] == "")
            {
                $res['preferences'] = array();
            }
        }

        echo json_encode($res);
    }

    function inscription($prenom, $nom, $mail, $tel, $pass)
    {
        $query1 = "SELECT * FROM utilisateurs WHERE mail = ?";
        $res = DB::requete($query1, array($mail));
        if($res->fetch() != false)
        {
            echo "mailTaken";
        }
        else
        {
            $query2 = "INSERT INTO utilisateurs(nom, prenom, mail, telephone, password) VALUES (?, ?, ?, ?, ?)";
            $res = DB::requete($query2, array($nom, $prenom, $mail, $tel, $pass));

            echo "OK";
        }
    }

    function supprimer($id)
    {
        $query = "DELETE FROM utilisateurs WHERE id = ?";
        DB::requete($query, array($id));
    }

    function maj_preferences($id, $prefs)
    {
        $query = "UPDATE utilisateurs SET preferences = ? WHERE id = ?";
        DB::requete($query, array($prefs, $id));

        echo "OK";
    }

?>