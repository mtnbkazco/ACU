class Bubble{
    constructor(data){
        this.data = data.filter(function(d){ 
            if( d["Date"] == "2018-05-01"){ 
            return d;
        } 
        })
        
        this.Pricemin = d3.min(this.data, d => parseInt(d.Price))
        this.Pricemax = d3.max(this.data, d => parseInt(d.Price))
        this.BottleCountmin = d3.min(this.data, d => parseInt(d["Total Bottle Count"]))
        this.BottleCountmax = d3.max(this.data, d => parseInt(d["Total Bottle Count"]))
        this.CaseCountmin = d3.min(this.data, d => parseInt(d["Case Count (9L)"]))
        this.CaseCountmax = d3.max(this.data, d => parseInt(d["Case Count (9L)"]))
        this.TotalSalesmin = d3.min(this.data, d => parseInt(d["Total Sales"]))
        this.TotalSalesmax = d3.max(this.data, d => parseInt(d["Total Sales"]))
    }

    drawBubble(){
        console.log(this.BottleCountmin)
        console.log(this.BottleCountmax)
        //console.log(this.CaseCountmax)

        let width = 1000;
        let height = 500;

        let scalePrice = d3.scaleLinear()
            .domain([this.Pricemin, this.Pricemax])
            .range([0, height]);

        let scaleBottleCount = d3.scaleLinear()
            .domain([this.BottleCountmin, this.BottleCountmax])
            .range([height, 0]);

        let scaleCaseCount = d3.scaleLinear()
            .domain([this.CaseCountmin, this.CaseCountmax])
            .range([0, width]);

        let svg = d3.select("#my_dataviz")
            .append("svg")
            .attr("width", 1800)
            .attr("height", 1000)
            .append("g")
            .attr("transform", "translate(" + 70 + "," + 0 + ")");
        
        svg.append("g")
            .attr("transform", "translate(0," + 500 + ")")
            .call(d3.axisBottom(scaleCaseCount))
            .append("text")
            .attr("fill", "black")
            .attr("transform","translate(500, 40)")
            .text("Case Count (9L)");

        svg.append("g")
            .call(d3.axisLeft(scaleBottleCount))
            .append("text")
            .attr("fill", "black")
            .attr("transform","translate(-10, 250)")
            .text("Bottle Count");

        let scaleBubble = d3.scaleLinear()
            .domain([this.TotalSalesmin, this.TotalSalesmax])
            .range([1, 10]);

        let tooltip = d3.select("#my_dataviz")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "black")
            .style("border-radius", "5px")
            .style("font-size", "10px")
            .style("padding", "25px")
            .style("color", "white");

        svg.append('g')
            .selectAll("dot")
            .data(this.data)
            .enter()
            .append("circle")
            .attr("class", "bubbles")
            .attr("cx", d => scaleCaseCount(parseInt(d["Case Count (9L)"])))
            .attr("cy", d => scaleBottleCount(parseInt(d["Total Bottle Count"])))
            .attr("r", d => scaleBubble(parseInt(d["Total Sales"])))
            .attr("class", d => d["Class Code"].substring(0,3))
            .on("mouseover", function(event,d) {
                tooltip.transition()
                    .duration(100)
                    .style("opacity", 1);
                    tooltip.html((d["Product Name"]))
                    .style("left", (event.pageX) + "px")
                    .style("top", (event.pageY - 28) + "px");
                })
            .on("mousemove", function(event,d) {
                tooltip.transition()
                    .duration(100)
                    .style("opacity", 1);
                    tooltip.html((d["Product Name"]))
                    .style("left", (event.pageX) + "px")
                    .style("top", (event.pageY - 28) + "px");
                })
            .on("mouseout", function(d) {
                tooltip.transition()
                    .duration(1)
                    .style("opacity", 1);
            }); 
        

    }
    
}
