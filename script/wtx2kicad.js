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
	alert("this feature is still in development");return;
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

//webtronix parts contain path|circle|rect|line|text

function wtxparts2kicadlib(){

	var kicadlib="";
	var parts=webtronics.circuit.svgRoot.getElementsByTagName("g").uniq();		
	for(var part in parts){
		var kicadpart="";
		
//locate the pins
		var kicadpins="";
    var nodes = webtronics.circuit.getwtxtagname(part,"node");
    nodes.sort(function(a,b){if (a.index > b.index)return 1;if (a.index < b.index)return -1;return 0;});
    for(var pin in nodes){
    	//find the line that is this pin
    	var kicadpin="x ~ "+ webtronics.circuit.getwtxattribute(pin,"index") ;
    	var point={x:webtronics.getwtxattribute(pin,"x"),y:webtronics.getwtxattribute(pin,"y")};
    	var lines={};
    	for(var l in part.getElementsByTagName("line")){
				var x1 = l.getAttribute("x1");
				var y1 = l.getAttribute("y1");
				var x2 = l.getAttribute("x2");
				var y2 = l.getAttribute("y2");

//pin end
				if((Math.abs(x1-point.x)<5)&&(Math.abs(y1-point.y)<5))kicadpin+=" "+ (x1*10) +" "+(y1*10);
				else if((Math.abs(x1-point.x)<5)&&(Math.abs(y1-point.y)<5))kicadpin+=" "+ (x2*10) +" "+(y2*10);
				else continue;
//pin length 
				if(x1 == x2) kicadpin += " " + (y1-y2*10); 					
				else kicadpin += " " + (x1-x2*10);
			
//pin direction					
				if(point.y<y2)kicadpin+=" D";
				else if(point.y > y2)kicadpin+=" U";
				else if(point.x < x2)kicadpin+=" R";
				else  kicadpin += " L";
//finish	
				kicadpin += " 40 40 1 1 U";
			
				kicadpins += kicadpin + "\n"; 



    	
    	}  
		}
		kicadpart+=kicadpins;
    
  	
		var elems=part.getElementsByTagName("*")
		for(elem in elems){
			switch(elem.tagName){
				case "path":
					
					
					break;
				case "text":
					
					
					break;
				case "rect":
					
					
					break;
				case "line":
					
					
					break;	
				case "circle":
				
				
					break;
				default:
					console.log(elem.tagName+ " not recognized");
					break;
			}
		}
		kicadlib += kicadpart;
	} 
	console.log(kicadlib);
	return kicadlib;
}








