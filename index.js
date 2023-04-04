const width = 800;
const height = 400;
const barWidth = width / 275;

let svgContainer = d3
  .select(".svg-wrap")
  .append("svg")
  .attr("width", 900)
  .attr("height", 460)
  .style("background-color","white");

svgContainer.append('text')
  .attr("transform", 'rotate(-90)')
  .attr("x", -200)
  .attr("y", 90)
  .text("GDP")
  .style("font-family", "Courier");


//get data
d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json")
.then(data => {
    processData(data.data);
});

function processData(data){  
    let dateYears = getDateYears(data);
    let scaleX = createXAxis(dateYears);

    let gdp = data.map(item => item[1]);
    let scaleY = createYaxis(gdp);

    createBars(dateYears,gdp,data, scaleX)
    console.log(gdp)
}

function createBars(dateYears, gdp,data ,scaleX){
    let gdpMax = d3.max(gdp);
    let heightScale = d3.scaleLinear().domain([0, gdpMax]).range([0, height]);
    let scaledgdp = gdp.map(function (item) {
        return heightScale(item);
      });

    let tooltip = d3.select("#tooltip");
    let years = getYears(data);

    d3.select('svg')
      .selectAll('rect')
      .data(scaledgdp)
      .enter()
      .append('rect')
      .attr('data-date', function (d, i) {
        return data[i][0];
      })
      .attr('data-gdp', function (d, i) {
        return data[i][1];
      })
      .attr('class', 'bar')
      .attr('x', function (d, i) {
        return scaleX(dateYears[i]);
      })
      .attr('y', function (d) {
        return height - d;
      })
      .attr('width', barWidth)
      .attr('height', function (d) {
        return d;
      })
      .attr('index', (d, i) => i)
      .style('fill', '#3d993d')
      .attr('transform', 'translate(60, 0)')
      .on('mouseover', function (event, d) {
        // d or datum is the height of the
        // current rect
        console.log(this)
        this.style.fill = "black";
        var i = this.getAttribute('index');
        tooltip.transition().duration(200).style('opacity', 0.9);
        tooltip
          .html(
            years[i] +
              '<br>' +
              '$' +
              gdp[i].toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') +
              ' Billion'
          )
          .attr('data-date', data[i][0])
          .style('left', i * barWidth + 30 + 'px')
          .style('top', height - 100 + 'px')
          .style('transform', 'translateX(60px)');
      })
      .on('mouseout', function () {
        tooltip.transition().duration(200).style('opacity', 0);
        this.style.fill = '#3d993d';
      });
}

function createYaxis(gdp){
    let gdpMax = d3.max(gdp);
    let scaleY = d3.scaleLinear().domain([0, gdpMax]).range([height, 0]);

    let yAxis = d3.axisLeft().scale(scaleY);
    svgContainer.append('g')
    .call(yAxis)
    .attr("id", "y-axis")
    .attr('transform', 'translate(60,0)');

    return scaleY;
}

function createXAxis(dateYears){
    var xMax = d3.max(dateYears);
    xMax.setMonth(xMax.getMonth() );
    var scaleX = d3
      .scaleTime()
      .domain([d3.min(dateYears), xMax])
      .range([0, width]);

    let xAxis = d3.axisBottom().scale(scaleX);
    svgContainer.append('g')
    .call(xAxis)
    .attr("id", "x-axis")
    .attr('transform', 'translate(60,400)'); 
    return scaleX;
}

function getDateYears(data){
    return data.map(function (item) {
        return new Date(item[0]);
    });
}

function getYears(data){
    return data.map(function (item) {
        let quarter;
        let temp = item[0].substring(5, 7);
        switch(temp){
            case '01':
                quarter = 'Q1';
                break;
            case '04':
                quarter = 'Q2';
                break;
            case '07':
                quarter = 'Q3';
                break;
            case '10':
                quarter = 'Q4';
                break;
        }
        return item[0].substring(0, 4) + ' ' + quarter;
      });
}

    


