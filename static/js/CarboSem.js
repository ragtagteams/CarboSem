/*
 * Copyright 2017 Aly Shmahell
 */
$(function () {
    function submitQuery() {
        /*
         * TODO
         * var query = $("#search").find("input[name=search]").val();
         * $.get("/graph?mir=" + encodeURIComponent(query));
         */
    }

    function drawGraph() {
        /*
         * clean up previous svg
         */
        d3.select("svg").remove();
        /*
         * configure svg settings
         */
        var width = window.innerWidth,
            height = window.innerHeight;
        var force = d3.layout.force()
            .charge(-200).linkDistance(30).size([width, height]);
        /*
         * create new svg
         */
        var svg = d3.select("#graph").append("svg")
            .attr("width", width).attr("height", height)
            .attr("pointer-events", "all");

        d3.json("/getJSON", function (error, graph) {
            if (error) {
                alert("Error, no JSON file found!");
                return;
            }

            /*
                        var nodes = [];
                        var links = [];
                        for (var i = 0, len = graph.nodes.length; i < len; i++) {
                            if (graph.nodes[i].targets) {
                                nodes.push({
                                    "label": graph.nodes[i].label,
                                    "title": graph.nodes[i].title
                                });
                                for (var j = 0, sublen = graph.nodes[i].targets.length; j < sublen; j++) {
                                    nodes.push({
                                        "label": graph.nodes[graph.nodes[i].targets[j].target].label,
                                        "title": graph.nodes[graph.nodes[i].targets[j].target].title
                                    });
                                    links.push({
                                        "source": i,
                                        "target": nodes.length
                                    });
                                }
                            }
                        }
                        alert(nodes[1].title);
                        alert(links[0].source);
            */
            /*
                        var nodes = [];
                        var links = [];
                        alert(nodes.length);
                        for (var i = 0, len = graph.nodes.length; i < len; i++) {
                            if (graph.nodes[i].targets)
                                for (var j = 0, sublen = graph.nodes[i].targets.length; j < sublen; j++) {
                                    nodes.push({"label":graph.nodes[i].label,"title":graph.nodes[i].title});
                                    alert(graph.nodes[i].targets[j].target);
                                }
                        }
                        alert(nodes[1].title);
            */

            force.nodes(graph.nodes).links(graph.links).start();

            var link = svg.selectAll("link")
                .data(graph.links);
            link.enter().append("line")
                .attr("class", "link");
            link.exit().remove();

            var node = svg.selectAll("node")
                .data(graph.nodes);
            node.enter().append("circle")
                .attr("class", function (d) {
                    return "node " + d.label
                })
                .attr("r", 10)
                .call(force.drag);
            node.exit().remove();

            var nodeText = svg.selectAll("text")
                .data(graph.nodes);
            nodeText.enter().append("text")
                .attr("font-family", "monospace")
                .attr("font-size", "10px")
                .attr("fill", "blue")
                .text(function (d) {
                    return d.title
                })
                .call(force.drag);
            nodeText.exit().remove();

            force.on("tick", function () {
                link.attr("x1", function (d) {
                        return d.source.x;
                    })
                    .attr("y1", function (d) {
                        return d.source.y;
                    })
                    .attr("x2", function (d) {
                        return d.target.x;
                    })
                    .attr("y2", function (d) {
                        return d.target.y;
                    });

                node.attr("cx", function (d) {
                        return d.x;
                    })
                    .attr("cy", function (d) {
                        return d.y;
                    });

                nodeText.attr("x", function (d) {
                        return d.x + 10;
                    })
                    .attr("y", function (d) {
                        return d.y + 10;
                    });
            });
        });
        return false;
    }
    $("#search").submit(drawGraph);
    $(".checkbox").change(function () {
        if (this.checked) {
            drawGraph();
        }
    });
})
