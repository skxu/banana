var dataset = [5,10,15,20,25];

//d3.select("body").append("p").text("New paragraph!");

d3.select("body").selectAll("p")
          .data(dataset)
          .enter()
          .append("p")
          .text(function(d) {return d;});


/*
d3.text("trace10", function(d) {
  data = d3.csv.parseRows(d).map(function(row) {
    return row.map(function(value) {
      value_array = value.split(" ");
      return {
        total_pkt: +value_array[0],
        avg_pkt_size: +value_array[1],
        avg_size_ip: +value_array[2],
        total_src_ip: +value_array[3],
        entropy_src_ip: +value_array[4],
        total_dst_ip: +value_array[5],
        entropy_dst_ip: +value_array[6],
        total_src_prt: +value_array[7],
        entropy_src_prt: +value_array[8],
        total_dst_prt: +value_array[9],
        entropy_dst_prt: +value_array[10],
        entropy_tcp_flag: +value_array[11],
        avg_window_size: +value_array[12]
      }
    });
  });
//do stuff with data here

};
*/
var data10, data09;
var graph = {
  init: function() {
    var n = 3, // number of layers
        m = 500, // number of samples per layer
        stack = d3.layout.stack().offset("wiggle");
    var layers0 = stack(d3.range(n).map(function(idx) { 
      return data10.map(function(a,i) {
          
          return {
            x: i,
            y: a[0].vals[idx*2+1],      
          }
      });
    }));
  
    var layers1 = stack(d3.range(n).map(function(idx) {
      return data09.map(function(a,i) {
          return {
            x: i,
            y: a[0].vals[idx*2+1],      
          }
      });
    }));
  
  
  var width = 960,
      height = 500;

  var x = d3.scale.linear()
      .domain([0, m - 1])
      .range([0, width]);

  var y = d3.scale.linear()
      .domain([0, d3.max(layers0.concat(layers1), function(layer) { return d3.max(layer, function(d) { return d.y0 + d.y; }); })])
      .range([height, 0]);

  var color = d3.scale.linear()
      .range(["#aad", "#556"]);

  var area = d3.svg.area()
      .x(function(d) { return x(d.x); })
      .y0(function(d) { return y(d.y0); })
      .y1(function(d) { return y(d.y0 + d.y); });

  var svg = d3.select("body").append("svg")
      .attr("width", width)
      .attr("height", height);

  svg.selectAll("path")
      .data(layers0)
    .enter().append("path")
      .attr("d", area)
      .style("fill", function() { return color(Math.random()); });

  graph.transition = function() {
    console.log(layers1, layers0);
    d3.selectAll("path")
        .data(function() {
          var d = layers1;
          layers1 = layers0;
          return layers0 = d;
        })
      .transition()
        .duration(2500)
        .attr("d", area);
  }
  
  //transition();

  // Inspired by Lee Byron's test data generator.
  function bumpLayer(n) {

    function bump(a) {
      var x = 1 / (.1 + Math.random()),
          y = 2 * Math.random() - .5,
          z = 10 / (.1 + Math.random());
      for (var i = 0; i < n; i++) {
        var w = (i / n - y) * z;
        a[i] += x * Math.exp(-w * w);
      }
    }

    var a = [], i;
    for (i = 0; i < n; ++i) a[i] = 0;
    for (i = 0; i < 5; ++i) bump(a);
    return a.map(function(d, i) { return {x: i, y: Math.max(0, d)}; });
  }
    
  }
};


d3.text("trace09", function(d) {
  data09 = d3.csv.parseRows(d).map(function(row) {
    return row.map(function(value) {
      value_array = value.split(" ");
      return {
        vals: [+value_array[0],
        +value_array[1],
        +value_array[2],
        +value_array[3],
        +value_array[4],
        +value_array[5],
        +value_array[6],
        +value_array[7],
        +value_array[8],
        +value_array[9],
        +value_array[10],
        +value_array[11],
        +value_array[12]
        ]
      }
    });
  });
  
  getTrace10();
    
});

function getTrace10() {
d3.text("trace10", function(d) {
  data10 = d3.csv.parseRows(d).map(function(row) {
    return row.map(function(value) {
      value_array = value.split(" ");
      return {
        vals: [+value_array[0],
        +value_array[1],
        +value_array[2],
        +value_array[3],
        +value_array[4],
        +value_array[5],
        +value_array[6],
        +value_array[7],
        +value_array[8],
        +value_array[9],
        +value_array[10],
        +value_array[11],
        +value_array[12]
        ]
      }
    });
  });
  
  graph.init();
    
});
}