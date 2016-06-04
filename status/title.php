<?php
$file = "nowplaying.xml";

$data = file_get_contents($file); 

function antara($string, $start, $end){
$string = " ".$string;
$ini = strpos($string,$start);
if ($ini == 0) return "";
$ini += strlen($start);
$len = strpos($string,$end,$ini) - $ini;
return substr($string,$ini,$len);
}

$artist=antara($data,'ARTIST="','" ');
$track=antara($data,'TITLE="','" ');

echo "{
	\"/live\":
		{
		\"ARTIST\" : \"$artist\",
		\"TRACK\" : \"$track\",
		}
	}";
?>