//// load data


d3.csv("/data/MonthSales.csv").then(function(data) {
    // this.setData(data)
    let build = new DataPull(data);
    //console.log(data)
});