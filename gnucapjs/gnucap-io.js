
  
//       var statusElement = document.getElementById('gnucap_scope_display_div');
//       var progressElement = document.getElementById('progress');
//       var spinnerElement = document.getElementById('spinner');
      var spicenetlist="";
 
      Module = {
	preRun: [function(){
	  FS.writeFile("/temp",spicenetlist);
		 }],
        postRun:[function(){
		 }],
	arguments:["-b","/temp"],
        print:function(text) {
	    text = Array.prototype.slice.call(arguments).join(' ');
	    postMessage(text+'\n');
	    },
	printErr: function(text) {
          text = Array.prototype.slice.call(arguments).join(' ');
          if (0) { // XXX disabled for safety typeof dump == 'function') {
            dump(text + '\n'); // fast, straight to the real console
          } else {
            console.log(text);
          }
	      
       },
//        canvas: document.getElementById('canvas'),
        setStatus: function(text) {
	  if (!Module.setStatus.last) Module.setStatus.last = { time: Date.now(), text: '' };
          if (text === Module.setStatus.text) return;
          var m = text.match(/([^(]+)\((\d+(\.\d+)?)\/(\d+)\)/);
          var now = Date.now();
          if (m && now - Date.now() < 30) return; // if this is a progress update, skip it if too soon
       if (m) {
            text = m[1];
          } else {
//code is finished
	      if (!text){
		postMessage("SIMULATION COMPLETED");
		}
          }
        },
      };
      self.addEventListener("message", function(e) {
	spicenetlist=e.data
      // the passed-in data is available via e.data
	importScripts("gnucap-ugly.js");
      }, false);
      Module.TOTAL_MEMORY=67108864;
      Module.setStatus('Downloading...');
