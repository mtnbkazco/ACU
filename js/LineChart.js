let svg2 = d3.select("#my_dataviz2")
    .append("svg")
    .attr("width", 1000)
    .attr("height", 600)
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

        let data_filtered_not_sorted = this.data.filter(function(d){ 
            if((d["Product Name"]) == selectedProduct){ 
                return d;
            }
        });

        let data_filtered1 = data_filtered_not_sorted.sort(function(a, b){
            return d3.ascending(new Date(a["Date"]), new Date(b["Date"]));
        });
        console.log(data_filtered1)


        let tooltip = d3.select("#my_dataviz")
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
            .attr("transform","translate(200, 470)")
            .text("Date");

        svg2.append("g")
            .call(d3.axisLeft(filtered_scaleTotalSales1));
        svg2.append("text")
            .attr("fill", "black")
            .attr("transform","translate(-75, 210)")
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
            .on("mouseover", function(event,d) {
                tooltip.transition()
                    .duration(1)
                    .style("opacity", 1);
                    tooltip.html((d["Total Sales"]))
                    .style("left", (event.pageX - 20) + "px")
                    .style("top", (event.pageY - 20) + "px");
                })
            .on("mouseout", function(event, d) {
                tooltip
                    .transition()
                    .duration(1)
                    .style("opacity", 0.0000001);
            });



        console.log(xScale(new Date("2018-06-01")))

    }



}
