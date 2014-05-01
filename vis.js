var w = window.innerWidth/1.1;
var h = window.innerHeight/1.1;
var barHeight = 0; // set a minimum barHeight 
var scale, barWidth;

d3.select("section").append("svg");

/*
 *  Draw the bar chart
 */
var drawBarChart = function(w,h) {

	d3.json("source.json",function(error, json) {
		if(json){
					
			var drawRects = function(year){
				
				barWidth = w/json[year].length;
				
				
				/* calculate height of SVG based on size 
				 * of the dataset
				 */
				var svg = d3.select("svg")
					.attr({
						width: w,
						height: h
					});
																	
				/* Scale for bars
				*  input domain is the min and max of persons for a given year from the JSON
				*  output range extend is the height of the svg
				*/
				
				scale = d3.scale.linear()
					.domain([0, d3.max(json[year], function(d) { return d; })])
					.range([ h/1.1,20]);
				
				
			
				// create a g element for every country 
				var bars = svg.selectAll("g")
					.data(json[year])
					.enter()
					.append("g");
					
				/* 
				 * create the spacing between each g 
				 * elements which will hold the bars and their text
				 * via CSS transform
				 */	
				bars.attr("transform", function(d,i) { 
						return "translate(" + (i*barWidth) + ",0)";
					});

				// within each g element, nest a rectangle
				bars.append("rect")
					.attr({
						"height": function(d) { 
							return h - scale(d); 
						},
						"width": barWidth
					})
	 				.attr("y", function(d) { return scale(d); })
      				
					.style("fill","#75DCCD");
					
				bars.on("mouseover", function(){
					d3.select(this.firstChild).style("fill","#4DC2CA");
				});
				bars.on("mouseout", function(){
					d3.select(this.firstChild).style("fill","#75DCCD");
				});
				
				bars.append("text")
					.text(function(d) { return d; });	

		
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
	w = window.innerWidth;
	h = window.innerHeight/1.5;
	
	drawBarChart(w,h);
}

d3.select(window).on('resize', resize); 


