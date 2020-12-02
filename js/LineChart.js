let svg2 = d3.select("#my_dataviz2")
    .append("svg")
    .attr("width", 1000)
    .attr("height", 510)
    .append("g")
    .attr("transform", "translate(" + 80 + "," + 10 + ")");

class Line_Chart{
    constructor(data){
        this.data = data
    }

    drawLine(){
        let that = this;
        
        let names = []
        this.data.map(function(d) {names.push(d["Product Name"])});
        let names_set = [...new Set(names)];
        let names_set_sorted = names_set.sort(function(a, b){
            return d3.ascending(a,b);
        });
        d3.select("#selectName")
            .selectAll('myOptions')
            .data(names_set_sorted)
            .enter().append("option")
            .text(function(d) { return d; })
            .attr("value", function (d, i) {
                return d;
            });


        d3.select("#selectName")
            .on("change",function(d){
                console.log(this.value)
                that.updateLine(this.value)
            });
    }



    updateLine(selectedProduct) {
        //console.log(data)
        //svg.selectAll("circle").remove();
        svg2.selectAll("*").remove();
  
        var jsonCircles = [
            { "x_axis": 430, "y_axis": 0, "radius": 8, "class" : "A" },
            { "x_axis": 430, "y_axis": 30, "radius": 8, "class" : "R"},
            { "x_axis": 430, "y_axis": 60, "radius": 8, "class" : "L"}];

        var circles = svg2.selectAll("circle")
            .data(jsonCircles)
            .enter()
            .append("circle");

        circles
            .attr("cx", function (d) { return d.x_axis; })
            .attr("cy", function (d) { return d.y_axis; })
            .attr("r", function (d) { return d.radius; })
            .attr("class", function(d) { return d.class; });

        svg2.append("text")
            .attr("fill", "black")
            .attr("transform", "translate(445, 4)")
            .style("font-size","10px")
            .text("Spirits");
        svg2.append("text")
            .attr("fill", "black")
            .attr("transform", "translate(445, 34)")
            .style("font-size","10px")
            .text("Beer");
        svg2.append("text")
            .attr("fill", "black")
            .attr("transform", "translate(445, 64)")
            .style("font-size","10px")
            .text("Wine");


        let data_filtered_not_sorted = this.data.filter(function(d){ 
            if((d["Product Name"]) == selectedProduct){ 
                return d;
            }
        });

        let data_filtered1 = data_filtered_not_sorted.sort(function(a, b){
            return d3.ascending(new Date(a["Date"]), new Date(b["Date"]));
        });
        console.log(data_filtered1)


        let tooltip1 = d3.select("#my_dataviz2")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip1")
            .style("background-color", "white")
            .style("border-radius", "1px")
            .style("font-size", "10px")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "0px")
            .style("color", "black");


        let width = 400;
        let height = 400;
    
        let filtered_scaleTotalSales1 = d3.scaleLinear()
            .domain([0, d3.max(data_filtered1, d => parseInt(d["Total Sales"]))])
            .range([height, 0]);

        var xScale = d3.scaleTime()
            .domain([new Date("2018-04-01"), new Date("2020-09-01")])
            .range([0, width]);
        
        var xAxis = d3.axisBottom(xScale)
            .tickFormat(d3.timeFormat("%b-%Y"));

        svg2.append("g")
            .attr("transform", "translate(0," + 400 + ")")
            .call(xAxis.ticks(20))
            .attr("id", "xaxis")
            .selectAll("text")	
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)");
        svg2.append("text")
            .attr("fill", "black")
            .attr("transform","translate(185, 470)")
            .style("font-size","11px")
            .text("Date");

        svg2.append("g")
            .call(d3.axisLeft(filtered_scaleTotalSales1));
        svg2.append("text")
            .attr("fill", "black")
            .attr("transform", "rotate(-90), translate(-240, -45)")
            .style("font-size","11px")
            .text("Total Sales");

        svg2.append("path")
            .datum(data_filtered1)
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
              .x(d => xScale(new Date(d["Date"])))
              .y(d => filtered_scaleTotalSales1(parseInt(d["Total Sales"])))
              )
      


        svg2.append('g')
            .selectAll("circle")
            .data(data_filtered1)
            .join("circle")
            .attr("class", "bubbles")
            .attr("cx", d => xScale(new Date(d["Date"])))
            .attr("cy", d => filtered_scaleTotalSales1(parseInt(d["Total Sales"])))
            .attr("r", 8)//d => this.scaleBottleSize(parseInt(d["Bottle Size"])))
            .attr("stroke-width", "1px")
            .attr("stroke", "black")
            .attr("class", d => d["Class Code"].substring(0,1))
            .style("opacity", 1)
            .on("mouseover", function(d, event) {
                tooltip1.transition()
                    .duration(1)
                    .style("opacity", 1);
                    tooltip1.html((d["Total Sales"]))
                    .style("left", (d3.event.pageX - 40) + "px")
                    .style("top", (d3.event.pageY - 40) + "px");
                })
            .on("mouseout", function(d, event) {
                tooltip1
                    .transition()
                    .duration(1)
                    .style("opacity", 0.0000001);
            });



        console.log(xScale(new Date("2018-06-01")))

    }



}
