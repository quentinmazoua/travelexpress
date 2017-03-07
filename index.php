<?php
define('ROOT', __DIR__);
$uri = $_SERVER['REQUEST_URI'];
if (preg_match('/.*\\.(css|js|png|jpg|jpeg|mp3|ogg|woff|woff2|ttf|)$/i', $uri) === 1)
{
	$filename = preg_replace('#^/#', '', $uri);
	if (file_exists($filename))
	{
		//header('Content-Type: text/css');
		readfile($filename, true);
	}
	else
		http_response_code(404);
}
else
	switch ($uri)
	{
		case '/':
		case '/home':
			require ROOT.'/views/main.html';			
            break;
		case '/accueil':
			require ROOT.'/views/accueil.html';			
			break;
		case '/connexion':
			require ROOT.'/views/connexion.html';			
            break;
		case '/contact':
			require ROOT.'/views/contact.html';			
            break;
		case '/inscription':
			require ROOT.'/views/inscription.html';			
            break;
		case '/mon compte':
			require ROOT.'/views/mon compte.html';			
            break;
		case '/trajets':
			require ROOT.'/views/trajets.html';			
            break;
		case '/db':
			require ROOT.'/models/db.php';			
            break;
		default:
			http_response_code(404);
			echo $uri.': 404 not found';
			break;
	}