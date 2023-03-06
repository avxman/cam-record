<?php

if( ! defined( "WP_UNINSTALL_PLUGIN" ) ){
    exit;
}

global $wpdb;
$wpdb->query( 'DROP TABLE IF EXISTS `wp_camera_record_wp`' );