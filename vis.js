var w = window.innerWidth/1.1;
var h = window.innerHeight/1.5;
var scale;

d3.select("section").append("svg");

/*
 *  Draw the bar chart
 */
var drawBarChart = function(w,h) {
	
	var svg = d3.select("svg")
		.attr({
			width: w,
			height: h
		});
	
	d3.json("source.json",function(error, json) {
		if(json){
			
			var drawRects = function(year){
													
				// find the minimum and maximum value (amount of humanitarian persons) of a year
				var min = d3.min(json[year]); 
				var max = d3.max(json[year]); 
				
				
				/* Scale for bars
				*  input domain is the min and max of persons for a given year from the JSON
				*  output range extend is the height of the svg
				*/
				scale = d3.scale.linear().domain([min,max]).range([0,h]);
				
				// each country gets its own rect
				svg.selectAll("rect")
					.data(json[year])
					.enter()
					.append("rect")
					.attr({
						height: function(d){
							return d;
						},
						width: function(){
							return w/24;
						},
						x: function(d,i){
							return i;
						},
						y: function (){
							return 100;
						},
						fill: "#75DCCD"
					});
				
			};
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


