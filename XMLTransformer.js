/**
 * @author mmazo
 */
function XMLTransformer(){
	
	var t = this;
		
	/*
	 * XML content
	 */
	this.data = null;
	
	/*
	 * XSL template
	 */
	this.template = null;
	
	/*
	 * gets the content and displays it
	 */
	this.render = function(xmlUrl, xslUrl, targetId){
		loadXMLDoc({
			succFunc : function(con){
				t.data = con;
				loadXMLDoc({
					succFunc : function(con){
						t.template = con;
						transformXML(targetId);
					},
					url : xslUrl
				});
			},
			url : xmlUrl
		});
	};
			
	/*
	 * loads data from server
	 */
    function loadXMLDoc(params){
		jQuery.ajax({
			type: "GET",
			dataType: "xml",
			url: params.url,
			success: function(msg){
				if (params.succFunc) {
					params.succFunc(msg);
				}
			},
			error: function(msg){
				if (params.errorFunc) {
					params.errorFunc(msg);
				}
			}
		});
	}
	
	/*
	 * transforms the XML data into HTML content using XSL transformation
	 * template
	 */
	function transformXML(trgId){
		// code for IE
		if (window.ActiveXObject){
		  var ex =  t.data.transformNode(t.template);
		  document.getElementById(trgId).innerHTML = ex;
		}
		// code for Mozilla, Firefox, Opera, etc.
		else if (document.implementation && 
		         document.implementation.createDocument){
		  var xsltProcessor = new XSLTProcessor();
		  xsltProcessor.importStylesheet(t.template);
		  resultDocument = xsltProcessor.transformToFragment(t.data,document);
		  document.getElementById(trgId).appendChild(resultDocument);
	    }
	}
}