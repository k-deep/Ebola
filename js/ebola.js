$(document).ready(function() {
	// Bind to the checkboxes and clear options based on None of the Above or Not.
	$('.IsNoSymptom').click(function () {
		if ($(this).prop('checked')) {
			$('.IsSymptom').prop('checked', false).checkboxradio('refresh');
		}
	});
	$('.IsSymptom').click(function () {
		if ($(this).prop('checked')) {
			$('.IsNoSymptom').prop('checked', false).checkboxradio('refresh');
		}
	});
	
	$('.IsNoExposure').click(function () {
		if ($(this).prop('checked')) {
			$('.IsExposure').prop('checked', false).checkboxradio('refresh');
		}
	});
	$('.IsExposure').click(function () {
		if ($(this).prop('checked')) {
			$('.IsNoExposure').prop('checked', false).checkboxradio('refresh');
		}
	});
	


	// Process the form ...
	$.validator.setDefaults({
		submitHandler: function() {
			// Get Fever Input ...
			var Fever = $('input[name=radioFever]:checked', '#frmEbola').val(); 
		  
			// Get Symptoms Input ...
			var SymptomsArray = new Array();
			$('input[name="CbSymptoms"]:checked', '#frmEbola').each(function() {
				SymptomsArray.push(this.value);
			});
	
			// Get Exposure Input ...
			var ExposuresArray = new Array();
			$('input[name="CbExposures"]:checked', '#frmEbola').each(function() {
				ExposuresArray.push(this.value);
			});
			
			//alert('Fever: ' + Fever + '\n' + 'Symptoms: ' + SymptomsArray + '\n' + 'Exposures: ' + ExposuresArray);

			// Check if they meet the EVD criteria ...
			var isSuspect;
			var suspectExtraText = '';
			var suspectText = '';
			if (Fever === 'no') {
				isSuspect = false;
				suspectExtraText = ', since they do not have a fever.';
			} else if ($.isInArray("NoSymptoms", SymptomsArray)) {
				isSuspect = false;
				suspectExtraText = ', since they do not have any related symptoms.';
			} else if 	(
							($.isInArray("DirectContact", ExposuresArray))
								||
								(							
									$.isInArray("Travel", ExposuresArray)
										&&
									(
										$.isInArray("Residence", ExposuresArray)
											|| 
										$.isInArray("ProvisionOfCare", ExposuresArray)
											||
										$.isInArray("CasualContact", ExposuresArray)
									)
								)
						) {
				isSuspect = true;
			} else {
				isSuspect = false;
			}
			if (isSuspect === true) {
				suspectText = '<div class="suspect_text">' + 'Suspicious for Ebola Virus Disease' + '</div>' + 'Please follow your organization\'s isolation and treatment protocol for Ebola';
			} else if (isSuspect === false) {
				suspectText = '<div class="not_suspect_text">' + 'NOT suspicious for Ebola Virus Disease' + suspectExtraText + '</div>';
			}
			$('#resultDiv').html(suspectText);
			
			$(':mobile-pagecontainer').pagecontainer('change', '#resultPage', {
				transition: 'slide',
				changeHash: false,
				showLoadMsg: true
			});
    
		}
	});
	
	// Define the form validation ...
	$("#frmEbola").validate({
			focusInvalid: false,
			rules: {
				radioFever: "required",
				CbSymptoms: {
					required: true,
					minlength: 1
				},
				CbExposures: {
					required: true,
					minlength: 1
				}
			},
			messages: {
				radioFever: "Please Select a Temperature<BR>",
				CbSymptoms: "You Need to Specify Symptoms",
				CbExposures: "You Need to Specify Exposures"
			},errorPlacement: function(error, element) {
				switch (element.attr("name")) {
					case 'radioFever':
						error.appendTo("#radioFeverError");
						break;
					case 'CbSymptoms':
						error.appendTo("#CbSymptomsError");
						break;
					case 'CbExposures':
						error.appendTo("#CbExposuresError");
						break;
					default:
						error.insertAfter(element);
			    }
			}
	});
	
	
	
	
	// Like jQuery inArray but with boolean behavior
	$.isInArray = function(value, array) {
	  return -1 != $.inArray(value, array);
	}
});

