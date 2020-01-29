<?php
$q = $_SERVER['QUERY_STRING'];
$url = "https://script.google.com/macros/s/AKfycbxDp-WXzfENlaitsN6ZGAbn1-ruO2V6eUpyGkZ1FBXuWlU3YOPG/exec".$q;
echo $url;
// file_get_contents("https://script.google.com/macros/s/AKfycbxDp-WXzfENlaitsN6ZGAbn1-ruO2V6eUpyGkZ1FBXuWlU3YOPG/exec".$q);