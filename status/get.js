
function setrez (id, dat)
{
	var d = document.getElementById(id);
	d.innerHTML = dat;
}


function getXmlHttp() // получаем объект XMLHttpRequest, код взят из многочисленных примеров
{
  var xmlhttp;
  try {
    xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
  } catch (e) {
    try {
      xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    } catch (E) {
      xmlhttp = false;
    }
  }
  if (!xmlhttp && typeof XMLHttpRequest!='undefined') {
    xmlhttp = new XMLHttpRequest();
  }
  return xmlhttp;
}


function req () // запрос данных
{
	var xmlhttp = getXmlHttp()
	xmlhttp.open("GET", "title.php", true); // просим данные у сервера в асинхронном режиме
	xmlhttp.onreadystatechange = function() 
		{
		  if (xmlhttp.readyState == 4) {
			 if(xmlhttp.status == 200)
			   processResult(xmlhttp.responseText); // отдаём на обработку
				console.info(xmlhttp.readyState);
		}
	};
	xmlhttp.send(null);
}


function processResult (res) // обработка входящих данных
{
	var csRes = eval("(" + res + ")"); // да-да, тут должен использоваться jQuery, ибо безопасность и так далее. Но, так как это просто скрипт с примером, не буду ударяться в подробности.
	var a = []; // пустой массив, для дальнейших действий

	if (csRes["/live"] != null) // Диджей в эфире?
	{
		a = csRes["/live"]; // если да, работаем с данными от него
	}
	else // иначе берём данные от точки нон-стоп
	{
		a = csRes["/autodj"];
	}
	var trinfo = a[ARTIST] + " - " + a[TRACK];
	setrez("trackholder","Ефір: " + trinfo);
	
	setTimeout("req()", 15000);
}

req(); // первый запрос