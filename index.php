<?php
define('ROOT', __DIR__);
$uri = $_SERVER['REQUEST_URI'];
if (preg_match('/.*\\.(css|js|png|jpg|jpeg|mp3|ogg|woff|woff2|ttf)$/i', $uri) === 1)
{
	$filename = preg_replace('#^/#', '', $uri);
	if (file_exists($filename))
	{
		header('Content-Type: text/css');
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
			require ROOT.'/index.html';			
            break;
        case '/about':
		    require ROOT.'/about.html';
		    break;
		default:
			http_response_code(404);
			echo $uri.': 404 not found';
			break;
	}