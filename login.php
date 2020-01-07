<?php

$_SERVER['HTTP_X_FORWARDED_HOST'] = $_SERVER['HTTP_HOST'];
$_SERVER['REQUEST_URI']="/aktiverapatron/login.php";

require_once $_SERVER['DOCUMENT_ROOT'] . '/CAS/CAS.php';

// Uncomment to enable debugging
//phpCAS::setDebug($_SERVER['DOCUMENT_ROOT'] . '/CAS/cas.log');

phpCAS::client(CAS_VERSION_2_0,'login.kth.se',443,'', false);
phpCAS::setNoCasServerValidation();
phpCAS::forceAuthentication();
$casUser = phpCAS::getUser();
if($casUser) {
	if (session_status() == PHP_SESSION_NONE) {
		session_start();
	}
	$_SESSION['kth_id']  	= $casUser ;
	$userid 				= $_SESSION['kth_id']  ;
	header("location: aktiverapatron.php") ;
}
?>
