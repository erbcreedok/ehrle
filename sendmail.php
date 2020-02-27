<?php
require_once('PHPMailer/class.phpmailer.php');

$mail = new PHPMailer;
$mail->isSMTP();                                      // Set mailer to use SMTP
$mail->Host = 'mail.ehrle.com.kz';                     // Specify main and backup SMTP servers
$mail->SMTPAuth = true;                               // Enable SMTP authentication
$mail->Username = 'info@ehrle.com.kz';                 // SMTP username
$mail->Password = 'TjbmL8082k';                      // SMTP password
$mail->SMTPSecure = 'no';                            // Enable TLS encryption, `ssl` also accepted
$mail->Port = 25;                                    // TCP port to connect to

$mail->From = 'info@ehrle.com.kz';
$mail->FromName = 'EHRLE';
$mail->addAddress('erbcreedok@gmail.com', 'a');     // Add a recipient
$mail->addAddress('aydar.dj@gmail.com', 'a');
$mail->addAddress('info@ehrle.com.kz', 'a');
$mail->addReplyTo('info@ehrle.com.kz', 'a');
$mail->CharSet = 'UTF-8';

$mail->isHTML(true);                                  // Set email format to HTML
$subject = $_GET['subject'];
$message = $_GET['message'];

$mail->Subject = $subject;
$mail->Body    = $message;
$mail->AltBody = $message;

if (!$mail->send()) {
    echo 'error';
} else {
    echo 'success';
};