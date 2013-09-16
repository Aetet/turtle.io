/**
 * Determines what authentication is valid (if any), and applies it to the request
 *
 * @method auth
 * @param  {Object}   req  Request Object
 * @param  {Object}   res  Response Object
 * @param  {String}   host Virtual host
 * @param  {Function} next Function to execute after applying optional authenication wrapper
 * @return {Object}        TurtleIO instance
 */
TurtleIO.prototype.auth = function ( req, res, host, next ) {
	var self = this,
	    kerberos;

	// No authentication
	if ( !this.config.auth || ( ( this.config.auth.basic && !this.config.auth.basic[host] ) && ( this.config.auth.kerberos && !this.config.auth.kerberos[host] ) ) ) {
		next();
	}
	// Basic
	else if ( this.config.auth.basic && this.config.auth.basic[host] ) {
		if ( !this.config.auth.basic[host].auth ) {
			this.config.auth.basic[host].auth = http_auth( this.config.auth.basic[host] );
		}

		this.config.auth.basic[host].auth.apply( req, res, next );
	}
	// Kerberos
	// @todo in progress - don't use in production!
	else if ( this.config.auth.kerberos && this.config.auth.kerberos[host] ) {
		if ( !req.headers["www-authenticate"] ) {
			this.respond( req, res, this.messages.NO_CONTENT, this.codes.UNAUTHORIZED, {"WWW-Authenticate": "Negotiate, Basic realm=\"" + this.config.auth.kerberos[host].realm + "\""} );
		}
		else {
			kerberos = new Kerberos();

			kerberos.authGSSClientInit( this.config.auth.kerberos[host].kdc, Kerberos.GSS_C_MUTUAL_FLAG, function ( e, context ) {
				if ( e || !context.response ) {
					self.error( req, res, self.codes.SERVER_ERROR );
				}
				else {
					kerberos.authGSSClientStep( context, function ( e, result ) {
						if ( e ) {
							self.error( req, res, self.codes.SERVER_ERROR );
						}
						else {
							console.log( result );
							next();
						}
					} );
				}
			} );
		}
	}

	return this;
};
