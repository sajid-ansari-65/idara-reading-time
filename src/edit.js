import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InspectorControls,
	BlockControls,
} from '@wordpress/block-editor';
import {
	PanelBody,
	RangeControl,
	TextControl,
	ToggleControl,
	ColorPicker,
	Button,
	ButtonGroup,
	Tooltip,
	ToolbarGroup,
	ToolbarButton,
	__experimentalSpacer as Spacer,
	__experimentalDivider as Divider,
	__experimentalText as Text,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';

/* ── Icon SVGs ──────────────────────────────────────────────────────────── */
const ICONS = {
	clock: (
		<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
			<circle cx="12" cy="12" r="10" />
			<polyline points="12 6 12 12 16 14" />
		</svg>
	),
	timer: (
		<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
			<line x1="10" y1="2" x2="14" y2="2" />
			<line x1="12" y1="14" x2="15" y2="11" />
			<circle cx="12" cy="14" r="8" />
		</svg>
	),
	hourglass: (
		<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
			<path d="M5 22h14M5 2h14M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
		</svg>
	),
	none: (
		<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
			<line x1="5" y1="12" x2="19" y2="12" />
		</svg>
	),
};

/* ── Helpers ────────────────────────────────────────────────────────────── */
function countWords( html ) {
	const text = html.replace( /<[^>]+>/g, ' ' ).trim();
	if ( ! text ) return 0;
	return text.split( /\s+/ ).filter( Boolean ).length;
}

function buildLabel( { minutes, prefix, suffix, rangeSuffix, displayAsRange, rangeSpread } ) {
	let timeStr;
	if ( displayAsRange ) {
		const low  = Math.max( 1, minutes - Math.ceil( rangeSpread / 2 ) );
		const high = minutes + Math.floor( rangeSpread / 2 );
		timeStr    = low === high ? `${ low }` : `${ low }–${ high }`;
		return [ prefix, `${ timeStr } ${ rangeSuffix }` ].filter( Boolean ).join( ' ' );
	}
	return [ prefix, `${ minutes } ${ suffix }` ].filter( Boolean ).join( ' ' );
}

/* ── Edit component ─────────────────────────────────────────────────────── */
export default function Edit( { attributes, setAttributes } ) {
	const {
		wordsPerMinute,
		prefix,
		suffix,
		rangeSuffix,
		displayAsRange,
		rangeSpread,
		hideShortPosts,
		hideThreshold,
		iconStyle,
		showProgressBar,
		progressBarColor,
		progressBarHeight,
		progressBarPosition,
	} = attributes;

	const wordCount = useSelect( ( select ) => {
		const content = select( 'core/editor' )?.getEditedPostAttribute( 'content' ) ?? '';
		return countWords( content );
	}, [] );

	const minutes = Math.max( 1, Math.ceil( wordCount / ( wordsPerMinute || 200 ) ) );
	const label   = buildLabel( { minutes, prefix, suffix, rangeSuffix, displayAsRange, rangeSpread } );
	const isHidden = hideShortPosts && minutes < hideThreshold;

	const blockProps = useBlockProps( {
		className: `idara-rt idara-rt-icon-${ iconStyle }`,
	} );

	/* Icon picker ──────────────────────────────────────────── */
	const IconPicker = () => (
		<div className="idara-rt-icon-picker">
			<Text size={ 11 } weight={ 600 } upperCase className="idara-rt-section-label">
				{ __( 'Icon style', 'idara-reading-time' ) }
			</Text>
			<div className="idara-rt-icon-grid">
				{ Object.keys( ICONS ).map( ( key ) => (
					<Tooltip
						key={ key }
						text={ key === 'none' ? __( 'No icon', 'idara-reading-time' ) : key }
					>
						<Button
							className={ `idara-rt-icon-btn ${ iconStyle === key ? 'is-active' : '' }` }
							onClick={ () => setAttributes( { iconStyle: key } ) }
							aria-pressed={ iconStyle === key }
							aria-label={ key }
						>
							{ ICONS[ key ] }
						</Button>
					</Tooltip>
				) ) }
			</div>
		</div>
	);

	/* Progress bar preview ─────────────────────────────────── */
	const ProgressBarPreview = () => (
		<div className="idara-rt-progress-preview">
			<div className="idara-rt-progress-preview-window">
				<div className="idara-rt-progress-preview-dots">
					<span /><span /><span />
				</div>
				<div
					className="idara-rt-progress-preview-bar"
					style={ {
						background: progressBarColor,
						height: `${ progressBarHeight }px`,
						top: progressBarPosition === 'top' ? 0 : 'auto',
						bottom: progressBarPosition === 'bottom' ? 0 : 'auto',
					} }
				/>
				<div className="idara-rt-progress-preview-content">
					<div /><div /><div style={ { width: '60%' } } />
				</div>
			</div>
			<Text size={ 11 } className="idara-rt-preview-caption">
				{ __( 'Live preview', 'idara-reading-time' ) }
			</Text>
		</div>
	);

	return (
		<>
			{ /* ── BLOCK TOOLBAR ── */ }
			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton
						icon={ ICONS[ iconStyle === 'clock' ? 'timer' : 'clock' ] }
						label={ __( 'Cycle icon style', 'idara-reading-time' ) }
						onClick={ () => {
							const order = [ 'clock', 'timer', 'hourglass', 'none' ];
							const next  = order[ ( order.indexOf( iconStyle ) + 1 ) % order.length ];
							setAttributes( { iconStyle: next } );
						} }
					/>
					<ToolbarButton
						icon={
							<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
								<line x1="6" y1="12" x2="18" y2="12" />
								{ displayAsRange && <line x1="6" y1="16" x2="14" y2="16" /> }
							</svg>
						}
						isPressed={ displayAsRange }
						label={ __( 'Toggle range display', 'idara-reading-time' ) }
						onClick={ () => setAttributes( { displayAsRange: ! displayAsRange } ) }
					/>
				</ToolbarGroup>
			</BlockControls>

			{ /* ── INSPECTOR SIDEBAR ── */ }
			<InspectorControls>

				{ /* === DISPLAY === */ }
				<PanelBody title={ __( 'Display', 'idara-reading-time' ) } initialOpen={ true }>

					<IconPicker />

					<Spacer marginTop={ 4 } marginBottom={ 4 }>
						<Divider />
					</Spacer>

					<Text size={ 11 } weight={ 600 } upperCase className="idara-rt-section-label">
						{ __( 'Format', 'idara-reading-time' ) }
					</Text>
					<ButtonGroup className="idara-rt-format-toggle">
						<Button
							variant={ ! displayAsRange ? 'primary' : 'secondary' }
							onClick={ () => setAttributes( { displayAsRange: false } ) }
						>
							{ __( 'Single', 'idara-reading-time' ) }
						</Button>
						<Button
							variant={ displayAsRange ? 'primary' : 'secondary' }
							onClick={ () => setAttributes( { displayAsRange: true } ) }
						>
							{ __( 'Range', 'idara-reading-time' ) }
						</Button>
					</ButtonGroup>

					{ displayAsRange && (
						<>
							<Spacer marginTop={ 3 } />
							<RangeControl
								label={ __( 'Range spread', 'idara-reading-time' ) }
								help={ __( 'How many minutes wide the range should be.', 'idara-reading-time' ) }
								value={ rangeSpread }
								onChange={ ( v ) => setAttributes( { rangeSpread: v } ) }
								min={ 1 }
								max={ 5 }
								step={ 1 }
							/>
						</>
					) }

					<Spacer marginTop={ 4 } marginBottom={ 4 }>
						<Divider />
					</Spacer>

					<TextControl
						label={ __( 'Prefix', 'idara-reading-time' ) }
						value={ prefix }
						onChange={ ( v ) => setAttributes( { prefix: v } ) }
						placeholder={ __( 'e.g. Reading time:', 'idara-reading-time' ) }
					/>
					<TextControl
						label={ displayAsRange ? __( 'Suffix (range)', 'idara-reading-time' ) : __( 'Suffix', 'idara-reading-time' ) }
						value={ displayAsRange ? rangeSuffix : suffix }
						onChange={ ( v ) => setAttributes( displayAsRange ? { rangeSuffix: v } : { suffix: v } ) }
					/>
				</PanelBody>

				{ /* === CALCULATION === */ }
				<PanelBody title={ __( 'Calculation', 'idara-reading-time' ) } initialOpen={ false }>
					<RangeControl
						label={ __( 'Words per minute', 'idara-reading-time' ) }
						help={ __( 'Average adult reads ~200 WPM.', 'idara-reading-time' ) }
						value={ wordsPerMinute }
						onChange={ ( v ) => setAttributes( { wordsPerMinute: v } ) }
						min={ 50 }
						max={ 600 }
						step={ 10 }
					/>
					<Spacer marginTop={ 3 } />
					<ToggleControl
						label={ __( 'Hide on short posts', 'idara-reading-time' ) }
						help={ hideShortPosts
							? __( 'Block is hidden when reading time is under the threshold.', 'idara-reading-time' )
							: __( 'Always show the block.', 'idara-reading-time' )
						}
						checked={ hideShortPosts }
						onChange={ ( v ) => setAttributes( { hideShortPosts: v } ) }
					/>
					{ hideShortPosts && (
						<RangeControl
							label={ __( 'Hide if under (minutes)', 'idara-reading-time' ) }
							value={ hideThreshold }
							onChange={ ( v ) => setAttributes( { hideThreshold: v } ) }
							min={ 1 }
							max={ 10 }
							step={ 1 }
						/>
					) }
				</PanelBody>

				{ /* === PROGRESS BAR === */ }
				<PanelBody
					title={ __( '✨ Scroll progress bar', 'idara-reading-time' ) }
					initialOpen={ false }
					className="idara-rt-progress-panel"
				>
					<div className="idara-rt-hero-callout">
						<Text size={ 12 } className="idara-rt-hero-text">
							{ __( 'A thin bar at the top of your post that fills as readers scroll. Makes content feel more engaging.', 'idara-reading-time' ) }
						</Text>
					</div>

					<Spacer marginTop={ 3 } />

					<ToggleControl
						label={ __( 'Enable progress bar', 'idara-reading-time' ) }
						checked={ showProgressBar }
						onChange={ ( v ) => setAttributes( { showProgressBar: v } ) }
					/>

					{ showProgressBar && (
						<>
							<Spacer marginTop={ 3 } marginBottom={ 3 }>
								<Divider />
							</Spacer>

							<ProgressBarPreview />

							<Spacer marginTop={ 4 } />

							<Text size={ 11 } weight={ 600 } upperCase className="idara-rt-section-label">
								{ __( 'Position', 'idara-reading-time' ) }
							</Text>
							<ButtonGroup className="idara-rt-format-toggle">
								<Button
									variant={ progressBarPosition === 'top' ? 'primary' : 'secondary' }
									onClick={ () => setAttributes( { progressBarPosition: 'top' } ) }
								>
									{ __( 'Top', 'idara-reading-time' ) }
								</Button>
								<Button
									variant={ progressBarPosition === 'bottom' ? 'primary' : 'secondary' }
									onClick={ () => setAttributes( { progressBarPosition: 'bottom' } ) }
								>
									{ __( 'Bottom', 'idara-reading-time' ) }
								</Button>
							</ButtonGroup>

							<Spacer marginTop={ 4 } />

							<RangeControl
								label={ __( 'Height (px)', 'idara-reading-time' ) }
								value={ progressBarHeight }
								onChange={ ( v ) => setAttributes( { progressBarHeight: v } ) }
								min={ 1 }
								max={ 8 }
								step={ 1 }
							/>

							<Spacer marginTop={ 3 } />

							<Text size={ 11 } weight={ 600 } upperCase className="idara-rt-section-label">
								{ __( 'Color', 'idara-reading-time' ) }
							</Text>
							<ColorPicker
								color={ progressBarColor }
								onChange={ ( c ) => setAttributes( { progressBarColor: c } ) }
								enableAlpha={ false }
							/>
						</>
					) }
				</PanelBody>
			</InspectorControls>

			{ /* ── EDITOR PREVIEW ── */ }
			<p { ...blockProps } data-idara-rt-hidden={ isHidden ? 'true' : 'false' }>
				{ iconStyle !== 'none' && (
					<span className="idara-rt-icon" aria-hidden="true">
						{ ICONS[ iconStyle ] }
					</span>
				) }
				<span className="idara-rt-text">{ label }</span>
				{ isHidden && (
					<span className="idara-rt-hidden-badge">
						{ __( 'hidden on frontend', 'idara-reading-time' ) }
					</span>
				) }
			</p>
		</>
	);
}
