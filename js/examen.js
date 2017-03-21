// **********************************
//      DEFINICION de VARIABLES
// **********************************
// número de preguntas de examen.xml
var numpreg = 10;
// almacena el elemento del FORMulario
var formElement = null;
// almacena el fichero de datos XML
var xmlDoc = null;
// almacena el fichero de transformacion XSL
var xslDoc = null;
// puntuacion
var score = 0.0;
// precision de la nota
var prec = 1;

// primera pregunta no respondida
var ppnr = "";
// preguntas no respondidas
var pnr = "";
// numero dde pregunta
//var nump = '';

//estas variables almacenarán las soluciones correctas de examen.xml

// null
var sol_text = "";
var sol_text_1 = "";
var sol_text_2 = "";

// ""
var sol_select = -1;
var sol_select_1 = -1;
var sol_select_2 = -1;

var sol_mult = [];
var sol_multiple = "";
var sol_multiple_1 = "";
var sol_multiple_2 = "";

// null
var sol_radio = -1;
var sol_radio_1 = -1;
var sol_radio_2 = -1;

var sol_ckx = [];
var sol_checkbox = "";
var sol_checkbox_1 = "";
var sol_checkbox_2 = "";

//estas variables almacenarán las respuestas dadas en examen.html

var resp_text = "";
var resp_text_1 = "";
var resp_text_2 = "";

var resp_select = -1;
var resp_select_1 = -1;
var resp_select_2 = -1;

var resp_mult = [];
var resp_multiple = "";
var resp_multiple_1 = "";
var resp_multiple_2 = "";

var resp_radio = -1;
var resp_radio_1 = -1;
var resp_radio_2 = -1;

var resp_ckx = [];
var resp_checkbox = "";
var resp_checkbox_1 = "";
var resp_checkbox_2 = "";

// Time management

var mins_quiz_time = 2; //available quiz time (in mins)
var secs_quiz_time = 30; //available quiz time (in secs)
var exam_time =((mins_quiz_time * 60) + secs_quiz_time) * 1000;
var delay = 1600;        // calculation delay adjustment
var quiz_time = exam_time + delay;
var clock_tick = 0;               // used for timer increments
var remaining_time = 0;
// **********************************
//      DEFINICION de EVENTO
// **********************************
//al cargar la página...
window.onload = function () {
	formElement = document.getElementById('myexam');

	// Corregir al hacer clic en el botón    
	formElement.onsubmit = function () {

	   // here we must check if all questions are answered
	   ppnr = '';
	   pnr = '';
	   check_if_all_answers();	
	   if (ppnr !== '') {
           //formElement.elements[parseInt(ppnr) - 1].focus();
           //formElement.getElementById['q' + parseInt(ppnr) - 1].focus();
           alert("Preguntas no respondidas: " + pnr);
	   //document.getElementById('q' + ppnr-1).focus();
           return false;
       }
	   else {
           // we stop the timer
           clearInterval(clock_tick);
	
           // calculate minutes and seconds
           var mn = Math.floor((remaining_time/(1000 * 60)));
           var sc = ((remaining_time / 1000) - (mn * 60)).toFixed(0);                    
           // format minutes and seconds if less than 10
           if (mn < 10) {fmn = "0" + mn;}
           else {fmn = mn;}      
           if (sc < 10) {fsc= "0" + sc;}
           else {fsc = sc;}              
           document.getElementById("reloj").innerHTML = "Remaining time " + fmn + ":" + fsc;		
           doCorrect();
           return false;
	   }
	};

	//pide los datos, lee examen.xml del servidor (por http)
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			gestionarXml(this);
		}
	};
	//xhttp.open("GET", "https://rawgit.com/JoLuRe/10Question-form/master/xml/examen.xml", true);
	xhttp.open("GET", "xml/examen.xml", true);
	xhttp.send();

	//Leemos XSL de examen.xml
	var xhttp2 = new XMLHttpRequest();
	xhttp2.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			xslDoc=this.responseXML;
		}
	};
	xhttp2.open("GET", "xml/examen.xsl", true);
	xhttp2.send();

    var now = new Date().getTime();
    var limit = now + quiz_time;

    clock_tick = setInterval(function() {

        // Get todays date and time and find the remaining_time between now and the limit
        var now = new Date().getTime();
        remaining_time = limit - now;

        // Time calculations for minutes and seconds
        var minutes = Math.floor((remaining_time % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((remaining_time % (1000 * 60)) / 1000);

        if (minutes < 10) {fminutes = "0" + minutes;}
        else {fminutes = minutes;}      
        if (seconds < 10) {fseconds = "0" + seconds;}
        else {fseconds = seconds;}      

        // Display the result in the id="reloj"
        document.getElementById("reloj").innerHTML = "Remaining time " + fminutes + ":" + fseconds;

        // If the count down is finished... 
        if (remaining_time < 0) {
            clearInterval(clock_tick);
            document.getElementById("reloj").innerHTML = "TIME FINISHED";
            doCorrect();
	    return false;	  
        }
    }, 1000);
};

// **********************************
//      DEFINICION de FUNCION
// **********************************
window.onmousedown = function (e) {
    var el = e.target;
    if (el.tagName.toLowerCase() == 'option' && el.parentNode.hasAttribute('multiple')) {
        e.preventDefault();

        // toggle selection
        if (el.hasAttribute('selected')) el.removeAttribute('selected');
        else el.setAttribute('selected', '');

        // hack to correct buggy behavior
        var select = el.parentNode.cloneNode(true);
        el.parentNode.parentNode.replaceChild(select, el.parentNode);
    }
}

function check_if_all_answers() {
    check_if_answerText('text_1', '1');	
    check_if_answerSelect('select_1', '2');	
    check_if_answerMultiple('multiple_1', '3');	
    check_if_answerRadio('radio_1', '4');	
    check_if_answerCheckbox('checkbox_1', '5');	
    check_if_answerText('text_2', '6');	
    check_if_answerSelect('select_2', '7');	
    check_if_answerMultiple('multiple_2', '8');	
    check_if_answerRadio('radio_2', '9');	
    check_if_answerCheckbox('checkbox_2', '10');	
}

function ammend_pnr_counter(pntr) {
    // pnr = preguntas no respondidas
    // ppnr = primera pregunta no respondida
    // pntr = pointer (puntero)
	if (ppnr === '') {
		ppnr = pntr;
		pnr = pntr;
	}
	else {
	pnr += ', ' + pntr;
	}
}

function check_if_answerText(form_elem, nump) {
   if (document.getElementById(form_elem).value === "") {
       ammend_pnr_counter(nump);
   }
}

function check_if_answerSelect(form_elem, nump) {
   if (document.getElementById(form_elem).selectedIndex == "0") {
       ammend_pnr_counter(nump);
   }
}

function check_if_answerMultiple(form_elem, nump) {
	ans_multiple = false;
    // multiple_i --> multiple_item
	multiple_i = document.getElementById(form_elem);
    // multiple_a --> multiple_answer
	multiple_a = multiple_i.getElementsByTagName('option');
	multiple_a_length = multiple_a.length;
	for (i = 0; i < multiple_a_length; i++) {
		if (multiple_a[i].selected) {
			ans_multiple = true;
		}
	}
    if (ans_multiple === false) {
       ammend_pnr_counter(nump);
    }
}

function check_if_answerRadio(form_elem, nump) {
    ans_radio = false;
	radio_i = document.getElementById(form_elem);
	radio_a = radio_i.getElementsByTagName('input');
	radio_a_length = radio_a.length;
	for (i = 0; i < radio_a_length; i++) {
		if (radio_a[i].checked) { //if this radio button is checked
			ans_radio = true;
		}
	}
    if (ans_radio === false) {
       ammend_pnr_counter(nump);
    }
}

function check_if_answerCheckbox(form_elem, nump) {
    ans_checkbox = false;
	checkbox_i = document.getElementById(form_elem);
    checkbox_a = checkbox_i.getElementsByTagName('input');
	checkbox_a_length = checkbox_a.length;
	for (i = 0; i < checkbox_a_length; i++) {
		if (checkbox_a[i].checked) {
			ans_checkbox = true;
		}
	}
    if (ans_checkbox === false) {
       ammend_pnr_counter(nump);
    }
}

function doCorrect() {
    resetPuntuacion();
    corregirText();
    corregirSelect();
    corregirMultiple();
    corregirRadio();
    corregirCheckbox();
    showScore();
    //document.getElementById("nota").innerHTML = "Score " + score + " / " + numpreg;
    //scroll(0,0);
}    

//Read XML data (title, answer options and correct answers)
//Display titles and options in HTML
//Store correct answers for evaluation

function gestionarXml(dadesXml) {

	// Store the XML data descriptor
	// "document" refers to HTML document, "xmlDOC" refers to XML document 
	xmlDoc = dadesXml.responseXML;

	// ****************************** Fill-in questions' titles

	fillTitles();

	// ****************************** Fill-in answer options

	// TEXT_1 and TEXT_2 --> no options
	// "text_1", "item0"
	// "text_2", "item5"

	// SELECT_1 single and SELECT_2 single
	fillOptions_Select_Multiple("select_1", "item1", 'select');
	fillOptions_Select_Multiple("select_2", "item6", 'select');
	// MULTIPLE_1 select and MULTIPLE_2 select
	fillOptions_Select_Multiple("multiple_1", "item2", 'multiple');
	fillOptions_Select_Multiple("multiple_2", "item7", 'multiple');

	// RADIO_1 and RADIO_2
	fillOptions_Radio_Checkbox("radio_1", "item3", 'radio');
	fillOptions_Radio_Checkbox("radio_2", "item8", 'radio');
	// CHECKBOX_1 and CHECKBOX_2
	fillOptions_Radio_Checkbox("checkbox_1", "item4", 'checkbox');
	fillOptions_Radio_Checkbox("checkbox_2", "item9", 'checkbox');


	// ****************************** Store the correct answers

	// TEXT_1 and TEXT_2
	sol_text_1 = storeAnswerText("item0");
	sol_text_2 = storeAnswerText("item5");

	// SELECT_1 single and SELECT_2 single
	sol_select_1 = storeAnswerSelect("item1");
	sol_select_2 = storeAnswerSelect("item6");

	// MULTIPLE_1 select and MULTIPLE_2 select
	sol_multiple_1 = storeAnswerMultiple("item2");
	sol_multiple_2 = storeAnswerMultiple("item7");

	// RADIO_1 and RADIO_2
	sol_radio_1 = storeAnswerRadio("item3");
	sol_radio_2 = storeAnswerRadio("item8");

	// CHECKBOX_1 and CHECKBOX_2
	sol_checkbox_1 = storeAnswerCheckbox("item4");
	sol_checkbox_2 = storeAnswerCheckbox("item9");

}

//****************************************************************************************************
// fillOptionsX functions (HTML_element, XML_element)
//****************************************************************************************************

function fillTitles() {
  var q_txt = []; // questions
  for (i = 0; i < numpreg; i++) {
    // question (= title)
    j = i + 1;	
    q_txt[j] = "";
    var qxpath = "/quiz/question[" + j + "]/title";
    var nodes = xmlDoc.evaluate(qxpath, xmlDoc, null, XPathResult.ANY_TYPE, null);
    var result = nodes.iterateNext();
    while (result) {
      //q_txt[j] += result.innerHTML + "<br>";
      q_txt[j] += result.innerHTML;
      result = nodes.iterateNext();
    }
    document.getElementById('q' + i).innerHTML = q_txt[j];
  } //for
}

function fillOptions_Select_Multiple(sel_mult_elem, item_elem, sm_type) {
	var selmultContainer = document.getElementById(sel_mult_elem);
	//numero de opciones que hay en el XML
	var nopciones = 0;
	var oxpath = "/quiz/question[@id='" + item_elem + "']/option";
	var nodes = xmlDoc.evaluate(oxpath, xmlDoc, null, XPathResult.ANY_TYPE, null);
	var result = nodes.iterateNext();
	while (result) {
		//nopciones ++;
		var option = document.createElement("option");
		//option.text = xml_select.getElementsByTagName("option")[i].childNodes[0].nodeValue;
		option.text = result.innerHTML;
		option.value = nopciones;
		selmultContainer.options.add(option);
		nopciones ++;
      	result = nodes.iterateNext();
    	} 
    // set the size attribute in case of select multiple
    if (sm_type == 'multiple') {selmultContainer.size = nopciones;}
}

function fillOptions_Radio_Checkbox(rad_chk_elem, item_elem, rc_type) {
	var radchkContainer = document.getElementById(rad_chk_elem);
	var nopciones = 0;
	var oxpath = "/quiz/question[@id='" + item_elem + "']/option";
	var nodes = xmlDoc.evaluate(oxpath, xmlDoc, null, XPathResult.ANY_TYPE, null);
	var result = nodes.iterateNext();
	while (result) {
		//nopciones ++;
		var input = document.createElement("input");
		var label = document.createElement("label");
		var br = document.createElement("br");
		//label.innerHTML = xml_select.getElementsByTagName('option')[i].childNodes[0].nodeValue;
		label.innerHTML = result.innerHTML;
		label.setAttribute("for", rad_chk_elem + "_" + nopciones);
		//label.setAttribute("for", nopciones);
		input.type = rc_type;
		input.name = rad_chk_elem;
		//input.id = rad_chk_elem + "_" + i;
		input.id = rad_chk_elem + "_" + nopciones;
		//input.value = i;
		input.value = nopciones;
		radchkContainer.appendChild(input);
		radchkContainer.appendChild(label);
		radchkContainer.appendChild(br);
		nopciones ++;
      	result = nodes.iterateNext();
	}
}

//function fillSolutions() {
//  var s_txt = []; // solutions
//  //var xmlDoc = dadesXml.responseXML;
//  for (i = 1; i < numpreg + 1; i++) {
//    // solution (= answer)
//    s_txt[i] = "";
//    var sxpath = "/quiz/question[" + i + "]/answer";
//    var nodes = xmlDoc.evaluate(sxpath, xmlDoc, null, XPathResult.ANY_TYPE, null);
//    var result = nodes.iterateNext();
//    while (result) {
//      resultado = result.innerHTML;
//      // display the option letter
//      if (resultado.length == 1) {s_txt[i] += String.fromCharCode(97 + parseInt(resultado)) + " ";}
//      // display the option number
//      else {s_txt[i] += resultado + " ";}
//      result = nodes.iterateNext();
//    }
//    document.getElementById('s' + i).innerHTML = s_txt[i];
//  } //for
//}
//****************************************************************************************************
// storeAnswerX functions (XML_element)
//****************************************************************************************************

function storeAnswerText(item_elem) {
	sol_text = xmlDoc.getElementById(item_elem).getElementsByTagName("answer")[0].childNodes[0].nodeValue;
	return sol_text;
}

function storeAnswerSelect(item_elem) {
	sol_select = parseInt(xmlDoc.getElementById(item_elem).getElementsByTagName("answer")[0].childNodes[0].nodeValue);
	return sol_select;
}

function storeAnswerMultiple(item_elem) {
	sol_multiple = "";
	var nsoluciones = xmlDoc.getElementById(item_elem).getElementsByTagName('answer').length;
	for (i = 0; i < nsoluciones; i++) {
		sol_mult[i] = xmlDoc.getElementById(item_elem).getElementsByTagName("answer")[i].childNodes[0].nodeValue;
		sol_multiple = sol_multiple + sol_mult[i];
	}
	return sol_multiple;
}

function storeAnswerRadio(item_elem) {
	sol_radio = parseInt(xmlDoc.getElementById(item_elem).getElementsByTagName("answer")[0].childNodes[0].nodeValue);
	return sol_radio;
}

function storeAnswerCheckbox(item_elem) {
	sol_checkbox = "";
	var nsoluciones = xmlDoc.getElementById(item_elem).getElementsByTagName('answer').length;
	for (i = 0; i < nsoluciones; i++) {
		sol_ckx[i] = xmlDoc.getElementById(item_elem).getElementsByTagName("answer")[i].childNodes[0].nodeValue;
		sol_checkbox = sol_checkbox + sol_ckx[i];
	}
	return sol_checkbox;
}

//****************************************************************************************************
// corregirX functions 
//****************************************************************************************************

function corregirText() {
	//resp_text_1 = evaluateText(sol_text_1, "sol_text_1", "text_1");
	//resp_text_2 = evaluateText(sol_text_2, "sol_text_2", "text_2");
	resp_text_1 = scoreText(sol_text_1, "item0", "text_1");
	resp_text_2 = scoreText(sol_text_2, "item5", "text_2");
}

function corregirSelect() {
	//resp_select_1 = evaluateSelect(sol_select_1, "sol_select_1", "select_1");
	//resp_select_2 = evaluateSelect(sol_select_2, "sol_select_2", "select_2");
	resp_select_1 = scoreSelect(sol_select_1, "item1", "select_1");
	resp_select_2 = scoreSelect(sol_select_2, "item6", "select_2");
}

function corregirMultiple() {
	//resp_multiple_1 = evaluateMultiple(sol_multiple_1, "sol_multiple_1", "multiple_1");
	//resp_multiple_2 = evaluateMultiple(sol_multiple_2, "sol_multiple_2", "multiple_2");
	resp_multiple_1 = scoreMultiple(sol_multiple_1, "item2", "multiple_1");
	resp_multiple_2 = scoreMultiple(sol_multiple_2, "item7", "multiple_2");
}

function corregirRadio() {
	//resp_radio_1 = evaluateRadio(sol_radio_1, "sol_radio_1", "radio_1");
	//resp_radio_2 = evaluateRadio(sol_radio_2, "sol_radio_2", "radio_2");
	resp_radio_1 = scoreRadio(sol_radio_1, "item3", "radio_1");
	resp_radio_2 = scoreRadio(sol_radio_2, "item8", "radio_2");
}

function corregirCheckbox() {
	//resp_checkbox_1 = evaluateCheckbox(sol_checkbox_1, "sol_checkbox_1", "checkbox_1");
	//resp_checkbox_2 = evaluateCheckbox(sol_checkbox_2, "sol_checkbox_2", "checkbox_2");
	resp_checkbox_1 = scoreCheckbox(sol_checkbox_1, "item4", "checkbox_1");
	resp_checkbox_2 = scoreCheckbox(sol_checkbox_2, "item9", "checkbox_2");
}

//****************************************************************************************************
// evaluateX functions (correct_solution_variable, solution_display_HTML_element, form_element)
//****************************************************************************************************

function evaluateText(correct_text, sol_elem, frm_elem) {
	resp_text = document.getElementById(frm_elem).value;
	resp_text = resp_text.toLowerCase();
	if (resp_text == correct_text) {
		informSuccess(frm_elem);
	} else {
		document.getElementById(sol_elem).innerHTML = "Correct answer: " + correct_text.charAt(0).toUpperCase() + correct_text.substr(1);
		informError(frm_elem);
	}
	return resp_text;
}

function evaluateSelect(correct_select, sol_elem, frm_elem) {
	resp_select = -1;
	resp_select = document.getElementById(frm_elem).selectedIndex;
	if (resp_select == correct_select) {
		informSuccess(frm_elem);
	} else {
		document.getElementById(sol_elem).innerHTML = "Correct answer: " + document.getElementById(frm_elem).getElementsByTagName("option")[correct_select].innerHTML;
		informError(frm_elem);
	}
	return resp_select;
}

function evaluateMultiple(correct_multiple, sol_elem, frm_elem) {
	resp_multiple = "";
	multiple_q = document.getElementById(frm_elem);
	multiple_o = multiple_q.getElementsByTagName('option');
	multiple_o_length = multiple_o.length;
	for (i = 0; i < multiple_o_length; i++) {
		if (multiple_o[i].selected) {
			resp_mult[i] = multiple_o[i].value;
			resp_multiple = resp_multiple + resp_mult[i];
		}
	}
	if (resp_multiple == correct_multiple) {
		informSuccess(frm_elem);
	} else {
		var correction = "Correct answer: ";
		num_resp_ok = correct_multiple.length;
		for (j = 0; j < num_resp_ok; j++) {
			idx_resp_ok = correct_multiple.charAt(j);
			idx = parseInt(idx_resp_ok);
			txt_resp_ok = multiple_q.getElementsByTagName("option")[idx].innerHTML;
			correction = correction + "<br/>" + txt_resp_ok;
		}
		document.getElementById(sol_elem).innerHTML = correction;
		informError(frm_elem);
	}
	return resp_multiple;
}

function evaluateRadio(correct_radio, sol_elem, frm_elem) {
    resp_radio = -1;
	radio_q = document.getElementById(frm_elem);
	radio_o = radio_q.getElementsByTagName('input');
	radio_o_length = radio_o.length;
	for (i = 0; i < radio_o_length; i++) {
		if (radio_o[i].checked) { //if this radio button is checked
			resp_radio = radio_o[i].value;
		}
	}
	if (resp_radio == correct_radio) {
		informSuccess(frm_elem);
	} else {
		document.getElementById(sol_elem).innerHTML = "Correct answer: " + radio_q.getElementsByTagName("label")[correct_radio].innerHTML;
		informError(frm_elem);
	}
	return resp_radio;
}

function evaluateCheckbox(correct_checkbox, sol_elem, frm_elem) {
    resp_checkbox = "";
	checkbox_q = document.getElementById(frm_elem);
	checkbox_o = checkbox_q.getElementsByTagName('input');
	checkbox_o_length = checkbox_o.length;
	for (i = 0; i < checkbox_o_length; i++) {
		if (checkbox_o[i].checked) {
			//resp_ckx[i] = checkbox_q.getElementsByTagName("input")[i].value;
			resp_ckx[i] = checkbox_o[i].value;
			resp_checkbox = resp_checkbox + resp_ckx[i];
		}
	}
	if (resp_checkbox == correct_checkbox) {
		informSuccess(frm_elem);
	} else {
		var correction = "Correct answer: ";
		num_resp_ok = correct_checkbox.length;
		for (j = 0; j < num_resp_ok; j++) {
			idx_resp_ok = correct_checkbox.charAt(j);
			idx = parseInt(idx_resp_ok);
			txt_resp_ok = checkbox_q.getElementsByTagName("label")[idx].innerHTML;
			correction = correction + "<br/>" + txt_resp_ok;
		}
		document.getElementById(sol_elem).innerHTML = correction;
		informError(frm_elem);
	}
	return resp_checkbox;
}
//****************************************************************************************************

//****************************************************************************************************
// scoreX functions (correct_solution_variable, answer_store_XML_element, form_element)
//****************************************************************************************************

function scoreText(correct_text, ans_XML_elem, frm_elem) {
	resp_text = document.getElementById(frm_elem).value;
	resp_text = resp_text.toLowerCase();
	if (resp_text == correct_text) {
		calcPuntuacion('1', '1');
	}
	var useranswer = xmlDoc.createElement("useranswer");
	useranswer.innerHTML = resp_text;
	xmlDoc.getElementById(ans_XML_elem).appendChild(useranswer);
	return resp_text;
}

function scoreSelect(correct_select, ans_XML_elem, frm_elem) {
	resp_select = -1;
	resp_select = document.getElementById(frm_elem).selectedIndex;
	if (resp_select == correct_select) {
		calcPuntuacion('1', '1');
	}
	var useranswer = xmlDoc.createElement("useranswer");
	useranswer.innerHTML = resp_select;
	xmlDoc.getElementById(ans_XML_elem).appendChild(useranswer);
	return resp_select;
}

function scoreMultiple(correct_multiple, ans_XML_elem, frm_elem) {
    	var isright = [];
	resp_multiple = "";
	multiple_q = document.getElementById(frm_elem);
	multiple_o = multiple_q.getElementsByTagName('option');
	multiple_o_length = multiple_o.length;
	for (i = 0; i < multiple_o_length; i++) {
		if (multiple_o[i].selected) {
			var useranswer = xmlDoc.createElement("useranswer");
			useranswer.innerHTML = i;
			xmlDoc.getElementById(ans_XML_elem).appendChild(useranswer);
			isright[i]=false;
			for (j=0; j < correct_multiple.length; j++) {
				if (i == correct_multiple[j]) isright[i]=true;
			}
			if (isright[i]) {calcPuntuacion('1', correct_multiple.length);}
			else {calcPuntuacion('-1', correct_multiple.length);}
		}
	}
	return resp_multiple;
}

function scoreRadio(correct_radio, ans_XML_elem, frm_elem) {
    resp_radio = -1;
	radio_q = document.getElementById(frm_elem);
	radio_o = radio_q.getElementsByTagName('input');
	radio_o_length = radio_o.length;
	for (i = 0; i < radio_o_length; i++) {
		if (radio_o[i].checked) { //if this radio button is checked
			resp_radio = radio_o[i].value;
		}
	}
	if (resp_radio == correct_radio) {
		calcPuntuacion('1', '1');
	}
	var useranswer = xmlDoc.createElement("useranswer");
	useranswer.innerHTML = resp_radio;
	xmlDoc.getElementById(ans_XML_elem).appendChild(useranswer);
	return resp_radio;
}

function scoreCheckbox(correct_checkbox, ans_XML_elem, frm_elem) {
    	var isright = [];
	resp_checkbox = "";
	checkbox_q = document.getElementById(frm_elem);
	checkbox_o = checkbox_q.getElementsByTagName('input');
	checkbox_o_length = checkbox_o.length;
	for (i = 0; i < checkbox_o_length; i++) {
		if (checkbox_o[i].checked) {
			var useranswer = xmlDoc.createElement("useranswer");
			useranswer.innerHTML = i;
			xmlDoc.getElementById(ans_XML_elem).appendChild(useranswer);
			isright[i]=false;
			for (j=0; j < correct_checkbox.length; j++) {
				if (i == correct_checkbox[j]) isright[i]=true;
			}
			if (isright[i]) {calcPuntuacion('1', correct_checkbox.length);}
			else {calcPuntuacion('-1', correct_checkbox.length);}
		}
	}
	return resp_checkbox;
}
//****************************************************************************************************

function showScore() {

	//document.getElementById("mostrar").innerHTML = 
	//	'numpreg: ' + numpreg +
	//	' score: ' + score + "<br/>" +
	//	'sol_text_1: ' + sol_text_1.charAt(0).toUpperCase() + sol_text_1.substr(1) + 
	//	' sol_select_1: ' + sol_select_1 + 
	//	' sol_multiple_1: ' + sol_multiple_1 +
	//	' sol_radio_1: ' + sol_radio_1 + 
	//	' sol_checkbox_1: ' + sol_checkbox_1 + "<br/>" +
	//	'resp_text_1: ' + resp_text_1 +
	//	' resp_select_1: ' + resp_select_1 +
	//	' resp_multiple_1: ' + resp_multiple_1 +
	//	' resp_radio_1: ' + resp_radio_1 +
	//	' resp_checkbox_1: ' + resp_checkbox_1 + "<br/>" + "<br/>" +        
	//	'sol_text_2: ' + sol_text_2 + 
	//	' sol_select_2: ' + sol_select_2 + 
	//	' sol_multiple_2: ' +  sol_multiple_2 +
	//	' sol_radio_2: ' + sol_radio_2 + 
	//	' sol_checkbox_2: ' + sol_checkbox_2 + "<br/>" +
	//	'resp_text_2: ' + resp_text_2 +
	//	' resp_select_2: ' + resp_select_2 +
	//	' resp_multiple_2: ' + resp_multiple_2 +
	//	' resp_radio_2: ' + resp_radio_2 +
	//	' resp_checkbox_2: ' + resp_checkbox_2 + "<br/>" + "<br/>"
	//  ;    
	// alert('Puntuación obtenida: ' + score + ' / ' + numpreg);

   document.getElementById('panel').style.display = "block";
   //Codigo transformacion xslt con xmlDoc y xslDoc
   if (document.implementation && document.implementation.createDocument) {
        xsltProcessor = new XSLTProcessor();
        xsltProcessor.importStylesheet(xslDoc);
        resultDocument = xsltProcessor.transformToFragment(xmlDoc, document);
        document.getElementById('panel').appendChild(resultDocument);
   }
    document.getElementById("nota").innerHTML = "Score " + score.toFixed(prec) + " / " + numpreg;
    //scroll(0,0);

   //bloquear formulario (recargar para volver a empezar)
   var f=formElement;
   var e = f.elements;
   //var len = formElement.elements.length;
   for (var i = 0, len = e.length; i < len; ++i) {
    e[i].disabled = true;
   }

}
//****************************************************************************************************
function informSuccess(su) {
	var cor_v = "cor_" + su;
	document.getElementById(cor_v).src = "img/success24.png";
	document.getElementById(cor_v).style.display = 'inline';
	var sol_v = "sol_" + su;
	document.getElementById(sol_v).style.display = 'none';
	score++;
}

function informError(er) {
	var cor_v = "cor_" + er;
	document.getElementById(cor_v).src = "img/error24.png";
	document.getElementById(cor_v).style.display = 'inline-block';
	var sol_v = "sol_" + er;
	document.getElementById(sol_v).style.display = 'inline-block';
}

function resetPuntuacion() {
	score = 0.0;
}

function calcPuntuacion(signo, base) {
	score += (signo / base);
}
