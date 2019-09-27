<?php

$_SERVER['HTTP_X_FORWARDED_HOST'] = "kthb-hv.lib.kth.se";
$_SERVER['REQUEST_URI']="/aktiverapatron/login.php";

require_once $_SERVER['DOCUMENT_ROOT'] . '/CAS/CAS.php';

// Uncomment to enable debugging
//phpCAS::setDebug($_SERVER['DOCUMENT_ROOT'] . '/CAS/cas.log');

phpCAS::client(CAS_VERSION_2_0,'login.kth.se',443,'', false);
phpCAS::setNoCasServerValidation();
phpCAS::forceAuthentication();

$casUser = phpCAS::getUser();

if (isset($_REQUEST['logout'])) {
	if (session_status() == PHP_SESSION_NONE) {
		session_start();
	}
	phpCAS::logout();
	header("location: login.kth.se/logout?url=http://bokning.lib.kth.se/checkkthlogin.php") ;
}

if($casUser) 
{
	if (!isset($_SESSION)) {
		session_start();
	}
 	$_SESSION['kth_id']  	= $casUser ;
	$userid 				= $_SESSION['kth_id']  ;
	header("location: aktiverapatron.php") ;
}
?>
