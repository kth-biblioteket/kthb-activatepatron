/**********

Funktion som hämtar userinfo från Alma efter inloggning mot CAS

**********/
function ajaxinituser(language) {
	$("#modaltext").text(modalsendrequesttext);
	$('#loadingmessage img').show();
	$('#modaltext').css("color","black");
	$('#activatepatron').hide();
	$('.activationtext').hide();
	$('#myModal').show();
	$.ajax({                                      
			url: 'activatepatron_aj.php',                  
			data: { getuserid: 1, language: language } ,
			dataType: 'json',
			type: 'post',
			success: function(output){
				if(output.result) {
					if (output.result == 'Success'){
						$("#userfullname").html(output.message);
						$("#userinfo").show();
						$('#myModal').hide();
						if(output.activepatron===true) {
							$("#activepatron").html(alreadyactivatedtext);
							$("#activepatron").css("color", "#8b9f22");
							$("#skicka").val(de_activatebuttontext);
							$('#skicka').hide();
							$("#isactivepatron").val('true');
							$("#willing").hide();
							$("#almapin").hide();
							$('#activatepatron').show();
							$('.activatedtext').show();
						} else {
							$("#activepatroninfo").hide();
							$("#skicka").val(activatebuttontext);
							$('#skicka').show();
							$("#isactivepatron").val('false');
							$("#willing").show();
							$("#almapin").show();
							$('#activatepatron').show();
						}
					} else { 
						$('#loadingmessage img').hide();
						$('.modal-content').css("border","1px solid red");
						$("#modaltext").html(output.message);
						$("#myModal").focus();
						if (output.message.search(/.*Användarnamnet/i)>=0 || output.message.search(/.*Username/i)>=0) {
							$('#id').addClass("error");
						}
					}
				}
				else {
				}
			},
			error: function(ajaxContext){
				$('#loadingmessage img').hide();
				$("#modaltext").html(ajaxContext.responseText + "<input class=\"modalclose\" type='button' value=\"" + modalclosbuttontext +"\" onclick=\"$('#myModal').hide();\"/></div>");
				$('#myModal').show();
			}
		});
}
		
/**********

Funktion som skickar aktiveringen till Alma via ett ajaxanrop till php-sida().

**********/
function ajaxRequest(url) {
	$("#modaltext").text(modalactivatetext);
	$('#loadingmessage img').show();
	$('#modaltext').css("color","black");
	$('#activatepatron').hide();
	$('.activationtext').hide();
	$('#myModal').show();
	$.ajax({                                      
		url: url,                  
		data: $("#activatepatron").serialize() + '&activate=1',
		dataType: 'json',
		type: 'post',
		success: function(output){
			if(output.result) {
				if (output.result == 'Success'){
					$('#myModal').hide();
					$('#loadingmessage img').hide();
					$("#myModal").focus();
					$('#activatepatron')[0].reset();
					$("#modaltext").html(output.message + "<div><input class=\"modalclose\" type='button' value=\"" + modalclosbuttontext +"\" onclick=\"$('#myModal').hide();\"/></div>");
					if (output.active=="true") {
						$("#activepatron").css("color", "#8b9f22");
						$("#skicka").val(de_activatebuttontext);
						$('#skicka').hide();
						$("#isactivepatron").val('true');
						$("#willing").hide();
						$("#almapin").hide();
						$('#activatepatron').show();
						$('.activationtext').show();
					}					
					else {
						$("#activepatron").html('');
						$("#activepatroninfo").hide();
						$("#skicka").val(activatebuttontext);
						$('#skicka').show();
						$("#isactivepatron").val('false');
						$("#willing").show();
						$("#almapin").show();
						$('#activatepatron').show();
					}
				} else {
					$('#loadingmessage img').hide();
					$('.modal-content').css("border","1px solid red");
					$('#modaltext').css("color","red");
					$("#modaltext").html(output.message + "<div><input class=\"modalclose\" type='button' value=\"" + modalclosbuttontext +"\" onclick=\"$('#myModal').hide();$('.modal-content').css('border','none');$('#modaltext').css('color','black');\"/></div>");
					$("#myModal").focus();
					if (output.message.search(/.*Användarnamnet/i)>=0 || output.message.search(/.*Username/i)>=0) {
						$('#id').addClass("error");
					}
				}
			}
			else {
			}
		},
		error: function(ajaxContext){
			$('#loadingmessage img').hide();
			$("#modaltext").html(ajaxContext.responseText + "<input class=\"modalclose\" type='button' value=\"" + modalclosbuttontext +"\" onclick=\"$('#myModal').hide();\"/></div>");
			$('#myModal').show();
		}
	});
};

/**********

Funktion som loggar ut användare

**********/
function logoutfromsaml() {
	$.ajax({                                      
			url: 'logout.php',
			dataType: 'json',
			type: 'post',
			success: function(output){
				window.location.href = "./";
			},
			error: function(ajaxContext){
				$('#loadingmessage img').hide();
				$("#modaltext").html(ajaxContext.responseText + "<input class=\"modalclose\" type='button' value=\"" + modalclosbuttontext +"\" onclick=\"$('#myModal').hide();\"/></div>");
				$('#myModal').show();
			}
		});
}

/**********

Funktion som körs vid klick på "Aktivera". Validerar formulärets fält och sedan anropar ajaxRequest-funktionen(anropet till Alma) om allt är OK

**********/
function sendrequest() {
	$('#id').removeClass("error");
	if (activatepatron.almapinnumber.value != "") {
		if (validatePin(activatepatron.almapinnumber.value)) {
		}
		else {
			alert(pinerrortext);
			activatepatron.almapinnumber.focus();
			return false;
		}
	}
	var validerat = Validering.form();
	if (validerat == true) {
		$('#myModal').hide();
		if ($('#iskth').val()=='true'){
			$('#almaid').val($('#id').val() + '');
		} else {
			$('#almaid').val($('#id').val())
		}
		ajaxRequest('activatepatron_aj.php');
	}
}

/**********

Funktion som skapar validering för formuläret (använder jquery.validate.min.js) 

**********/
var Validering
$(document).ready(function() {
	Validering = $("#activatepatron").validate({
		invalidHandler: function(form, validator) {
			var errors = validator.numberOfInvalids();
			if (errors) {
				$('#loadingmessage img').hide();
				$('.modal-content').css("border","1px solid red");
				$('#modaltext').css("color","red");
				$("#modaltext").html(modalinvalidformtext);
				$('#myModal').show();
			} else {
				$('#loadingmessage img').hide();
				$('.modal-content').css("border","none");
				$('#modaltext').css("color","black");
				$("#modaltext").hide();
			}
		}
	});
});

/**********

Funktion som via en regex hanterar tillåtna tecken i användarnamn-fältet 

**********/
function isValidUserId(UserId) {
	var pattern = /^[a-zA-Z0-9@._-]+$/;
	return pattern.test(UserId);
};

/**********

Funktion för att visa rätt loginruta/info beroende på val.

**********/
function showlogin(type) {
	$('#id').show();
	$('#idlabel').show();
	if(type=="kth"){
		$('#iskth').val('true');
	} else {
		$('#iskth').val('false');
	}
}

/**********

Funktion som kollar om accepteraboxen är ikryssad och aktiverar skicka-knappen

**********/
function activatesubmitbutton() {
	if ($('#willingcheck').is(':checked')) {
			$('#skicka').removeAttr('disabled');
			$('#skicka').css("background-color","#B0C92B");
			$('#skicka').css("cursor","pointer");
		} else {
			$('#skicka').attr('disabled','disabled');
			$('#skicka').css("background-color","grey");
			$('#skicka').css("color","#ffffff");
			$('#skicka').css("cursor","default");
		}
}

/**********

Funktion som validerar pinkoden

**********/
function validatePin(pin) {
	//siffra och 4 tecken långt
	var re = /^[0-9]{4}$/;
	return re.test(pin);
}

/**********

Funktion som skickar användaren till logoutsidan

**********/
function logout() {
	window.location.href = "logout.php";
}		

/**********

Funktion som körs när sidan laddas. 

Ser till att placeholder(den gråa infotexten som syns inne i ett fält innan man skriver nåt) fungerar för äldre browers.

Ser till att default materialtyp och inloggningstyp är valda.

Anpassningar till språk

**********/
var language, usernamekthplaceholder, usernameotherplaceholder, modalsendrequesttext, modalclosbuttontext, modalinvalidusernamecharacterstext, modalinvalidformtext;
$(document).ready(function() {
	$("#willingcheck").on("click", function(){
		activatesubmitbutton()
	});
	if ($( "#language" ).val()=='swedish') {
		language = 'swedish';
		modalsendrequesttext = 'Kontrollerar användare...';
		modalactivatetext = 'Uppdaterar användare...';
		modalclosbuttontext = 'Stäng';
		modalinvalidusernamecharacterstext = 'Felaktiga tecken i användarnamn';
		modalinvalidformtext = 'Vänligen fyll i obligatoriska fält'
		usernamekthplaceholder = 'Ange ditt KTH-Konto';
		usernameotherplaceholder = 'Ange din email-adress';
		activatebuttontext = 'Aktivera mitt bibliotekskonto';
		de_activatebuttontext = 'Avaktivera mitt bibliotekskonto';
		alreadyactivatedtext = 'Ditt bibliotekskonto är aktiverat';
		pinerrortext = 'Vänligen ange en 4-siffrig PIN kod.';
	} else {
		language = 'english';
		modalsendrequesttext = 'Checking user...';
		modalactivatetext = 'Updating user...';
		modalclosbuttontext = 'Close';
		modalinvalidusernamecharacterstext = 'Invalid charachters in the username';
		modalinvalidformtext = 'Please fill in required fields'
		usernamekthplaceholder = 'Your KTH-Account';
		usernameotherplaceholder = 'Your email-address';
		activatebuttontext = 'Activate my library account';
		de_activatebuttontext = 'Deactivate my library account';
		alreadyactivatedtext = 'Your library account is activated';
		pinerrortext = 'Please enter a 4 digit PIN code';
	}
	$('input, textarea').placeholder();
	$('#citation_type1').prop("checked", true);
	$('#kategori1').prop("checked", true);
	showlogin('kth');
	ajaxinituser(language);
	activatesubmitbutton();
});