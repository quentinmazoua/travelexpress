<?php
    abstract class DB
    {
        public static $db;
        // method declaration
        public static function create_db($file = 'db_settings.ini') 
        {
            if (!$settings = parse_ini_file($file, TRUE)) throw new exception('Unable to open ' . $file . '.');
            $dns = $settings['database']['driver'] .
            ':host=' . $settings['database']['host'] .
            ((!empty($settings['database']['port'])) ? (';port=' . $settings['database']['port']) : '') .
            ';dbname=' . $settings['database']['name'];

            DB::$db = new PDO($dns, $settings['database']['username'], $settings['database']['password'], array(PDO::ATTR_PERSISTENT=>true));
        }
    }
    if(DB::$db == null)
    {
        DB::create_db();

        // TEST QUERY
        /*$test = DB::$db->query("SELECT * FROM test");

        echo $test->fetch()[0];*/
    }
?>