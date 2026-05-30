<?php
/**
 * Server-side render for the Reading Time block (v1.0.0).
 *
 * @package Idara\ReadingTime
 *
 * @var array    $attributes  Block attributes.
 * @var string   $content     Block inner content (unused, void block).
 * @var WP_Block $block       Block instance.
 */

defined( 'ABSPATH' ) || exit;

// phpcs:disable WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound
// Reason: this file is require()'d inside WordPress's block render closure — all
// variables here are local to that closure, not in global scope.

$idara_rt_post = get_post();
if ( ! $idara_rt_post instanceof WP_Post ) {
	return;
}

/* ── Word count (per-request cache) ────────────────────────────────────── */
/**
 * CRITICAL: never call do_blocks() on $post->post_content inside a render
 * callback whose block is in that content — it causes infinite recursion.
 * We strip block markup as HTML comments instead, which is sufficient for
 * a word count.
 */
$idara_rt_word_count = ( function () use ( $idara_rt_post ) {
	static $cache = array();
	if ( isset( $cache[ $idara_rt_post->ID ] ) ) {
		return $cache[ $idara_rt_post->ID ];
	}
	$raw = preg_replace( '/<!--\s*\/?wp:[^>]*-->/', ' ', $idara_rt_post->post_content );
	$raw = strip_shortcodes( $raw );
	$raw = wp_strip_all_tags( $raw );
	$cache[ $idara_rt_post->ID ] = (int) str_word_count( $raw );
	return $cache[ $idara_rt_post->ID ];
} )();

$idara_rt_wpm     = max( 1, isset( $attributes['wordsPerMinute'] ) ? absint( $attributes['wordsPerMinute'] ) : 200 );
$idara_rt_minutes = max( 1, (int) ceil( $idara_rt_word_count / $idara_rt_wpm ) );

/* ── Smart hide ────────────────────────────────────────────────────────── */
$idara_rt_hide_short = ! empty( $attributes['hideShortPosts'] );
$idara_rt_threshold  = isset( $attributes['hideThreshold'] ) ? absint( $attributes['hideThreshold'] ) : 1;
if ( $idara_rt_hide_short && $idara_rt_minutes < $idara_rt_threshold ) {
	return;
}

/* ── Label ─────────────────────────────────────────────────────────────── */
$idara_rt_display_range = ! empty( $attributes['displayAsRange'] );
$idara_rt_spread        = isset( $attributes['rangeSpread'] ) ? absint( $attributes['rangeSpread'] ) : 1;
$idara_rt_spread        = max( 1, min( 5, $idara_rt_spread ) );

$idara_rt_prefix       = isset( $attributes['prefix'] ) ? trim( wp_strip_all_tags( $attributes['prefix'] ) ) : '';
$idara_rt_suffix       = isset( $attributes['suffix'] ) ? trim( wp_strip_all_tags( $attributes['suffix'] ) ) : __( 'min read', 'idara-reading-time' );
$idara_rt_range_suffix = isset( $attributes['rangeSuffix'] ) ? trim( wp_strip_all_tags( $attributes['rangeSuffix'] ) ) : __( 'min read', 'idara-reading-time' );

if ( $idara_rt_display_range ) {
	$idara_rt_low  = max( 1, $idara_rt_minutes - (int) ceil( $idara_rt_spread / 2 ) );
	$idara_rt_high = $idara_rt_minutes + (int) floor( $idara_rt_spread / 2 );
	$idara_rt_time = ( $idara_rt_low === $idara_rt_high )
		? (string) $idara_rt_low
		: sprintf( '%d–%d', $idara_rt_low, $idara_rt_high );
	$idara_rt_time_str = trim( $idara_rt_time . ' ' . $idara_rt_range_suffix );
} else {
	$idara_rt_time_str = trim( $idara_rt_minutes . ' ' . $idara_rt_suffix );
}

$idara_rt_label = trim( $idara_rt_prefix . ' ' . $idara_rt_time_str );

/* ── Icon ──────────────────────────────────────────────────────────────── */
$idara_rt_icon_style = isset( $attributes['iconStyle'] ) ? sanitize_key( $attributes['iconStyle'] ) : 'clock';
$idara_rt_allowed_icons = array( 'clock', 'timer', 'hourglass', 'none' );
if ( ! in_array( $idara_rt_icon_style, $idara_rt_allowed_icons, true ) ) {
	$idara_rt_icon_style = 'clock';
}

$idara_rt_icons = array(
	'clock'     => '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
	'timer'     => '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="10" y1="2" x2="14" y2="2"/><line x1="12" y1="14" x2="15" y2="11"/><circle cx="12" cy="14" r="8"/></svg>',
	'hourglass' => '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 22h14M5 2h14M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"/></svg>',
	'none'      => '',
);
$idara_rt_icon_html = $idara_rt_icons[ $idara_rt_icon_style ];

/* ── Progress bar attributes ───────────────────────────────────────────── */
$idara_rt_show_bar     = ! empty( $attributes['showProgressBar'] );
$idara_rt_bar_position = isset( $attributes['progressBarPosition'] ) && 'bottom' === $attributes['progressBarPosition'] ? 'bottom' : 'top';
$idara_rt_bar_height   = isset( $attributes['progressBarHeight'] ) ? absint( $attributes['progressBarHeight'] ) : 3;
$idara_rt_bar_height   = max( 1, min( 8, $idara_rt_bar_height ) );

// Allow hex, rgb(a), hsl(a), named — anything that's CSS-color-safe characters.
$idara_rt_raw_color = isset( $attributes['progressBarColor'] ) ? (string) $attributes['progressBarColor'] : '';
$idara_rt_bar_color = preg_replace( '/[^a-zA-Z0-9#(),.\s%\-]/', '', $idara_rt_raw_color );
if ( '' === trim( $idara_rt_bar_color ) ) {
	$idara_rt_bar_color = '#4f46e5';
}

/* ── Wrapper attributes ────────────────────────────────────────────────── */
$idara_rt_wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class'      => 'idara-rt idara-rt-icon-' . $idara_rt_icon_style,
		'aria-label' => sprintf(
			/* translators: %s: estimated reading time, e.g. "3 min read" */
			__( 'Estimated reading time: %s', 'idara-reading-time' ),
			$idara_rt_time_str
		),
	)
);

/* ── Output ────────────────────────────────────────────────────────────── */
if ( $idara_rt_show_bar ) :
	?>
	<div
		class="idara-rt-progress-wrap idara-rt-progress-<?php echo esc_attr( $idara_rt_bar_position ); ?>"
		aria-hidden="true"
		style="--idara-rt-bar-h:<?php echo (int) $idara_rt_bar_height; ?>px;--idara-rt-bar-c:<?php echo esc_attr( $idara_rt_bar_color ); ?>;"
	>
		<div class="idara-rt-progress-bar"></div>
	</div>
	<?php
endif;
?>

<p <?php echo $idara_rt_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- generated by get_block_wrapper_attributes(), a trusted WP core function ?>>

	<?php if ( 'none' !== $idara_rt_icon_style && $idara_rt_icon_html ) : ?>
		<span class="idara-rt-icon" aria-hidden="true">
			<?php
			echo wp_kses(
				$idara_rt_icon_html,
				array(
					'svg'      => array( 'width' => true, 'height' => true, 'viewBox' => true, 'fill' => true, 'stroke' => true, 'stroke-width' => true, 'stroke-linecap' => true, 'stroke-linejoin' => true ),
					'circle'   => array( 'cx' => true, 'cy' => true, 'r' => true ),
					'polyline' => array( 'points' => true ),
					'line'     => array( 'x1' => true, 'y1' => true, 'x2' => true, 'y2' => true ),
					'path'     => array( 'd' => true ),
				)
			);
			?>
		</span>
	<?php endif; ?>
	<span class="idara-rt-text"><?php echo esc_html( $idara_rt_label ); ?></span>
</p>
