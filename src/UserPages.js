/**
 * Customize user pages
 * @author: [[User:Helder.wiki]]
 * @tracking: [[Special:GlobalUsage/User:Helder.wiki/Tools/UserPages.js]] ([[File:User:Helder.wiki/Tools/UserPages.js]])
 */
/*jslint browser: true, white: true*/
/*global mediaWiki, jQuery */
( function ( mw, $ ) {
'use strict';

var user = mw.config.get( 'wgTitle' ).split('/')[0];
function processUserTools ( data ) {
	var	pages = (data.query && data.query.pages) || {},
		userRegex = new RegExp( '^.+?' + $.escapeRE( user ) + '\\/' ),
		list = [];
	/*jslint unparam: true*/
	$.each( pages, function( pageid, page ){
		if( /\.(j|cs)s$/g.test( page.title ) ){
			list.push( [
				page.title,
				Date.parse( page.revisions[0].timestamp )
			] );
		}
	});
	/*jslint unparam: false*/
	if( list.length === 0 ){
		$('#js-info').find('a')
			.text( 'Este editor não possui páginas de JS nem CSS' );
		return;
	}
	$('#js-info').remove();
	list.sort( function(a,b){
		return b[1] - a[1];
	});
	/*jslint unparam: true*/
	$.each( list, function( id, page ){
		// Add a link to list the scripts of the current user
		var $item = $(mw.util.addPortletLink(
			'p-js-list',
			mw.util.wikiGetlink( page[0] ) + '?diff=0',
			page[0].replace( userRegex, '' )
		));
		if ( ( ( new Date() ).getTime() - page[1] ) / 86400000 > 7 ){
			$item.find('a').css('color', 'gray');
		}
	} );
	/*jslint unparam: false*/
}

function getUserTools(){
	var api = new mw.Api();
	api.get( {
		prop: 'revisions',
		rvprop: 'timestamp|size',
		generator: 'allpages',
		gapprefix: user,
		gapnamespace: 2,
		gaplimit: 500,
		gapminsize: 1 // Avoid blank subpages
	})
	.done( processUserTools );
}

function customizeUserPage() {
	// Create a new portlet for user scripts
	$('#p-cactions').clone()
		.prepend('<h4>JS</h4>')
		.insertAfter('#p-namespaces').attr({
			'id': 'p-js-list',
			'class': 'vectorMenu emptyPortlet'
		}).find('li')
			.remove().end()
			.find('span').text('JS List');

	// Add a link to list the scripts of the current user
	$(mw.util.addPortletLink(
		'p-js-list',
		'#',
		'Obter lista...',
		'js-info'
	) ).add('#p-js-list h4, #p-js-list h5').one( 'click', function( e ){
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
		$('#mw-content-text *').filter(function() {
			// MediaWiki has no fixed elements inside of #bodyContent
			return $( this ).css( 'position' ) === 'fixed';
		}).css( 'position', 'static');
	}
}

/**
 * Customization for user pages
 */
if ( $.inArray( mw.config.get( 'wgNamespaceNumber' ), [ 2, 3 ]) > -1
	&& $.inArray( mw.config.get( 'wgAction' ), [ 'view', 'purge' ]) > -1
) {
	$( customizeUserPage );
}

}( mediaWiki, jQuery ) );