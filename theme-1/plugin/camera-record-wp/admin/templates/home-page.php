<?php $data = Camera_Record_Wp_Admin::getData(); ?>

<div class="wrap">

    <h1><?php _e('Camera Record', 'camerarecordwp') ?></h1>
    <?php echo(implode(',', $data)); ?>
    
</div>