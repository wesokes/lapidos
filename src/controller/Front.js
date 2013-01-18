Ext.define('Lapidos.controller.Front', {
	extend: 'Ext.util.Observable',
	requires:[
		'Lapidos.mixin.Event',
		'Lapidos.controller.request.Parser',
		'Lapidos.controller.response.Manager',
	],
	
	config: {
		requestParser: null,
		responseManager: null,
        request: null,
        response: null,
        server: null
	},
	
	constructor: function(config) {
		this.callParent(arguments);
		this.initConfig(config);
		this.initRequestParser();
		this.initResponseManager();
	},
	
	initRequestParser: function() {
		this.setRequestParser(new Lapidos.controller.request.Parser({
            request: this.request
        }));
		this.getRequestParser().parse();
	},
	
	initResponseManager: function() {
		this.setResponseManager(new Lapidos.controller.response.Manager({
            response: this.response
        }));
	},
	
	run: function() {
		var moduleName = this.getRequestParser().getModuleName();
		var controllerName = this.getRequestParser().getControllerName();
		var actionName = this.getRequestParser().getActionName();
		
		// Look for controller class
		var controllerClassName = 'Lapidos.' + moduleName + '.controller.' + controllerName;
		var errorControllerClassName = moduleName + '.controller.Error';
		try {
			Ext.require(controllerClassName, function() {
//				var controllerClass = Ext.create(controllerClassName, {
//					frontController: this,
//					action: actionName
//				});
			}.bind(this));
			
			var controllerClass = Ext.create(controllerClassName, {
				frontController: this,
				action: actionName
			});
		}
		catch(e) {
            this.responseManager.send404();
		}
	}
	
});
