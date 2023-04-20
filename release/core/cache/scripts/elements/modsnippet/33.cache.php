<?php  return '$phones=$modx->getOption(\'phones\');
$phone_array = explode(\',\', $phones);
$links = "";

foreach($phone_array as $phone){
    $num = trim($phone);
    $link = str_replace(" ", "", $num);
    $link = str_replace("-", "", $link);
    $link = str_replace("(", "", $link);
    $link = str_replace(")", "", $link);
    
    $data = [
        \'link\' => $link,
        \'num\' => $num
    ];
    
    $links.=$modx->getChunk($tpl, $data);
}

return $links;
return;
';