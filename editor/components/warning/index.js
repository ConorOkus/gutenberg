/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { Children } from '@wordpress/element';
import { Dropdown, IconButton, NavigableMenu, Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import './style.scss';

function Warning( { primaryActions, children, hiddenActions } ) {
	return (
		<div className="editor-warning">
			<div className="editor-warning__contents">
				<div className="editor-warning__message">{ children }</div>

				{ Children.count( primaryActions ) > 0 && (
					<div className="editor-warning__actions">
						{ Children.map( primaryActions, ( action, i ) => (
							<span key={ i } className="editor-warning__action">
								{ action }
							</span>
						) ) }
					</div>
				) }
			</div>

			{ hiddenActions && (
				<div className="editor-warning__hidden">
					<Dropdown
						position="bottom left"
						renderToggle={ ( { onToggle, isOpen } ) => {
							const toggleClassname = classnames( 'editor-block-settings-menu__toggle', 'is-visible', {
								'is-opened': isOpen,
							} );
							const label = isOpen ? __( 'Hide Options' ) : __( 'More Options' );

							return (
								<IconButton
									className={ toggleClassname }
									icon="ellipsis"
									label={ label }
									onClick={ onToggle }
									aria-expanded={ isOpen }
								/>
							);
						} }
						renderContent={ () => (
							<NavigableMenu
								className="components-dropdown-menu__menu editor-warning__hidden-menu"
								role="menu"
							>
								<p className="editor-warning__hidden-label">{ __( 'More options' ) }</p>
								{ hiddenActions.map( ( item, pos ) =>
									<Button
										role="menuitem"
										className="components-dropdown-menu__menu-item"
										onClick={ item.onClick }
										key={ pos }>
										{ item.title }
									</Button>
								) }
							</NavigableMenu>
						) }
					/>
				</div>
			) }
		</div>
	);
}

export default Warning;
