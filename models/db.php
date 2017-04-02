<?php

    abstract class DB
    {
        public static $db;
        
        public static function create_db($file = 'db_settings.ini') 
        {
            if (!$settings = parse_ini_file($file, TRUE)) throw new exception('Unable to open ' . $file . '.');
            $dns = $settings['database']['driver'] .
            ':host=' . $settings['database']['host'] .
            ((!empty($settings['database']['port'])) ? (';port=' . $settings['database']['port']) : '') .
            ';dbname=' . $settings['database']['name'];

            DB::$db = new PDO($dns, $settings['database']['username'], $settings['database']['password'], array(PDO::ATTR_PERSISTENT=>true));
        }

        public static function requete($requete, $params)
        {
            $statement = DB::$db->prepare($requete);
            $statement->execute($params);

            return $statement;
        }

        public static function db_created()
        {
            return DB::$db != null;
        }
    }
    if(DB::$db == null)
    {
        DB::create_db();
    }
?>