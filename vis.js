var w = window.innerWidth/5;
var h = window.innerHeight/1.5;

d3.select("section").append("svg");

/*
 *  Draw the bar chart
 */
var drawBarChart = function(w,h) {
	
	d3.select("svg")
		.attr({
			width: w,
			height: h
		});
	
	d3.json("source.json",function(error, json) {
		if(json){
			
			
			
			var drawRects = function(year){
				
				// convert strings to numbers
				for (var prop in json[year]){
					json[year][prop] = parseInt(json[year][prop]);
				}	
				
				
									
				// find the minimum and maximum value of a year
				var min = d3.min(json[year]); console.log(min);
				var max = d3.max(json[year]); console.log(max);
				
				// each country gets its own rect
				var rect = d3.selectAll("rect")
					.data(json["Source"])
					.enter()
					.append("rect");
				
			}
			drawRects(2003);
			
				
			
			}
		
		else{
			console.warn(error);
		}
	});
};

drawBarChart(w,h);

/*
 *  Resize the barchart on viewport size change
 */

function resize() {
	w = window.innerWidth/5;
	h = window.innerHeight/1.5;
	drawBarChart(w,h);
}

d3.select(window).on('resize', resize); 


