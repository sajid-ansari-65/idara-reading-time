/**
 * Idara Reading Time — frontend view script.
 *
 * Auto-enqueued by WordPress only on pages where the block is present
 * (via `viewScript` in block.json). Handles the scroll progress bar
 * animation. No dependencies, vanilla JS, passive listener + rAF.
 */
( function () {
	'use strict';

	var wrap = document.querySelector( '.idara-rt-progress-wrap' );
	if ( ! wrap ) {
		return;
	}

	var bar = wrap.querySelector( '.idara-rt-progress-bar' );
	if ( ! bar ) {
		return;
	}

	// Move wrap to <body> so position:fixed is always relative to the viewport,
	// not to a transformed/will-change ancestor (common in page-builder themes).
	document.body.appendChild( wrap );

	var ticking = false;

	function update() {
		var doc = document.documentElement;
		var top = window.scrollY || doc.scrollTop || 0;
		var h   = doc.scrollHeight - doc.clientHeight;
		var pct = h > 0 ? Math.min( 100, ( top / h ) * 100 ) : 0;
		bar.style.width = pct.toFixed( 2 ) + '%';
		ticking = false;
	}

	window.addEventListener(
		'scroll',
		function () {
			if ( ! ticking ) {
				window.requestAnimationFrame( update );
				ticking = true;
			}
		},
		{ passive: true }
	);

	update();
} )();
