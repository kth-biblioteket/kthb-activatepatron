<?php
/*
$_SERVER['HTTP_X_FORWARDED_HOST'] = $_SERVER['HTTP_HOST'];
$_SERVER['REQUEST_URI']="/activatepatron/login.php";

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
	header("location: ./") ;
}
*/

require_once "config.php";
date_default_timezone_set("Europe/Stockholm");

session_start();

//210519 OpenID Connect framework(myits)
require_once($_SERVER['DOCUMENT_ROOT'] .  '/myits/vendor/autoload.php');

use Its\Sso\OpenIDConnectClient;
use Its\Sso\OpenIDConnectClientException;

//Funktioner för att läsa JWTtokens från KTH-login(id_token)
function base64url_decode($base64url) {
	return base64_decode(b64url2b64($base64url));
  }
  
function b64url2b64($base64url) {
	$padding = strlen($base64url) % 4;
	if ($padding > 0) {
		$base64url .= str_repeat("=", 4 - $padding);
	}
	return strtr($base64url, '-_', '+/');
}

function decodeJWT($jwt, $section = 0) {
	$parts = explode(".", $jwt);
	return json_decode(base64url_decode($parts[$section]));
}

try {
	$oidc = new OpenIDConnectClient(
		$kth_auth_endpoint,
		$kth_client_id,
		$kth_client_secret
	);

	$oidc->addScope('openid email profile');
  
	// remove this if in production mode
	$oidc->setVerifyHost(false);
	$oidc->setVerifyPeer(false);

	//redirect tillbaks till denna sida!
    $oidc->setRedirectURL(html_entity_decode("https://" . $_SERVER['HTTP_HOST'] . "/login.php?"));
	
	//Skickar vidare till login på KTH om användaren inte redan är inloggad
	$oidc->authenticate();
	//Vid redan inloggad exekveras koden nedan 

	//id_token innehåller den användarinfo tjänsten prenumererar på(här används kthid)
	$_SESSION['id_token'] = $oidc->getIdToken();
	$userinfo = decodeJWT($_SESSION['id_token'], 1);
	$_SESSION['kth_id'] = $userinfo->kthid;

	//finns ett kthid så startas applikationen
	if(isset($_SESSION['kth_id']) && $_SESSION['kth_id'] != "") {
		$userid = $_SESSION['kth_id']  ;
		$returl = str_replace('ampersand','&',$returl);
		header("location: index.php");
	}
  
} catch (OpenIDConnectClientException $e) {
	echo $e->getMessage();
}
?>
