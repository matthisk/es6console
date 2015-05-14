module.exports = class Event {
	constructor() {
		this.events = {};
	}

	on( name, callback ) {
		if( this.events.hasOwnProperty( name ) ) {
			this.events[ name ].push( callback );
		} else {
			this.events[ name ] = [ callback ];
		}
	}

	trigger( name, ...args ) {
		if( this.events.hasOwnProperty( name ) ) {
			for( var cb of this.events[ name ]) {
				cb( ...args );
			}
		}
	}
};