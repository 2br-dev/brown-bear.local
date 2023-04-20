<?php

header('Content-Type', 'application/json');
$error = false;

if(isset($_POST['name']) && isset($_POST['phone']) && isset($_POST['comment'])){
	$error = $_POST['name'] == '' || $_POST['phone'] == '' || $_POST['comment'] == '';
}else{
	$error = true;
}

if(!isset($_POST['agree'])){
	$mess = json_encode([
		'type' => 1,
		'message' => 'Вы должны дать согласие на сбор и обработку персональных данных'
	], JSON_UNESCAPED_UNICODE);
	die($mess);	
}

if($error){
	$mess = json_encode([
		'type' => 1,
		'message' => 'Ошибка отправки сообщения: не заполнены обязательные поля'
	], JSON_UNESCAPED_UNICODE);
	die($mess);
}

// Соединение с MODx API
define ('MODX_API_MODE', true);
require('./../../index.php');

$modx->getService('error', 'error.modError');
$modx->getLogLevel(modX::LOG_LEVEL_INFO);
$modx->setLogTarget(XPDO_CLI_MODE ? 'ECHO' : 'HTML');

$name = $_POST['name'];
$phone = $_POST['phone'];
$comment = $_POST['comment'];

$data = [
	'name' => htmlspecialchars(addslashes(strip_tags($name))),
	'phone' => htmlspecialchars(addslashes(strip_tags($phone))),
	'comment' => htmlspecialchars(addslashes(strip_tags($comment)))
];

$compiledMessage = $modx->getChunk('letter_tpl', $data);


// |===========================================================|
// |  Здесь будет процедура отправки письма                    |
// |-----------------------------------------------------------|
// |  Сформированный текст письма содержится в переменной      |
// |  $compiledMessage (в админке – чанк letter_tpl)           |
// |  плейсхолдеры: [[+name]], [[+phone]], [[+comment]]        |
// |  все поля экранированы                                    |
// |  Возвращается объект:                                     |
// |    type: 0 - успех, 1 - ошибка,                           |
// |    message: текст сообщения, отображаемого на странице    |
// |===========================================================|

$mess = json_encode([
	'type' => 0,
	'message' => 'Спасибо за Ваше обращение, мы свяжемся с Вами в ближайшее время!'
], JSON_UNESCAPED_UNICODE);

echo $mess;