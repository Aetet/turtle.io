/**
 * Determines what authentication is valid (if any), and applies it to the request
 *
 * @method auth
 * @param  {Object}   req      Request Object
 * @param  {Object}   res      Response Object
 * @param  {String}   host     Virtual host
 * @param  {Function} callback Function to execute after applying optional authenication wrapper
 * @return {Object}            TurtleIO instance
 */
TurtleIO.prototype.auth = function ( req, res, host, callback ) {
	// No authentication
	if ( !this.config.auth || ( this.config.auth.basic && !this.config.auth.basic[host] ) ) {
		callback();
	}
	// Basic authentication
	else if ( this.config.auth.basic && this.config.auth.basic[host] ) {
		if ( !this.config.auth.basic[host].auth ) {
			this.config.auth.basic[host].auth = http_auth( this.config.auth.basic[host] );
		}

		this.config.auth.basic[host].auth.apply( req, res, callback );
	}

	return this;
};
