<?php
/**
 * Plugin Name:       Select Post
 * Description:       Insert Description here.
 * Requires at least: 5.8
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            Laura Smith
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       select-post
 *
 * @package           create-block
 */

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/block-editor/tutorials/block-tutorial/writing-your-first-block-type/
 */
function laura_select_post_block_init() {
	register_block_type( __DIR__,
		[
			'render_callback' => 'selectpostrender',
			'attributes' => [
				'selectedPost' => [
					'type' => 'number',
					'default' => 0
				]
			]
		] 		
	);
}
add_action( 'init', 'laura_select_post_block_init' );

function selectpostrender ($attributes, $content) {
	$str = '';
	if ($attributes['selectedPost'] > 0) {
		$post = get_post($attributes['selectedPost']);
		$featured_image = get_post_thumbnail_id($post);
		$size = 'large';
		$imageurl = wp_get_attachment_image_src( $featured_image, $size)[0];

		if (!$post) {
			return "there is no post with that ID";
		}
		$str = '<div class = "selectpostrenderblock">';
		$str .= '<a href="' . get_the_permalink($post) . '">';
		$str .= '<img src="' . $imageurl . '">';
		$str .= '<h3>' . get_the_title($post) . '</h3>';
		$str .= '</a>';
		$str .= '</div>';
	}
	return $str;
}
