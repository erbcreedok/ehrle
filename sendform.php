<?php
$q = $_SERVER['QUERY_STRING'];
$url = "https://script.google.com/macros/s/AKfycbyMv9LcDQVTFb8Os4nQFONaxcYoLxEYyY_QqOawWXLtvHsqz8M0/exec?".$q;
$tg_api = '1003245073:AAEgjRgpNBx0a9d47g6PSGU4_OQrCcW6ur8';
$chat_id = '-1001313269104';
$message = urlencode('Имя: '.$_GET['name'].".\nМоб. телефон: ".$_GET['phone'].".\nОткуда: ".$_GET['form'].".");
$mail_url = "http://ehrle.com.kz/sendmail.php?subject=EHRLE&message=".$message;
$url_tg = "https://api.telegram.org/bot$tg_api/sendMessage?chat_id=$chat_id&text=$message";
$tg_response = file_get_contents($url_tg);
$mail_response = file_get_contents($mail_url);
$google_script_response = file_get_contents($url);
$result = json_decode($google_script_response)->result;
http_response_code(200);