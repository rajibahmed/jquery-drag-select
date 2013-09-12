// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;(function ( $, window, document, undefined ) {

		// Create the defaults once
		var pluginName = "rajib",
				defaults = {
				allow: ".allow",
				deny: ".deny"
		};

		// The actual plugin constructor
		function Plugin ( element, options ) {
				this.element = element;
				// jQuery has an extend method which merges the contents of two or
				// more objects, storing the result in the first object. The first object
				// is generally empty as we don't want to alter the default options for
				// future instances of the plugin
				this.options = $.extend( {}, defaults, options );
				this._defaults = defaults;
				this._name = pluginName;
				this.init();
		}

		Plugin.prototype = {
				init: function () {
						var self = this;
						var select = $(this.element)
							.addClass('hide')
							.find('option')
							.map(function(indx,data){
								return { id:$(data).val(), text:$(data).text()}
							});
					
						var item = _.template($('#row').html());
						
						$.each(select,function(idx,option){
							var row = item(option);
							addItem(row);
						});

						$('.allow').on('add.allow',removeItem);
						$('.deny').on('add.deny',removeItem);
						
						function addItem(row){
							$(row)
							.on('click','.allow',function(e){
								var cItem = $(this).closest('.item').clone(true,true).end().remove();
								cItem.find('.allow,.deny')
									.addClass('hide')
								.end()
									.find('.back')
									.removeClass('hide');
								$('div.allow').append(cItem).trigger('add.allow');
							})
							.on('click','.deny',function(e){
								var cItem = $(this).closest('.item').clone(true,true).end().remove();
								cItem.find('.allow,.deny')
									.addClass('hide')
								.end()
									.find('.back')
									.removeClass('hide');
								$('div.deny').append(cItem).trigger('add.deny');
							})
							.insertAfter(self.element);
						}
						function removeItem(){
							$(this).find('.back').on('click',function(e){
								var cItem = $(this).closest('.item').clone(true).end().remove();
								cItem.find('.allow,.deny')
									.removeClass('hide')
								.end()
									.find('.back')
									.addClass('hide');
								
								addItem(cItem);
								$(self.element).after(cItem);
							});
						}
				}
		};

		// A really lightweight plugin wrapper around the constructor,
		// preventing against multiple instantiations
		$.fn[ pluginName ] = function ( options ) {
				return this.each(function() {
						if ( !$.data( this, "plugin_" + pluginName ) ) {
								$.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
						}
				});
		};

})( jQuery, window, document );
