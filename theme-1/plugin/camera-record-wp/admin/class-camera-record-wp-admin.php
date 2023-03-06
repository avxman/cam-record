<?php

class Camera_Record_Wp_Admin{

    protected static array $data = [];

    protected static function data(){
        global $wpdb;
        static::$data = $wpdb->get_row("SELECT * FROM `wp_camera_record_wp` ORDER BY `id` DESC LIMIT 1;", ARRAY_A);
    }
    
    public function __construct(){
        
        add_action( "admin_menu", [$this, "adminMenu"] );
                
    }

    public function adminMenu(){
        add_menu_page(
            __('The recording of the camera', 'camerarecordwp'),
            __('Camera Rec', 'camerarecordwp'),
            'manage_options',
            'camera-record-wp-page',
            [$this, 'homePage'],
            'dashicons-video-alt2'
        );
    }

    public function homePage(){
        require_once CAMERA_RECORD_WP_DIR . 'admin/templates/home-page.php';
    }

    public static function getData(){
        static::data();
        return static::$data;
    }

}