<?php
if(count($_POST) > 0) {
echo "Dados submetidos por POST:" . "<br>";
foreach($_POST as $key=>$post_data) {
echo $key . " = " . $post_data . "<br>";
}
}
if(count($_GET) > 0) {
echo "Dados submetidos por GET:" . "<br>";
foreach($_GET as $key=>$get_data) {
echo $key . " = " . $get_data . "<br>";
}
}
?>
