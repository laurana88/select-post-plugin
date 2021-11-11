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
		] 		
	);
}
add_action( 'init', 'laura_select_post_block_init' );

function selectpostrender ($attributes, $content) {

	// This variable builds the HTML
	$post_markup = '';

	// This is the post selected on the edit screen
	$selectedpost = get_post($attributes['selectedPost']);

	// if a post is selected, checks the post ID. If not, displays text with no posts.
	if ($selectedpost > 0) {

		// Wrapper for the whole post
		$post_markup .= '<div class="select-post">';

		// Assigns the post's URL
		$post_link = esc_url( get_permalink( $selectedpost ) );

		// Assigns the post's featured image, and adds it to the HTML.
		// Links featured image to the post as well
		$featured_image = get_the_post_thumbnail($selectedpost);
		$featured_image = sprintf(
				'<a href="%1$s">%2$s</a>',
				$post_link,
				$featured_image
			);
		$post_markup .= sprintf(
			'<div class="%1$s">%2$s</div>',
			'select-post-image',
			$featured_image
		);

		// Assigns the post's title and adds it to HTML.
		// Links the title to the post as well
		$title = get_the_title( $selectedpost );
		$post_markup .= sprintf(
			'<h3 class="select-post-heading"><a href="%1$s">%2$s</a></h3>',
			$post_link,
			$title
		);

		// Closes the HTML
		$post_markup .= "</div>\n";
		
		// Displays the HTML
		return sprintf(
			$post_markup
		);
	} else {
		return "<p>There are no posts that meet your criteria.</p> ";
	}
}
