//en.wikibooks.org/wiki/Kicad/file_formats
function wtx2kicad(){
	alert("under development!");
	return;
	
	var kicad=beginning;
	var parts=$$("#display > svg > g");
	var wire=$$("#display > svg >line");
	var connect=$$("#display > svg > circle");	
	
	for(var i=0;i<parts.length;i++){
		//var partname=
		kicad+="$Comp\n";
	
	
	
	
	
	
		kicad+="$EndComp\n";  
	}
	
	
	for(var i=0;i<wire.length;i++){
		kicad+="Wire Wire Line\n\t"+wire[i].getAttribute("x1")+"  "+wire[i].getAttribute("y1")+"  "+wire[i].getAttribute("x2")+"  "+wire[i].getAttribute("y2")+"\n";  
	}

	for(var i=0;i<connect.length;i++){
		kicad+="Connection ~ "+connect[i].getAttribute("cx")+"  "+connect[i].getAttribute("cy")+"\n";  
	}

	kicad+="$EndSCHEMATC"
	console.log(kicad);
	return kicad;
	
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
