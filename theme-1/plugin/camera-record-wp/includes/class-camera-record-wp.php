<?php
class Camera_Record_Wp {

    private Camera_Record_Wp_Admin $admin;

    private Camera_Record_Wp_Frontend $frontend;

    public function __construct(){

        $this->includeFiles();
        $this->admin = $this->initializationAdmin();
        $this->frontend = $this->initializationFrontend();

    }

    private function includeFiles(){
        include_once CAMERA_RECORD_WP_DIR . 'admin/class-camera-record-wp-admin.php';
        include_once CAMERA_RECORD_WP_DIR . 'frontend/class-camera-record-wp-frontend.php';
    }

    private function initializationAdmin(){
        return new Camera_Record_Wp_Admin();
    }

    private function initializationFrontend(){
        return new Camera_Record_Wp_Frontend();
    }

}