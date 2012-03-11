var user = mw.config.get( 'wgTitle' ).split('/')[0];
function processUserTools ( data ) {
	var list = (data && data.query && data.query.search) || [];
	if( list.length === 0 ){
		$('#js-info').find('a').text( 'Este editor não possui páginas de JS nem CSS' );
		return;
	} else {
		$('#js-info').remove();
	}
	list.sort( function(a,b){
		return (new Date(b.timestamp) - new Date(a.timestamp) );
	});
	$.each( data && data.query && data.query.search, function( id, result ){
		// Add a link to list the scripts of the current user
		mw.util.addPortletLink(
			'p-js-list',
			mw.util.wikiGetlink( result.title ) + '?diff=0',
			result.title.replace( new RegExp( '^.+?' + user + '\\/' ), '' )
		);
	} );
}

function getUserTools(){
	var	api = new mw.Api();
	api.get( {
		action: 'query',
		list: 'search',
		srsearch: '(intitle:.js OR intitle:.css) prefix:User:' + user,
		srnamespace: 2,
		srprop: 'timestamp',
		srlimit: 50 // Maximum allowed for 'users'
	}, {
		ok: processUserTools
	} );
}

/**
 * Customization for user pages
 */
if ( $.inArray( mw.config.get( 'wgNamespaceNumber' ), [ 2, 3 ]) > -1
	&& $.inArray( mw.config.get( 'wgAction' ), [ 'view', 'purge' ]) > -1
) {
	$(function () {
		// Create a new portlet for user scripts
		$('#p-cactions').clone().prepend('<h4>JS</h4>')
		.insertAfter('#p-namespaces').attr({
			'id': 'p-js-list',
			'class': 'vectorMenu emptyPortlet'
		}).find('li').remove().end().find('span').text('JS List');
		// Add a link to list the scripts of the current user
		$(mw.util.addPortletLink(
			'p-js-list',
			'#',
			'Obter lista...',
			'js-info'
		) ).click( function( e ){
			e.preventDefault();
			mw.loader.using( 'mediawiki.api', getUserTools);
		});

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