window.addEventListener('DOMContentLoaded', function() {

const req = new XMLHttpRequest();
const url = "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json"



let movieData = [];
let json;

const svg = d3.select('svg')

const width = +svg.attr('width');
const height = +svg.attr('height');
const colours = ["#e09e48", "#044f02", "#023a4f", "#690303", "#e6be3c", "#38838f", "#5c094a"]

let toolTip = d3.select('body').append('div')
    .attr('class', 'tooltip')
    .attr('id', 'tooltip')
    .style('visibility', 'hidden')
    .style('position', 'absolute')

let makeRects = () => {

    const root = d3.hierarchy(json, node => {
        return node.children;
    }).sum(node => { return node.value 
    }).sort(function(node1, node2) {
        return node2.value - node1.value
    }) 

    const treemap = d3.treemap()
    .size([width - 125, height - 125])
    .paddingInner([1])
     
treemap(root)
console.log(root)

let tile = svg.selectAll('g')
    .data(root.leaves())
    .enter()
    .append('g')
    .attr('transform', (d) => {
        return 'translate('+ (d.x0) +', '+ (d.y0) +')'
    })
    


        tile.append('rect')
        .attr('class', 'tile')
        .attr('width', (d) => { return (d.x1 - d.x0) })
        .attr('height', (d) => { return (d.y1 - d.y0) })
        .attr('data-name', d => d.data.name)
        .attr('data-value', d => d.data.value)
        .attr('data-category', d => d.data.category)
        
        .attr('fill', d => {
            if (d.data.category === "Action") {
                return "#e09e48"
            }
            if (d.data.category === "Drama") {
                return "#044f02"
            }
            if (d.data.category === "Adventure") {
                return "#023a4f"
            }
            if (d.data.category === "Family") {
                return "#690303"
            }
            if (d.data.category === "Animation") {
                return "#e6be3c"
            }
            if (d.data.category === "Comedy") {
                return "#38838f"
            }
            if (d.data.category === "Biography") {
                return "#5c094a"
            }
        })
        .on('mouseover', (d, i) => {
               
            let splitStr = d.data.value.slice(0, 3).split("")
            
             splitStr.splice(1, 0, ".")
             let decimalNum = splitStr.join("")
           
            toolTip.transition()
                .duration(100)
                .style('visibility', 'visible')
                .style('left', `${d3.event.pageX}`+"px")
                .style('top', `${d3.event.pageY}`+"px")
                .style('background-color', 'black')
                .attr('data-value', d.data.value)
                .style('width', '125px')
                .style('height', '80px')
                .style('opacity', '0.8')
                .style('font-size', 'small')
                .style('color', 'white')
                
                toolTip.text("Name: " + d.data.name + " Genre: " + d.data.category + ", " + " Total Revenue: " + "$" + decimalNum + " Million")
        })
        .on('mouseout', (d, i) => {
            toolTip.transition()
                .duration(50)
                .style('visibility', 'hidden')
        })
            
        tile.append('text')
        .attr('font-size', '12px')
        .attr('fill', 'black')
        .append('tspan')
        .attr('id', (d) => { return d.data.name })
        .attr('x', 5)
        .attr('y', 10)
        .attr('width', (d) => { return d.x1 - d.x0})
        .attr('height', (d) => { return d.y1 - d.y0})
        .text((d) => {
           
           let textElement = document.getElementById(d.data.name)
            let width = textElement.getAttribute('width');
            width = parseInt(width * 0.17)
            let text = d.data.name;
            let textLength = text.length;
            
            if (textLength < width) {
               return text;
            } else {
              
               let newStr = text.slice(0, width)
                return newStr
            }
            
        })
            
}



let createLegend = () => {
    var legend = svg.append('g')
        .attr('id', 'legend')
        .attr('transform', 'translate('+ (width - 90) +', '+ (50) +')')
        
        

  let legendItem = legend.selectAll('rect')
        .data(json.children)
        .enter()
        .append('rect')
        .attr('class', 'legend-item')
        .attr('height', '25px')
        .attr('width', '25px')
        .attr('y', (d, i) => {
           return i * 40
        })
        .attr('x', (d, i) => {
            return -10
        })
        .attr('fill', (d, i) => { return colours[i]})

    legend.selectAll('text')
        .data(json.children)
        .enter()
        .append('text')
        .attr('class', 'wrap')
        .style('font-size', '14px')
        .attr('y', (d, i) => {
            return (i + 0.4) * 40
        })
        .attr('x', (d, i) => {
          return 26
        })
        .text(d => d.name)

        var legendBorder = legend.append('rect')
            .attr('x', -14)
            .attr('y', -5)
            .attr('height', 275)
            .attr('width', 102)
            .style('stroke', 'black')
            .style('stroke-width', 1)
            .style('fill', 'none')


    }

 


req.open('GET', url, true)
req.send()
req.onload = function() {

    json = JSON.parse(req.responseText)
    
   
    console.log(json)
 
    makeRects();
    createLegend();
    
}


})

