load_categories = d3.json('data/categories.json');
load_spirits = d3.csv('data/spirits.csv');
load_wine = d3.csv('data/wine.csv');
load_beer = d3.csv('data/beer.csv');
let promises = [load_categories, load_spirits, load_wine, load_beer];

Promise.all(promises).then(function(values) {
    let [categories, spirits, wine, beer] = values;

    // Create Categories Visualization
    let categoriesChart = new CategoriesChart(categories, spirits, wine, beer);
    categoriesChart.drawTable(null);
});