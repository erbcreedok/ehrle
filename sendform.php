<?php
$q = $_SERVER['QUERY_STRING'];
$url = "https://script.google.com/macros/s/AKfycbxDp-WXzfENlaitsN6ZGAbn1-ruO2V6eUpyGkZ1FBXuWlU3YOPG/exec?".$q;
$result = json_decode(file_get_contents($url))->result;
if ($result == 'success') {
    http_response_code(200);
} else {
    http_response_code(400);
}