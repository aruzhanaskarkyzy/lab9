//task 1
const x = 500;
const y = 500;

const margin = 40;
const xMax = x - margin*2;
const yMax = y - margin*2;

const points = 100;
const data = [];

for (var i = 0; i < points; i++) {
    data.push([Math.random() * xMax, Math.random() * yMax]);
}

const svg = d3.select("#plot")
    .append("svg")
    .append("g")
    .attr("transform","translate(" + margin + "," + margin + ")");

const xA = d3.scaleLinear()
  .domain([0, 500])
  .range([0, xMax]);

svg.append("g")
  .attr("transform", "translate(0," + yMax + ")")
  .call(d3.axisBottom(xA));

const yA = d3.scaleLinear()
  .domain([0, 500])
  .range([yMax, 0]);

svg.append("g")
  .call(d3.axisLeft(yA));

svg.append('g')
  .selectAll("dot")
  .data(data).enter()
  .append("circle")
  .attr("cx", function (d) { return d[0] } )
  .attr("cy", function (d) { return d[1] } )
  .attr("r", 3)
  .style("fill", "Red");


//task 2

// Define the dimensions and margins of the chart
const width = 400;
const height = 400;

// Set the radius of the pie chart
const radius = Math.min(width, height) / 2 - margin;

// Create the SVG element to hold the chart
const svg2 = d3.select("#pie")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .append("g")
  .attr("transform", `translate(${width / 2}, ${height / 2})`);

// Load the data from the CSV file
d3.csv("titanic.csv", function(d) {
  return {
      age: +d.Age
  };
}).then(function(data) {
  var dataAge = [];

  for (var i = 0; i < data.length; i++) {
      dataAge.push(Object.values(data[i])[0]);
  };
  console.log(dataAge);
  // Count the number of occurrences of each age value
const count = {};
dataAge.forEach(age => {
  count[age] = count[age] ? count[age] + 1 : 1;
});

// Convert the count object into an array of objects
const dataArray = Object.keys(count).map(age => {
  return {
    age: age,
    count: count[age]
  }
});
  // Create a d3 pie chart generator
  const pie = d3.pie()
    .value(d => d.count);
  // Generate the pie chart data
  const pieData = pie(dataArray);

  // Create a d3 arc generator
  const arc = d3.arc()
    .innerRadius(0)
    .outerRadius(radius);

  // Create the pie slices
  const slices = svg2.selectAll("path")
    .data(pieData)
    .enter()
    .append("path")
    .attr("d", arc)
    .attr("fill", (d, i) => {
      // Generate a different color for each slice
      return d3.schemeCategory10[i % 10];
    })
    .attr("stroke", "white")
    .style("stroke-width", "2px");

  // Add labels to the pie slices
  const labels = svg2.selectAll("text")
    .data(pieData)
    .enter()
    .append("text")
    .text(d => `${d.data.age}: ${d.data.count}`)
    .attr("transform", d => `translate(${arc.centroid(d)})`)
    .style("text-anchor", "middle")
    .style("font-size", "12px")
    .style("font-weight", "bold")
    .style("fill", "white");

  // Add a title to the chart
  svg2.append("text")
    .attr("x", 0)
    .attr("y", -height / 2 + margin)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("font-weight", "bold")
    .text("Age Distribution of Passengers");
})
.catch(error => console.log(error));
