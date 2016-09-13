<?php
$ch = curl_init();
curl_setopt ($ch, CURLOPT_URL, 'http://eu.radioboss.fm:8036/status.xsl');
curl_setopt ($ch, CURLOPT_RETURNTRANSFER, 1);
$contents = curl_exec($ch);
curl_close($ch);

// display file
echo iconv("ISO-8859-1", "UTF-8", $contents);

echo $contents;
?>