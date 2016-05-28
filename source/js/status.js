function set (id, dat)
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
	xmlhttp.open("GET", "js/get.php", true); // просим данные у сервера в асинхронном режиме
	xmlhttp.onreadystatechange = function() 
		{
		  if (xmlhttp.readyState == 4) {
			 if(xmlhttp.status == 200)
			   processResult(xmlhttp.responseText); // отдаём на обработку
		}
	};
	xmlhttp.send(null);
}


function processResult (res) // обработка входящих данных
{
	var csRes = eval("(" + res + ")"); // да-да, тут должен использоваться jQuery, ибо безопасность и так далее. Но, так как это просто скрипт с примером, не буду ударяться в подробности.
	var a = []; // пустой массив, для дальнейших действий

// У меня на радио два маунтпоинта - собственно эфир (/stream) и тот, который играет, пока нет диджеев (/ns).
	if (csRes["/live"] != null) // Диджей в эфире?
	{
		a = csRes["/live"]; // если да, работаем с данными от него
		set("sName", "Керований ефір"); // графа "режим" на страничке радио
	}
	else // иначе берём данные от точки нон-стоп
	{
		a = csRes["/autodj"];
		set("sName", "AutoDJ (робот)"); // графа "режим" на страничке
	}
	
	//set("line_text", a["title"]);
	ttitle = a["title"];
	tracktitle = ttitle.replace(/' '/gi, "\&nbsp\;"); //заміна пробілів на нерозривні;
	//alert ("Трек " + a["title"]);
	set("trackholder", tracktitle); // Отображаем текущий трек
       // Задаём все нужные нам поля (жанр, кол-во слушателей, описание станции и т.д.);
	//set("sGenre", a["genre"]);
	//set("sListeners", a["listeners"]);
	//set("sDescr", a["description"]);

	setTimeout("req()", 15000); // Если всё прошло удачно, через 15 секунд обновим информацию о станции
// Здесь вместо setInterval используем setTimeout, чтобы при неработающем icecast скрипт не просил данные впустую.
}

req(); // первый запрос