/**
 * External dependencies
 */
import TestUtils from 'react-dom/test-utils';

/**
 * WordPress dependencies
 */
import { Component } from '@wordpress/element';

/**
 * Internal dependencies
 */
import withFocusOutside from '../';
import ReactDOM from 'react-dom';

jest.useFakeTimers();

let wrapper, callback;

describe( 'withFocusOutside', () => {
	const EnhancedComponent = withFocusOutside(
		class extends Component {
			handleFocusOutside() {
				this.props.onFocusOutside();
			}

			render() {
				return (
					<div>
						<input />
						<input type="button" />
					</div>
				);
			}
		}
	);

	// this is needed because TestUtils does not accept a stateless component.
	// anything run through a HOC ends up as a stateless component.
	const getTestComponent = ( WrappedComponent, props ) => {
		class TestComponent extends Component {
			render() {
				return <WrappedComponent { ...props } />;
			}
		}
		return <TestComponent />;
	};

	const simulateEvent = ( event, position = 0 ) => {
		const element = TestUtils.scryRenderedDOMComponentsWithTag( wrapper, 'input' );
		TestUtils.Simulate[ event ]( element[ position ] );
	};

	beforeEach( () => {
		callback = jest.fn();
		wrapper = TestUtils.renderIntoDocument(
			getTestComponent( EnhancedComponent, { onFocusOutside: callback } )
		);
	} );

	it( 'should not call handler if focus shifts to element within component', () => {
		simulateEvent( 'focus' );
		simulateEvent( 'blur' );
		simulateEvent( 'focus', 1 );

		jest.runAllTimers();

		expect( callback ).not.toHaveBeenCalled();
	} );

	it( 'should not call handler if focus transitions via click to button', () => {
		simulateEvent( 'focus' );
		simulateEvent( 'mouseDown', 1 );
		simulateEvent( 'blur' );

		// In most browsers, the input at index 1 would receive a focus event
		// at this point, but this is not guaranteed, which is the intention of
		// the normalization behavior tested here.
		simulateEvent( 'mouseUp', 1 );

		jest.runAllTimers();

		expect( callback ).not.toHaveBeenCalled();
	} );

	it( 'should call handler if focus doesn\'t shift to element within component', () => {
		simulateEvent( 'focus' );
		simulateEvent( 'blur' );

		jest.runAllTimers();

		expect( callback ).toHaveBeenCalled();
	} );

	it( 'should cancel check when unmounting while queued', () => {
		simulateEvent( 'focus' );
		simulateEvent( 'input' );

		/* eslint-disable react/no-find-dom-node */
		ReactDOM.unmountComponentAtNode( ReactDOM.findDOMNode( wrapper ).parentNode );
		/* eslint-enable react/no-find-dom-node */

		jest.runAllTimers();

		expect( callback ).not.toHaveBeenCalled();
	} );
} );
