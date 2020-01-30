<?php
$q = $_SERVER['QUERY_STRING'];
$url = "https://script.google.com/macros/s/AKfycbyMv9LcDQVTFb8Os4nQFONaxcYoLxEYyY_QqOawWXLtvHsqz8M0/exec?".$q;
$tg_api = '1003245073:AAEgjRgpNBx0a9d47g6PSGU4_OQrCcW6ur8';
$chat_id = '-386742703';
$message = urlencode('Заявка: '.$_GET['name'].".\nТелефон: ".$_GET['phone']."\nФорма: ".$_GET['form']);
$url_tg = "https://api.telegram.org/bot$tg_api/sendMessage?chat_id=$chat_id&text=$message";
file_get_contents($url_tg);
$result = json_decode(file_get_contents($url))->result;
if ($result == 'success') {
    http_response_code(200);
} else {
    http_response_code(400);
}