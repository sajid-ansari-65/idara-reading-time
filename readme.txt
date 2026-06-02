=== Idara Reading Time ===
Contributors:      sajidansari65
Tags:              reading time, gutenberg block, progress bar, blog, fse
Requires at least: 6.4
Tested up to:      7.0
Stable tag:        1.0.0
Requires PHP:      7.4
License:           GPLv2 or later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

Show estimated reading time with an optional scroll progress bar. A lightweight, FSE-ready Gutenberg block that loads only where used.

== Description ==

**Idara Reading Time** is a focused, single-purpose Gutenberg block that does one thing well: shows readers how long your post will take. It also offers an optional scroll progress bar — a thin bar pinned to the top or bottom of the page that fills as the visitor scrolls.

*Idara (إدارة) is an Arabic word meaning "studio" or "administration" — the brand behind a growing family of carefully crafted, single-purpose Gutenberg blocks.*

= Why this and not a full block suite? =

Most block plugins ship 30+ blocks you'll never use, slowing your editor and your frontend. Idara plugins are deliberately small. This one is under 25 KB. CSS and JS load **only on pages where the block is present** — never globally.

= Features =

* Estimated reading time, calculated server-side from your post content
* Display as a single value ("3 min read") or a friendly range ("2–3 min read")
* Adjustable words-per-minute (50–600)
* 4 icon styles: clock, timer, hourglass, or none
* Optional scroll progress bar with color, height, and position (top/bottom)
* Hide on short posts (e.g. don't show on anything under 2 minutes)
* Custom prefix and suffix text
* Inherits theme typography and text color via block supports
* Full Site Editing (FSE) compatible — works inside block templates and template parts
* Block toolbar shortcuts for icon cycling and range toggle
* Semantic, accessible markup with ARIA labels
* No tracking, no external requests, no third-party services
* Translation-ready

= Use cases =

* Blog posts where readers want to gauge time investment
* Long-form articles where the scroll progress bar improves engagement
* Documentation sites
* News and magazine layouts

== Installation ==

1. Upload the plugin folder to `/wp-content/plugins/`, or install via **Plugins → Add New → Upload Plugin**
2. Activate the plugin through the **Plugins** menu
3. Open any post or page in the block editor
4. Insert the **Reading Time** block where you want it displayed
5. Configure icon, format, and progress bar from the block settings sidebar

== Frequently Asked Questions ==

= How is reading time calculated? =

The plugin strips block markup, shortcodes, and HTML from the post content, counts the remaining words, and divides by your chosen words-per-minute setting (default 200). The minimum displayed value is 1 minute.

= Does it work with Full Site Editing block themes? =

Yes. You can place the block inside any block template or template part — for example, inside a "Single Post" template just below the Post Title block.

= Will this slow down my site? =

No. The entire plugin is under 25 KB, ships no jQuery, and makes zero external requests. Its CSS and JavaScript are enqueued **only on pages that actually contain the block** — never site-wide — so pages without it load exactly as before.

= Does the scroll progress bar affect performance? =

The frontend script is a tiny vanilla JavaScript file (under 1 KB) using a passive scroll listener and requestAnimationFrame. It is enqueued only on pages where the block is present.

= Can I style the block? =

Yes. The block fully supports WordPress block color and typography controls. The frontend uses simple class names: `.idara-rt`, `.idara-rt-icon`, `.idara-rt-text`, `.idara-rt-progress-wrap`, and `.idara-rt-progress-bar`.

= Does this plugin track users or send data anywhere? =

No. Everything runs locally on your site. No external requests, no analytics, no tracking.

= How do I display reading time as a range? =

In the block settings sidebar, click the "Range" button under Format. You can then choose how wide the range should be (1 to 5 minutes spread).

== Screenshots ==

1. Block in the WordPress block inserter — find it by searching "Reading Time"
2. Block selected in the editor with toolbar shortcuts for icon cycling and range toggle
3. Block settings sidebar — Display, Calculation, Scroll progress bar, and Advanced panels
4. Display panel — icon style picker (clock, timer, hourglass, or none), Single/Range format toggle, and custom prefix/suffix fields
5. Calculation panel — adjustable words-per-minute (default 200 WPM) and hide-on-short-posts toggle
6. Scroll progress bar panel — enable toggle, live mini-preview, position (top/bottom), height, and color picker
7. Frontend — reading time with clock icon displayed in a post, with scroll progress bar visible at the bottom of the page
8. Frontend — reading time with hourglass icon displayed below the post title in a blog layout

== Development ==

Source code and build tools are available on GitHub:
https://github.com/sajid-ansari-65/idara-reading-time

The `src/` directory contains the unminified JavaScript (ES modules, JSX) and SCSS. Run `npm install && npm run build` to compile.

== Changelog ==

= 1.0.0 =
* Initial release
