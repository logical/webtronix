//en.wikibooks.org/wiki/Kicad/file_formats
function errorHandler(e) {
  var msg = '';
  switch (e.code) {
    case FileError.QUOTA_EXCEEDED_ERR:
      msg = 'QUOTA_EXCEEDED_ERR';
      break;
    case FileError.NOT_FOUND_ERR:
      msg = 'NOT_FOUND_ERR';
      break;
    case FileError.SECURITY_ERR:
      msg = 'SECURITY_ERR';
      break;
    case FileError.INVALID_MODIFICATION_ERR:
      msg = 'INVALID_MODIFICATION_ERR';
      break;
    case FileError.INVALID_STATE_ERR:
      msg = 'INVALID_STATE_ERR';
      break;
    default:
      msg = 'Unknown Error';
      break;
  };
  console.log('Error: ' + msg);
};

function wtx2kicad(){

	//if(!window.requestFileSystem)alert ("no filesystem api");
	var fs=null;

window.webkitStorageInfo.requestQuota(PERSISTENT, 1024*1024, function(grantedBytes) {
	window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
  window.requestFileSystem(PERSISTENT, grantedBytes, function(filesystem) {
				fs = filesystem;
	},errorHandler);
}, errorHandler);


  fs.root.getDirectory('Webtronix', {create: true}, function(dirEntry) {
  
  
  fs.root.getFile('Webtronix/Schematic.sch', {create: true}, function(fileEntry) {

    // Create a FileWriter object for our FileEntry (log.txt).
    fileEntry.createWriter(function(fileWriter) {

      fileWriter.onwriteend = function(e) {
        console.log('Write completed.');
      };

      fileWriter.onerror = function(e) {
        console.log('Write failed: ' + e.toString());
      };

      // Create a new Blob and write it to log.txt.
      var blob = new Blob(['Lorem Ipsum'], {type: 'text/plain'});

      fileWriter.write(blob);

    }, errorHandler);

  }, errorHandler);
 
}, errorHandler);



}
/*
<wtx:part xmlns:wtx="http://code.google.com/p/webtronics" >
    <wtx:pins>
		<wtx:analog>
		  <wtx:node index="1" x="0" y="10"></wtx:node>
		  <wtx:node index="2" x="40" y="10"></wtx:node>
		</wtx:analog>
    </wtx:pins>
    <wtx:id>r</wtx:id>
    <wtx:type>r</wtx:type>
    <wtx:name>resistor</wtx:name>
    <wtx:category>resistors</wtx:category>
    <wtx:value></wtx:value>
    <wtx:label></wtx:label>
    <wtx:spice></wtx:spice>
    <wtx:flip></wtx:flip>
    <wtx:model></wtx:model>
</wtx:part>
*/
/*
#
# BATTERY
#
DEF BATTERY BT 0 0 Y Y 1 F N
F0 "BT" 0 200 50 H V C CNN
F1 "BATTERY" 0 -190 50 H V C CNN
F2 "" 0 0 60 H V C CNN
F3 "" 0 0 60 H V C CNN
DRAW
C 0 0 150 0 1 6 N
P 2 0 1 0  -100 0  -150 0 N
P 2 0 1 6  -100 90  -100 -89 N
P 2 0 1 6  -31 50  -31 -50 N
P 2 0 1 6  39 90  39 -89 N
P 2 0 1 0  100 0  150 0 N
P 2 0 1 6  100 50  100 -50 N
X + 1 -300 0 150 R 50 50 1 1 P
X - 2 300 0 150 L 50 50 1 1 P
ENDDRAW
*/

function part2lib(part){





}



function wtxparts2kicadlib(){
				webtronics.serverurls.each(function(url){
					if(url=="webtronix_server"){
						openfile(url+"/parts.json",function(text){
							webtronics.partslists.push(text.evalJSON(true));
							webtronics.partslists[webtronics.partslists.length-1].url=url;
							readlist(url,webtronics.partslists[webtronics.partslists.length-1]);
						});
					
						}
				else{
						new request(url,"parts.json",function(text){
							webtronics.partslists.push(text.evalJSON(true));
							webtronics.partslists[webtronics.partslists.length-1].url=url;
							readlist(url,webtronics.partslists[webtronics.partslists.length-1]);
							});
		
					}
		    for (var cat in partlist.parts){
		      for(var partname in partlist.parts[cat]){
								webtronics.addpart(url , cat,partname);

							//if(partlist.parts[cat][partname].indexOf()<0){}
		      }                
		      
		    }
			}.bind(this));

}
