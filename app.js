//let's start
const heighta = "76vh"
const height = "68vh"
const width = "80vw"
const wpadding = "8vw"
const hpadding = "8vh"
const pxwidth = (window.innerWidth)
const pxheight = (window.innerHeight)

function conv(x) {
    x = x.split("v")
    if (x[1] == "w") {
        return (parseInt(x[0]) * pxwidth) / 100
    }
    else if (x[1] == "h") {
        return (parseInt(x[0]) * pxheight) / 100
    }
}

function sub(x, y) {
    // a vw - b vw
    x = x.split("v")
    a = x[0]
    y = y.split("v")
    b = y[0]
    return (a - b).toString() + "v" + x[1]
}

const svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", heighta)

var tooltip = d3.select("#holder")
    .append("span")
    .attr("id", "tooltip")
    .style("opacity", 0)

const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"

fetch(url)
    .then(response => response.json())
    .then(data => {

        const dataset = data
        console.log(dataset)

        const xScale = d3.scaleLinear().domain([d3.min(dataset, d => d["Year"]) - 1, d3.max(dataset, d => d["Year"]) + 1]).range([wpadding, sub(width, wpadding)])
        const yScale = d3.scaleLinear().domain([d3.min(dataset, d => d["Seconds"]), d3.max(dataset, d => d["Seconds"])]).range([hpadding, height])

        console.log(dataset[6]["Year"])
        svg.selectAll("circle")
            .data(dataset)
            .enter()
            .append("circle")
            .attr("class", "dot")
            .attr("cx", d => xScale(d["Year"]))
            .attr("cy", d => yScale(d["Seconds"]))
            .attr("r", 5.5)
            .attr("data-xvalue", d => d["Year"])
            .attr("data-yvalue", d => {
                let sect = parseInt(d["Seconds"])
                let min = Math.floor(sect/60)
                let sec = sect - (min*60)
                min = min -30
                let b = ((min==0) ? "00" : (min<10) ? "0"+min.toString() : min.toString())+":"+((sec==0) ? "00" : (sec<10) ? "0"+sec.toString() : sec.toString())
                let a = "1989-03-25T19:" + b + ".000Z"
                console.log(a,min,sec);
                return a
            }/*parseInt(d["Time"].split(":")[0])*/)
            .attr("fill", d => {
                if (d["Doping"] === "") {
                    return "orange"
                }
                return "rgb(0, 132, 255)"
            })
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            .style("opacity", 0.8)
            .on("mouseover", function (d) {
                tooltip.transition()
                    .duration(0)
                    .attr("data-year",d["Year"])
                    .style("opacity", 0.9)
                    .style("top", sub(yScale(d["Seconds"]), "2vh"))
                    .style("left", function () {
                        if (d["Doping"] === "") {
                            return xScale(d["Year"])
                        }
                        return sub(xScale(d["Year"]), "5vw")
                    })
                d3.select("#tooltip").html(`${d["Name"]}: ${d["Nationality"]}<br> Year: ${d["Year"]} Time: ${d["Time"]}<br><br>${d["Doping"]}`)
            })
            .on("mouseout", function () {
                tooltip.transition()
                    .duration(0)
                    .style("opacity", 0)
                    .style("top", "0vw")
                    .style("left", "0vw")
            })

        const xcale = d3.scaleLinear().domain([(d3.min(dataset, d => d["Year"]) - 1).toString(), (d3.max(dataset, d => d["Year"]) + 1).toString()]).range([conv(wpadding), conv(sub(width, wpadding))])
        const ycale = d3.scaleLinear().domain([d3.min(dataset, d => d["Seconds"]), d3.max(dataset, d => d["Seconds"])]).range([conv(hpadding), conv(height)])

        const xAxis = d3.axisBottom().scale(xcale)
            .tickFormat(d => d)

        svg.append("g")
            .attr("id", "x-axis")
            .attr("transform", "translate(0," + conv(height) + ")")
            .call(xAxis)

        const yAxis = d3.axisLeft().scale(ycale)
            .tickFormat(d => {
                var sect = parseInt(d)
                var min = Math.floor(sect/60)
                var sec = sect - (min*60)
                return min.toString()+":"+((sec==0) ? "00" : sec.toString())
            })

        svg.append("g")
            .attr("id", "y-axis")
            .attr("transform", "translate(" + conv(wpadding) + ",0)")
            .call(yAxis)
    })