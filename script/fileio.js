function	fileio(site,partlist,menu,attach){
	
		partlist.url=site;	

				

		makemenu(site,partlist);	


//this takes an objectand returns a menu element
		  function makemenu(url, partlist){
		    for (var cat in partlist.parts){
		    	if(!$("webtronics_"+cat)){
				    var category=new Element("div",{"id":"webtronics_"+cat})
				    	.insert(new Element("p").update(cat)
				    	.observe('click',function(e){
				    	
								var menuitems=$$('#'+menu.id+'>div>div');
								
								for(var i=0;i<menuitems.length;i++){
									if(menuitems[i].parentNode==Event.element(e).parentNode){
							  		if(menuitems[i].style.display=='none'){
							    		menuitems[i].style.display='block';
							  		}
							  		else{
							    		menuitems[i].style.display='none';
							  		}
									}
									else{
							  		menuitems[i].style.display='none';
									}
								}
				    	}));
  			      menu.insertBefore(category,menu.firstChild);
 	      
		      for(var partname in partlist.parts[cat]){
							if(!$("webtronics_"+partname)){
								addpart(url , cat,partname);

							}
							//if(partlist.parts[cat][partname].indexOf()<0){}
		      }                
		      
		    }

		  }
		  }
		    

		  function addpart(url,cat,partname) {
				var listfile=function(partsvg){
				    var part=new Element("div",{"id":"webtronics_"+partname,"class":"webtronics_menu_part",'style':"display:none",'title':partname})
				    .update(partsvg);
				    $("webtronics_"+cat).insert(part);
				  	attach(part);

			  }
				

				if(url=="webtronix_server"){
		    	openfile(url+'/'+cat+'/'+partname+'.svg',listfile);
					
		    }
		    else{
		    	requestfile(url+"?file="+partname+'.svg',listfile);
		    }
		    
 		  }
				
			
	}
//////move this

