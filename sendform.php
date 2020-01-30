<?php
$q = $_SERVER['QUERY_STRING'];
$url = "https://script.google.com/macros/s/AKfycbyMv9LcDQVTFb8Os4nQFONaxcYoLxEYyY_QqOawWXLtvHsqz8M0/exec?".$q;
$result = json_decode(file_get_contents($url))->result;
if ($result == 'success') {
    http_response_code(200);
} else {
    http_response_code(400);
}