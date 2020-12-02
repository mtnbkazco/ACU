let svg = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", 1000)
    .attr("height", 510)
    .append("g")
    .attr("transform", "translate(" + 80 + "," + 10 + ")");

class Bubble{
    constructor(data){
        this.data = data

        this.Pricemin = d3.min(this.data, d => parseInt(d.Price))
        this.Pricemax = d3.max(this.data, d => parseInt(d.Price))
        
        //this.BottleCountmin = d3.min(this.data, d => parseInt(d["Total Bottle Count"]))
        //this.BottleCountmax = d3.max(this.data, d => parseInt(d["Total Bottle Count"]))
        
        this.CaseCountmin = d3.min(this.data, d => parseInt(d["Case Count (9L)"]))
        this.CaseCountmax = d3.max(this.data, d => parseInt(d["Case Count (9L)"]))
        
        this.TotalSalesmin = d3.min(this.data, d => parseInt(d["Total Sales"]))
        this.TotalSalesmax = d3.max(this.data, d => parseInt(d["Total Sales"]))

        this.BottleSizemin = d3.min(this.data, d => parseInt(d["Bottle Size"]))
        this.BottleSizemax = d3.max(this.data, d => parseInt(d["Bottle Size"]))

        let width = 1000;
        let height = 500;

        this.scalePrice = d3.scaleLinear()
            .domain([this.Pricemin, this.Pricemax])
            .range([0, height]);
    
        this.scaleBottleCount = d3.scaleLinear()
            .domain([this.BottleCountmin, this.BottleCountmax])
            .range([height, 0]);
    
        this.scaleCaseCount = d3.scaleLinear()
            .domain([this.CaseCountmin, this.CaseCountmax])
            .range([0, width]);
    
        this.scaleBottleSize = d3.scaleLinear()
            .domain([this.BottleSizemin, this.BottleSizemax])
            .range([1, 15]);
        
        this.scaleTotalSales = d3.scaleLinear()
            .domain([this.TotalSalesmin, this.TotalSalesmax])
            .range([height, 0]);
        this.drawBubble;
        this.updateBubble;
    }

    drawBubble(){
        let that = this;
        
        let dates = []
        this.data.map(function(d) {dates.push(d.Date)});
        let dates_set = [...new Set(dates)];
        let dates_set_sorted = dates_set.sort(function(a, b){
            return d3.ascending(new Date(a), new Date(b));
        });
        d3.select("#selectDate")
            .selectAll('myOptions')
            .data(dates_set_sorted)
            .enter().append("option")
            .text(function(d) { return d; })
            .attr("value", function (d, i) {
                return d;
            });


        let bottlesizes = []
        this.data.map(function(d) {bottlesizes.push(d["Bottle Size"])});
        let bottlesizes_set = [...new Set(bottlesizes)];
        let bottlesizes_set_sorted = bottlesizes_set.sort(function(a, b){
            return d3.ascending(parseInt(a), parseInt(b));
        });
        d3.select("#selectBottleSize")
            .selectAll('myOptions')
            .data(bottlesizes_set_sorted)
            .enter().append("option")
            .text(function(d) { return d; })
            .attr("value", function (d, i) {
                return d;
            });

        var values = ["2018-04-01", "50"];
        d3.selectAll(".filters")
            .on("change",function(d){ 
                d3.select(this)
                    .selectAll("option:checked") 
                    .each(function() {
                        if (this.value.length > 8) {
                            values.splice(0,1,this.value) //date
                        } else {
                            values.splice(1,1,this.value); //bottle size
                        }
                    });
                console.log(values)
                //console.log(values[0])
                that.updateBubble(values[1], values[0])
            })   


    };


    

    updateBubble(selectedBottleSize, selectedDate) {
            //console.log(data)
            //svg.selectAll("circle").remove();
            svg.selectAll("*").remove();
        
            var jsonCircles = [
                { "x_axis": 430, "y_axis": 0, "radius": 8, "class" : "A" },
                { "x_axis": 430, "y_axis": 30, "radius": 8, "class" : "R"},
                { "x_axis": 430, "y_axis": 60, "radius": 8, "class" : "L"}];
    
            var circles = svg.selectAll("circle")
                .data(jsonCircles)
                .enter()
                .append("circle");

            circles
                .attr("cx", function (d) { return d.x_axis; })
                .attr("cy", function (d) { return d.y_axis; })
                .attr("r", function (d) { return d.radius; })
                .attr("class", function(d) { return d.class; });

            svg.append("text")
                .attr("fill", "black")
                .attr("transform", "translate(445, 4)")
                .style("font-size","10px")
                .text("Spirits");
            svg.append("text")
                .attr("fill", "black")
                .attr("transform", "translate(445, 34)")
                .style("font-size","10px")
                .text("Beer");
            svg.append("text")
                .attr("fill", "black")
                .attr("transform", "translate(445, 64)")
                .style("font-size","10px")
                .text("Wine");



            let data_filtered = this.data.filter(function(d){ 
                if( parseInt(d["Bottle Size"]) == selectedBottleSize && (d["Date"]) == selectedDate){ 
                return d;
            }
            });
            //console.log(data_filtered)

            let width = 400;
            let height = 400;

            let filtered_scaleCaseCount = d3.scaleLinear()
                .domain([d3.min(data_filtered, d => parseInt(d["Case Count (9L)"])), d3.max(data_filtered, d => parseInt(d["Case Count (9L)"]))])
                .range([0, width]);
        
            let filtered_scaleTotalSales = d3.scaleLinear()
                .domain([d3.min(data_filtered, d => parseInt(d["Total Sales"])), d3.max(data_filtered, d => parseInt(d["Total Sales"]))])
                .range([height, 0]);


            svg.append("g")
                .attr("transform", "translate(0," + 400 + ")")
                .call(d3.axisBottom(filtered_scaleCaseCount))
                .attr("id", "xaxis")
                .append("text")
                .attr("fill", "black")
                .attr("transform","translate(200, 40)")
                .text("Case Count (9L)");
    
            svg.append("g")
                .call(d3.axisLeft(filtered_scaleTotalSales))
                .append("text")
                .attr("fill", "black")
                .attr("transform", "rotate(-90), translate(-180, -50)")
                .text("Total Sales in Dollars");
        


            let tooltip = d3.select("#my_dataviz")
                .append("div")
                .style("opacity", 0)
                .attr("class", "tooltip")
                .style("background-color", "white")
                .style("border-radius", "5px")
                .style("font-size", "10px")
                .style("border", "solid")
                .style("border-width", "2px")
                .style("border-radius", "5px")
                .style("padding", "0px")
                .style("color", "black");
        
            svg.append('g')
                .selectAll("circle")
                .data(data_filtered)
                .join("circle")
                .attr("class", "bubbles")
                .attr("cx", d => filtered_scaleCaseCount(parseInt(d["Case Count (9L)"])))
                .attr("cy", d => filtered_scaleTotalSales(parseInt(d["Total Sales"])))
                .attr("r", 8)//d => this.scaleBottleSize(parseInt(d["Bottle Size"])))
                .attr("stroke-width", "1px")
                .attr("stroke", "black")
                .attr("class", d => d["Class Code"].substring(0,1))
                .style("opacity", .8)
                .on("mouseover", function(d, event) {
                    tooltip.transition()
                        .duration(1)
                        .style("opacity", 1);
                        tooltip.html((d["Product Name"]))
                        .style("left", (d3.event.pageX - 60) + "px")
                        .style("top", (d3.event.pageY - 80) + "px");
                    })
                .on("mouseout", function(d, event) {
                    tooltip
                        .transition()
                        .duration(1)
                        .style("opacity", 0);
                });
    }
}







