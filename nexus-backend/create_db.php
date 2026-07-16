<?php
try {
    $db = new PDO('mysql:host=127.0.0.1;port=3306', 'root', 'kenshin2006');
    $db->exec('CREATE DATABASE IF NOT EXISTS nexus');
    echo 'DB ready' . PHP_EOL;
} catch (PDOException $e) {
    echo 'Error: ' . $e->getMessage() . PHP_EOL;
}
