class CategoriesChart {
    constructor(categoryData, spiritsData, wineData, beerData) {
        this.categoryData = categoryData;
        this.spiritsData = spiritsData;
        this.wineData = wineData;
        this.beerData = beerData;

        this.vizWidth = 900;
        this.vizHeight = 600;
        this.margin = {
            bottom: 20,
            top: 20,
            left: 40,
            right: 300
        }

        this.colorScale = null;

        this.heightDomainMax = 50000000

        // Configure the category reset button
        let that = this;
        d3.select("#categoryResetButton")
            .on('click', () => {
                that.drawTable(null);
            });
    }

    drawTable(category) {
        d3.select("#categoryResetButton")
            .style("display", "none");
        let svg = d3.select("#categories-plot");
        svg.selectAll("*").remove();

        svg.attr('height', this.vizHeight)
            .attr('width', this.vizWidth);

        if (category === null) {
            this.drawMainCategories();
        } else {
            this.drawSubCategories(category);
        }
    }

    drawMainCategories() {
        // Make the scales
        let heightScale = d3.scaleLinear()
            .domain([0, this.heightDomainMax])
            .range([this.vizHeight - this.margin.bottom, this.margin.top]);

        let widthScale = d3.scaleBand()
            .domain(this.categoryData.map(d => d.month))
            .range([this.margin.left, this.vizWidth - this.margin.right])
            .padding(.2);

        // Draw the axis
        let yAxis = g => g
            .attr("transform", `translate(${this.margin.left},0)`)
            .call(d3.axisLeft(heightScale).ticks(null, "s"))
            .call(g => g.selectAll(".domain").remove())

        let xAxis = g => g
            .attr("transform", `translate(0,${this.vizHeight - this.margin.bottom})`)
            .call(d3.axisBottom(widthScale).tickSizeOuter(0))
            .call(g => g.selectAll(".domain").remove())

        let svg = d3.select("#categories-plot");

        svg.append('g')
            .call(yAxis);

        svg.append('g')
            .call(xAxis);

        let that = this;

        // Add the bars
        // Wine
        svg.append('g')
            .selectAll('rect')
            .data(this.categoryData)
            .join('rect')
            .attr('x', d => widthScale(d.month))
            .attr('y', d => heightScale(d.totals.wine))
            .attr('height', d => heightScale(0) - heightScale(d.totals.wine))
            .attr('width', widthScale.bandwidth())
            .classed('wine', true)
            .on('click', () => {
                that.drawTable('wine');
            });

        // Beer
        svg.append('g')
            .selectAll('rect')
            .data(this.categoryData)
            .join('rect')
            .attr('x', d => widthScale(d.month))
            .attr('y', d => heightScale(d.totals.beer) - (heightScale(0) - heightScale(d.totals.wine)))
            .attr('height', d => heightScale(0) - heightScale(d.totals.beer))
            .attr('width', widthScale.bandwidth())
            .classed('beer', true)
            .on('click', () => {
                that.drawTable('beer');
            });

        // Spirits
        svg.append('g')
            .selectAll('rect')
            .data(this.categoryData)
            .join('rect')
            .attr('x', d => widthScale(d.month))
            .attr('y', d => heightScale(d.totals.spirits) - (heightScale(0) - heightScale(d.totals.wine)) - (heightScale(0) - heightScale(d.totals.beer)))
            .attr('height', d => heightScale(0) - heightScale(d.totals.spirits))
            .attr('width', widthScale.bandwidth())
            .classed('spirits', true)
            .on('click', () => {
                that.drawTable('spirits');
            });

        let keys = ["wine", "beer", "spirits"]
        let colorScale = d3.scaleOrdinal().domain(keys)
            .range(["#7c0238", "#cc9a04", "#979696"]);
        this.drawLegend(keys, colorScale);
    }

    drawSubCategories(category) {
        d3.select("#categoryResetButton")
            .style("display", "block");

        console.log("category", category);
        console.log(this.spiritsData);

        let datasource = null;
        switch(category) {
            case "wine":
                datasource = this.wineData;
                break;
            case "beer":
                datasource = this.beerData;
                break;
            default:
                datasource = this.spiritsData;
                break;
        }

        let subgroups = datasource.columns.slice(1);

        // var groups = d3.map(datasource, function(d){return(d.group)}).keys()

        let maxHeight = 8000;

        // Make the scales
        let heightScale = d3.scaleLinear()
            .domain([0, maxHeight])
            .range([this.vizHeight - this.margin.bottom, this.margin.top]);

        let widthScale = d3.scaleBand()
            .domain(datasource.map(d => d.month))
            .range([this.margin.left, this.vizWidth - this.margin.right])
            .padding(.1);

        // Draw the axis
        let yAxis = g => g
            .attr("transform", `translate(${this.margin.left},0)`)
            .call(d3.axisLeft(heightScale).ticks(null, "s"))
            .call(g => g.selectAll(".domain").remove())

        let xAxis = g => g
            .attr("transform", `translate(0,${this.vizHeight - this.margin.bottom})`)
            .call(d3.axisBottom(widthScale).tickSizeOuter(0))
            .call(g => g.selectAll(".domain").remove())

        let svg = d3.select("#categories-plot");

        svg.append('g')
            .call(yAxis);

        svg.append('g')
            .call(xAxis);

        this.colorScale = d3.scaleOrdinal(d3.schemeCategory10)
            .domain(subgroups);

        let stackedData = d3.stack()
            .keys(subgroups)
            (datasource);

        // Draw bars
        svg.append('g')
            .selectAll('g')
            .data(stackedData)
            .enter().append("g")
            .attr("fill", d => this.colorScale(d.key))
            .selectAll("rect")
            .data(d => d)
            .enter().append("rect")
            .attr("x", d => widthScale(d.data.month))
            .attr("y", d => heightScale(d[1]))
            .attr("height", d => (heightScale(d[0]) - heightScale(d[1])))
            .attr("width", widthScale.bandwidth());

        this.drawLegend(subgroups, this.colorScale);

    }

    drawLegend(keys, colorScale) {
        keys.reverse();

        // Add one dot in the legend for each name.
        let legendSize = 20
        let svg = d3.select("#categories-plot");

        svg.selectAll("legendColors")
            .data(keys)
            .enter()
            .append("rect")
            .attr("x", 700)
            .attr("y", function(d,i){ return 300 + i*(legendSize+5)}) // 100 is where the first dot appears. 25 is the distance between dots
            .attr("width", legendSize)
            .attr("height", legendSize)
            .style("fill", function(d){ return colorScale(d)});

        // Add one dot in the legend for each name.
        svg.selectAll("legendLabels")
            .data(keys)
            .enter()
            .append("text")
            .attr("x", 700 + legendSize*1.2)
            .attr("y", function(d,i){ return 300 + i*(legendSize+5) + (legendSize/2)}) // 100 is where the first dot appears. 25 is the distance between dots
            .style("fill", function(d){ return colorScale(d)})
            .text(function(d){ return d})
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")
    }
}