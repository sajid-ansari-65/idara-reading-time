<?php
/**
 * Plugin Name:       Idara Reading Time
 * Plugin URI:        https://github.com/sajid-ansari-65/idara-reading-time
 * Description:       A lightweight Gutenberg block that shows estimated reading time with optional scroll progress bar. FSE-ready, no bloat, loads only where used.
 * Version:           1.0.0
 * Requires at least: 6.4
 * Requires PHP:      7.4
 * Author:            Mohammad Sajid Ansari
 * Author URI:        https://profiles.wordpress.org/sajidansari65/
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       idara-reading-time
 *
 * @package Idara\ReadingTime
 */

defined( 'ABSPATH' ) || exit;

define( 'IDARA_READING_TIME_VERSION', '1.0.0' );
define( 'IDARA_READING_TIME_PATH', plugin_dir_path( __FILE__ ) );

/**
 * Register the block and enable JS translations for the editor script.
 *
 * register_block_type() reads build/block.json and wires up:
 *  - editorScript / editorStyle  (admin only)
 *  - viewScript                  (frontend, only on pages with this block)
 *  - style                       (frontend + editor)
 *  - render callback
 */
function idara_reading_time_init(): void {
	register_block_type( IDARA_READING_TIME_PATH . 'build' );

	wp_set_script_translations(
		'idara-reading-time-editor-script',
		'idara-reading-time',
		IDARA_READING_TIME_PATH . 'languages'
	);
}
add_action( 'init', 'idara_reading_time_init' );
