// This code was written by Tyler Akins and has been placed in the
// public domain.  It would be nice if you left this header intact.
// Base64 code from Tyler Akins -- http://rumkin.com

// schiller: Removed string concatenation in favour of Array.join() optimization,
//           also precalculate the size of the array needed.


function openfile(Name,response){
	var text;
//console.log(Name);
	new Ajax.Request(Name,{
	method:'get',
	asynchronous:true,
	contentType:"text/xml",
	onSuccess: function(transport){
		response(transport.responseText);
		},
	onFailure: function(){ 
		console.log('Could not load file...'); 
		response("Could not load file...\n");
	},
	onException: function(req,exception) {
		console.log(exception);
		alert("file load Exception "+Name); 
		return true;
		}, 
	});
  
}

var server=function(){				
//This can probably be made asynchronous but I have not found out how yet because window object  can only have one onmessage event handler

		//http://stackoverflow.com/questions/3076414/ways-to-circumvent-the-same-origin-policy
	// Internet Explorer
				if(window.attachEvent)window.attachEvent('onmessage',receivefile);
			  // Opera/Mozilla/Webkit
				else window.addEventListener("message", receivefile, false);
				repository=new Element('iframe',{'class':'webtronics_repository_frame','style':'display:none'});
//it's invisible so just put it anywhere
				menu.insert(repository).observe("load",function(){waiting=false;});	
			
			function requestfile(url,response){
		    	rxdata=	"";
		    	waiting=false;

					function receivefile(event){
						rxdata=event.data;											
						waiting=false;
					}
					waiting=true;
					iframe.src=url;
					while(waiting){}
					response(rxdata);			
			}
}

function encode64(input) {
    if(window.btoa){
        return window.btoa(input);
    }
// base64 strings are 4/3 larger than the original string
    var output = new Array( Math.floor( (input.length + 2) / 3 ) * 4 );
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0, p = 0;
    var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

    do {
        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);
        
        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;
        
        if (isNaN(chr2)) {
        	enc3 = enc4 = 64;
        }
        else if (isNaN(chr3)) {
    	    enc4 = 64;
        }

        output[p++] = _keyStr.charAt(enc1);
        output[p++] = _keyStr.charAt(enc2);
        output[p++] = _keyStr.charAt(enc3);
        output[p++] = _keyStr.charAt(enc4);
    } while (i < input.length);

    return output.join('');
}

function createUUID()
{
  return [7].map(function(length) {
    var uuidpart = "";
    for (var i=0; i<length; i++) {
      var uuidchar = parseInt((Math.random() * 256)).toString(16);
      if (uuidchar.length == 1)
        uuidchar = "0" + uuidchar;
      uuidpart += uuidchar;
    }
    return uuidpart;
  }).join('-');
}

