<?php
/*
Plugin Name: Camera Record
Plugin URI: https://doroshenko.agency
Description: Запись видео камеры
Version: 0.0.1
Author: Kheyder Alexandr
Author URI: https://github.com/Doroshenko-agency
Text Domain: camerarecordwp
Domain Path: /languages
*/

/*  Copyright 2023  Kheyder Alexandr  (email: akheyder@doroshenko.agency)

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program; if not, write to the Free Software
    Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
*/

defined( 'ABSPATH' ) or die;

define( "CAMERA_RECORD_WP_DIR", plugin_dir_path( __FILE__ ) );
define( "CAMERA_RECORD_WP_URl", plugin_dir_url( __FILE__ ) );
define( "CAMERA_RECORD_WP_NAME", dirname( plugin_basename( __FILE__ ) ) );


register_activation_hook( __FILE__, "camera_record_wp_activate" );
function camera_record_wp_activate(){
    require_once CAMERA_RECORD_WP_DIR . 'includes/class-camera-record-wp-activate.php';
    Camera_Record_Wp_Activate::activate();
}

function camera_record_wp(){
    require_once CAMERA_RECORD_WP_DIR . 'includes/class-camera-record-wp.php';
    $camera_record_wp = new Camera_Record_Wp();
}

camera_record_wp();