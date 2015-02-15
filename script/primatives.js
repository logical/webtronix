Schematic.prototype.createtext = function(str,color,x,y){
  var svg;

	svg = document.createElementNS(this.svgNs, 'text');
	svg.setAttributeNS(null, 'x', x);
	svg.setAttributeNS(null, 'y', y);
	svg.setAttributeNS(null, 'font-size', this.fontsize);
	svg.setAttributeNS(null, 'fill', color);
	svg.setAttributeNS(null, 'stroke-width', '0px');
	
	svg.appendChild(document.createTextNode(str));
	return svg;
}


Schematic.prototype.createtspan=function(str,dx,dy){
   	var tspan = document.createElementNS(this.svgNs, 'tspan');
   	tspan.setAttributeNS(null, 'dx', dx);
   	tspan.setAttributeNS(null, 'dy', dy);
    tspan.appendChild(document.createTextNode(str));
    return tspan;    
}


Schematic.prototype.createline = function(lineColor,lineWidth,left, top,right,bottom){
  var svg;

				
  svg = document.createElementNS(this.svgNs, 'line');
	
  svg.setAttributeNS(null, 'x1', left);
  svg.setAttributeNS(null, 'y1', top);
	svg.setAttributeNS(null, 'x2', right);
	svg.setAttributeNS(null, 'y2', bottom );
 
  if (lineColor.length == 0)
    lineColor = 'none';
  svg.setAttributeNS(null, 'stroke', lineColor);
  svg.setAttributeNS(null, 'stroke-width', lineWidth);
      
  return svg;

}

Schematic.prototype.createrect = function(color,opacity,x, y,width,height){

 	var svg = document.createElementNS(this.svgNs, 'rect');
	svg.setAttributeNS(null, 'x', x);
 	svg.setAttributeNS(null, 'y', y);
  	svg.setAttributeNS(null, 'width', width);
  	svg.setAttributeNS(null, 'height', height);
	svg.setAttributeNS(null, 'fill-opacity', opacity);
 	svg.setAttributeNS(null, 'fill', color);
  	svg.setAttributeNS(null, 'stroke', color);
  	svg.setAttributeNS(null, 'stroke-width', '1');
	return svg;

}


Schematic.prototype.createdot =function(lineColor,x,y,radius){

  var svg;

				
  svg = this.container.ownerDocument.createElementNS(this.svgNs, 'circle');
  svg.setAttributeNS(null, 'cx', x);
  svg.setAttributeNS(null, 'cy', y);
  svg.setAttributeNS(null, 'r', radius );

  if (lineColor.length == 0)
    lineColor = 'none';
  svg.setAttributeNS(null, 'stroke', lineColor);
  svg.setAttributeNS(null, 'fill', lineColor);
      
  return svg;
}


