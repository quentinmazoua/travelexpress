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
        }
    }

    function connexion($mail, $pass)
    {
        $query = "SELECT id, nom, prenom, mail, telephone FROM utilisateurs WHERE mail = ? AND password = ?";
        
        $res = DB::requete($query, array($mail, $pass));


        echo json_encode($res->fetch(PDO::FETCH_ASSOC));
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

?>