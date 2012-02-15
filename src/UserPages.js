/**
 * Customization for user pages
 */
if ( $.inArray( mw.config.get( 'wgNamespaceNumber' ), [ 2, 3 ]) > -1
	&& $.inArray( mw.config.get( 'wgAction' ), [ 'view', 'purge' ]) > -1
) {
	$(function () {
		// Add a link to list the scripts of the current user
		mw.util.addPortletLink(
			'p-namespaces',
			mw.util.wikiGetlink( 'Special:Search/intitle:js prefix:User:' + mw.config.get( 'wgTitle' ).split('/')[0] ),
			'JS',
			'ca-user-js',
			'Pesquisar scripts deste editor'
		);
		if ( mw.config.get( 'wgTitle' ).indexOf( mw.config.get( 'wgUserName' ) ) === -1 ) {
			var html = $('#firstHeading').html();
			// Restore original title of user pages
			if ( html !== mw.config.get( 'wgPageName' ) ) {
				$( '#firstHeading' ).html( mw.config.get( 'wgPageName' ).replace(/_/g, ' ') );
			}
			// Fix positioning of fixed images such as [[File:Diz não ao IP.svg]] used by some users
			$('#bodyContent *').filter(function(index) {
				// MediaWiki has no fixed elements inside of #bodyContent
				return $( this ).css( 'position' ) === 'fixed';
			}).css( 'position', 'static');
		}
	});
}