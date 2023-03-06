<?php

class Camera_Record_Wp_Activate {

    private static function create() : string
    {
        return "
        CREATE TABLE IF NOT EXISTS `wp_camera_record_wp` 
        (
            `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID записи' , 
            `enabled_video` TINYINT(1) NOT NULL DEFAULT '1' COMMENT 'Подключаем видео' , 
            `enabled_audio` TINYINT(1) NOT NULL DEFAULT '1' COMMENT 'Подключаем аудио' , 
            `video_width` INT NOT NULL DEFAULT '1024' COMMENT 'Ширина видео' , 
            `video_height` INT NOT NULL DEFAULT '768' COMMENT 'Высота видео' , 
            `bit_audio` INT NOT NULL DEFAULT '128000' COMMENT 'Частота ритма' , 
            `bit_video` INT NOT NULL DEFAULT '2048000' COMMENT 'Частота кадров' , 
            `type_video` VARCHAR(50) NOT NULL DEFAULT 'video/webm' COMMENT 'Тип видео' , 
            `max_size` INT NOT NULL DEFAULT '52428800' COMMENT 'Макс. размер файла' , 
            `url_save` VARCHAR(255) NOT NULL DEFAULT '/record-camera-upload' COMMENT 'Ссылка на сохранение файла' , 
            PRIMARY KEY (`id`)
        ) 
            ENGINE = InnoDB CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT = 'Запись видео';
        ";
    }

    private static function insert() : string
    {
        return "
        INSERT INTO `wp_camera_record_wp` (`id`) VALUES (NULL); 
        ";
    }

    public static function activate()
    {
        global $wpdb;
        $wpdb->query(static::create());
        $wpdb->query(static::insert());
    }

}