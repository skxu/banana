
  
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

    var margin = {top: 10, right: 10, bottom: 100, left: 40},
    margin2 = {top: 430, right: 10, bottom: 20, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    height2 = 500 - margin2.top - margin2.bottom;

var parseDate = d3.time.format("%S").parse;

var x = d3.scale.linear().range([0, width]),
    x2 = d3.scale.linear().range([0, width]),
    y = d3.scale.linear().range([height, 0]),
    y2 = d3.scale.linear().range([height2, 0]);

var xAxis = d3.svg.axis().scale(x).orient("bottom"),
    xAxis2 = d3.svg.axis().scale(x2).orient("bottom"),
    yAxis = d3.svg.axis().scale(y).orient("left");

var brush = d3.svg.brush()
    .x(x2)
    .on("brush", brushed);

var area = d3.svg.area()
    .interpolate("monotone")
    .x(function(d) { return x(d.time); })
    .y0(height)
    .y1(function(d) { return y(d.avg_pkt_size); });

var area2 = d3.svg.area()
    .interpolate("monotone")
    .x(function(d) { return x2(d.time); })
    .y0(height2)
    .y1(function(d) { return y2(d.avg_pkt_size); });


d3.select("body").append("h1").text("AVERAGE PACKET SIZE");

var avg_pkt_size_svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);



avg_pkt_size_svg.append("defs").append("clipPath")
    .attr("id", "clip")
  .append("rect")
    .attr("width", width)
    .attr("height", height);

var focus = avg_pkt_size_svg.append("g")
    .attr("class", "focus")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var context = avg_pkt_size_svg.append("g")
    .attr("class", "context")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");




/* =============== TOTAL PACKET COUNT PER 10 SECOND SLICE ===== 
  =============================================================
  
*/

var tp_x = d3.scale.linear().range([0, width]),
    tp_x2 = d3.scale.linear().range([0, width]),
    tp_y = d3.scale.linear().range([height, 0]),
    tp_y2 = d3.scale.linear().range([height2, 0]);

var tp_xAxis = d3.svg.axis().scale(tp_x).orient("bottom"),
    tp_xAxis2 = d3.svg.axis().scale(tp_x2).orient("bottom"),
    tp_yAxis = d3.svg.axis().scale(tp_y).orient("left");

var tp_brush = d3.svg.brush()
    .x(tp_x2)
    .on("brush", tp_brushed);

var tp_area = d3.svg.area()
    .interpolate("monotone")
    .x(function(d) { return tp_x(d.time); })
    .y0(height)
    .y1(function(d) { return tp_y(d.total_pkt); });

var tp_area2 = d3.svg.area()
    .interpolate("monotone")
    .x(function(d) { return tp_x2(d.time); })
    .y0(height2)
    .y1(function(d) { return tp_y2(d.total_pkt); });

d3.select("body").append("h1").text("TOTAL PACKET COUNT");

var tp_svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);



tp_svg.append("defs").append("clipPath")
    .attr("id", "clip")
  .append("rect")
    .attr("width", width)
    .attr("height", height);

var tp_focus = tp_svg.append("g")
    .attr("class", "tp_focus")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var tp_context = tp_svg.append("g")
    .attr("class", "tp_context")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");



/* ============================================================= 
   ===== AVG BYTES SENT PER UNIQUE IP PER 10 SECOND SLICE ======
   =============================================================
  
*/

var asi_x = d3.scale.linear().range([0, width]),
    asi_x2 = d3.scale.linear().range([0, width]),
    asi_y = d3.scale.linear().range([height, 0]),
    asi_y2 = d3.scale.linear().range([height2, 0]);

var asi_xAxis = d3.svg.axis().scale(asi_x).orient("bottom"),
    asi_xAxis2 = d3.svg.axis().scale(asi_x2).orient("bottom"),
    asi_yAxis = d3.svg.axis().scale(asi_y).orient("left");

var asi_brush = d3.svg.brush()
    .x(asi_x2)
    .on("brush", asi_brushed);

var asi_area = d3.svg.area()
    .interpolate("monotone")
    .x(function(d) { return asi_x(d.time); })
    .y0(height)
    .y1(function(d) { return asi_y(d.avg_size_ip); });

var asi_area2 = d3.svg.area()
    .interpolate("monotone")
    .x(function(d) { return asi_x2(d.time); })
    .y0(height2)
    .y1(function(d) { return asi_y2(d.avg_size_ip); });

d3.select("body").append("h1").text("AVERAGE BYTES SENT PER UNIQUE IP");

var asi_svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);



asi_svg.append("defs").append("clipPath")
    .attr("id", "clip")
  .append("rect")
    .attr("width", width)
    .attr("height", height);

var asi_focus = asi_svg.append("g")
    .attr("class", "asi_focus")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var asi_context = asi_svg.append("g")
    .attr("class", "asi_context")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");



/* ============================================================= 
   ===== TOTAL SRC IP PER 10 SECOND SLICE ======
   =============================================================
  
*/

var tsip_x = d3.scale.linear().range([0, width]),
    tsip_x2 = d3.scale.linear().range([0, width]),
    tsip_y = d3.scale.linear().range([height, 0]),
    tsip_y2 = d3.scale.linear().range([height2, 0]);

var tsip_xAxis = d3.svg.axis().scale(tsip_x).orient("bottom"),
    tsip_xAxis2 = d3.svg.axis().scale(tsip_x2).orient("bottom"),
    tsip_yAxis = d3.svg.axis().scale(tsip_y).orient("left");

var tsip_brush = d3.svg.brush()
    .x(tsip_x2)
    .on("brush", tsip_brushed);

var tsip_area = d3.svg.area()
    .interpolate("monotone")
    .x(function(d) { return tsip_x(d.time); })
    .y0(height)
    .y1(function(d) { return tsip_y(d.total_src_ip); });

var tsip_area2 = d3.svg.area()
    .interpolate("monotone")
    .x(function(d) { return tsip_x2(d.time); })
    .y0(height2)
    .y1(function(d) { return tsip_y2(d.total_src_ip); });


d3.select("body").append("h1").text("TOTAL UNIQUE SOURCE IP");

var tsip_svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);



tsip_svg.append("defs").append("clipPath")
    .attr("id", "clip")
  .append("rect")
    .attr("width", width)
    .attr("height", height);

var tsip_focus = tsip_svg.append("g")
    .attr("class", "tsip_focus")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var tsip_context = tsip_svg.append("g")
    .attr("class", "tsip_context")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");



/* ============================================================= 
   ===== ENTROPY SRC IP PER 10 SECOND SLICE ======
   =============================================================
  
*/

var esip_x = d3.scale.linear().range([0, width]),
    esip_x2 = d3.scale.linear().range([0, width]),
    esip_y = d3.scale.linear().range([height, 0]),
    esip_y2 = d3.scale.linear().range([height2, 0]);

var esip_xAxis = d3.svg.axis().scale(esip_x).orient("bottom"),
    esip_xAxis2 = d3.svg.axis().scale(esip_x2).orient("bottom"),
    esip_yAxis = d3.svg.axis().scale(esip_y).orient("left");

var esip_brush = d3.svg.brush()
    .x(esip_x2)
    .on("brush", esip_brushed);

var esip_area = d3.svg.area()
    .interpolate("monotone")
    .x(function(d) { return esip_x(d.time); })
    .y0(height)
    .y1(function(d) { return esip_y(d.entropy_src_ip); });

var esip_area2 = d3.svg.area()
    .interpolate("monotone")
    .x(function(d) { return esip_x2(d.time); })
    .y0(height2)
    .y1(function(d) { return esip_y2(d.entropy_src_ip); });


d3.select("body").append("h1").text("ENTROPY OF SOURCE IP");

var esip_svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);



esip_svg.append("defs").append("clipPath")
    .attr("id", "clip")
  .append("rect")
    .attr("width", width)
    .attr("height", height);

var esip_focus = esip_svg.append("g")
    .attr("class", "esip_focus")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var esip_context = esip_svg.append("g")
    .attr("class", "esip_context")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");




















function graph(source) {
  clean();
  
  d3.csv(source, type, function(error, data) {
    x.domain(d3.extent(data.map(function(d,i) { 
      return i; 
    })));
    y.domain([0, d3.max(data.map(function(d) { return d.avg_pkt_size; }))]);
    x2.domain(x.domain());
    y2.domain(y.domain());

    focus.append("path")
        .datum(data)
        .attr("class", "area")
        .attr("d", area);

    focus.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    focus.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    context.append("path")
        .datum(data)
        .attr("class", "area")
        .attr("d", area2);

    context.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height2 + ")")
        .call(xAxis2);

    context.append("g")
        .attr("class", "x brush")
        .call(brush)
      .selectAll("rect")
        .attr("y", -6)
        .attr("height", height2 + 7);


    //TOTAL PACKET FOR 10 SECOND SLICES

    tp_x.domain(d3.extent(data.map(function(d,i) { 
      return i; 
    })));
    tp_y.domain([0, d3.max(data.map(function(d) { console.log(d.total_pkt); return d.total_pkt; }))]);
    tp_x2.domain(tp_x.domain());
    tp_y2.domain(tp_y.domain());
    
    tp_focus.append("path")
        .datum(data)
        .attr("class", "area")
        .attr("d", tp_area);

    tp_focus.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(tp_xAxis);

    tp_focus.append("g")
        .attr("class", "y axis")
        .call(tp_yAxis);

    tp_context.append("path")
        .datum(data)
        .attr("class", "area")
        .attr("d", tp_area2);

    tp_context.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height2 + ")")
        .call(tp_xAxis2);

    tp_context.append("g")
        .attr("class", "x brush")
        .call(tp_brush)
      .selectAll("rect")
        .attr("y", -6)
        .attr("height", height2 + 7);

    //AVERAGE SIZE IN BYTES PER UNIQUE IP PER 10 SECOND SLICE 

    asi_x.domain(d3.extent(data.map(function(d,i) { 
      return i; 
    })));
    asi_y.domain([0, d3.max(data.map(function(d) { return d.avg_size_ip; }))]);
    asi_x2.domain(asi_x.domain());
    asi_y2.domain(asi_y.domain());

    asi_focus.append("path")
        .datum(data)
        .attr("class", "area")
        .attr("d", asi_area);

    asi_focus.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(asi_xAxis);

    asi_focus.append("g")
        .attr("class", "y axis")
        .call(asi_yAxis);

    asi_context.append("path")
        .datum(data)
        .attr("class", "area")
        .attr("d", asi_area2);

    asi_context.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height2 + ")")
        .call(asi_xAxis2);

    asi_context.append("g")
        .attr("class", "x brush")
        .call(asi_brush)
      .selectAll("rect")
        .attr("y", -6)
        .attr("height", height2 + 7);


    //TOTAL SRC IP PER 10 SECOND SLICE 

    tsip_x.domain(d3.extent(data.map(function(d,i) { 
      return i; 
    })));
    tsip_y.domain([0, d3.max(data.map(function(d) { return d.total_src_ip; }))]);
    tsip_x2.domain(tsip_x.domain());
    tsip_y2.domain(tsip_y.domain());

    tsip_focus.append("path")
        .datum(data)
        .attr("class", "area")
        .attr("d", tsip_area);

    tsip_focus.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(tsip_xAxis);

    tsip_focus.append("g")
        .attr("class", "y axis")
        .call(tsip_yAxis);

    tsip_context.append("path")
        .datum(data)
        .attr("class", "area")
        .attr("d", tsip_area2);

    tsip_context.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height2 + ")")
        .call(tsip_xAxis2);

    tsip_context.append("g")
        .attr("class", "x brush")
        .call(tsip_brush)
      .selectAll("rect")
        .attr("y", -6)
        .attr("height", height2 + 7);

    //ENTROPY SRC IP PER 10 SECOND SLICE 

    esip_x.domain(d3.extent(data.map(function(d,i) { 
      return i; 
    })));
    esip_y.domain([0, d3.max(data.map(function(d) { return d.entropy_src_ip; }))]);
    esip_x2.domain(esip_x.domain());
    esip_y2.domain(esip_y.domain());

    esip_focus.append("path")
        .datum(data)
        .attr("class", "area")
        .attr("d", esip_area);

    esip_focus.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(esip_xAxis);

    esip_focus.append("g")
        .attr("class", "y axis")
        .call(esip_yAxis);

    esip_context.append("path")
        .datum(data)
        .attr("class", "area")
        .attr("d", esip_area2);

    esip_context.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height2 + ")")
        .call(esip_xAxis2);

    esip_context.append("g")
        .attr("class", "x brush")
        .call(esip_brush)
      .selectAll("rect")
        .attr("y", -6)
        .attr("height", height2 + 7);

    
  });

}


function brushed() {
  x.domain(brush.empty() ? x2.domain() : brush.extent());
  focus.select(".area").attr("d", area);
  focus.select(".x.axis").call(xAxis);
}

//TOTAL PACKET FOR 10 SECOND SLICES

function tp_brushed() {
  tp_x.domain(tp_brush.empty() ? tp_x2.domain() : tp_brush.extent());
  tp_focus.select(".area").attr("d", tp_area);
  tp_focus.select(".x.axis").call(tp_xAxis);
}

//AVG SIZE IN BYTES PER IP PER 10 SECOND SLICE

function asi_brushed() {
  asi_x.domain(asi_brush.empty() ? asi_x2.domain() : asi_brush.extent());
  asi_focus.select(".area").attr("d", asi_area);
  asi_focus.select(".x.axis").call(asi_xAxis);
}

//TOTAL SRC IP PER 10 SECOND SLICE

function tsip_brushed() {
  tsip_x.domain(tsip_brush.empty() ? tsip_x2.domain() : tsip_brush.extent());
  tsip_focus.select(".area").attr("d", tsip_area);
  tsip_focus.select(".x.axis").call(tsip_xAxis);
}

//ENTROPY SRC IP PER 10 SECOND SLICE

function esip_brushed() {
  esip_x.domain(esip_brush.empty() ? esip_x2.domain() : esip_brush.extent());
  esip_focus.select(".area").attr("d", esip_area);
  esip_focus.select(".x.axis").call(esip_xAxis);
}



function type(d) {
  //d.date = parseDate(d.date);
  d.avg_pkt_size = +d.avg_pkt_size;
  d.total_pkt = +d.total_pkt;
  d.avg_size_ip = +d.avg_size_ip;
  d.total_src_ip = +d.total_src_ip;
  return d;
  }















function clean() {
  
  d3.select("body").selectAll("svg").remove();
  d3.select("body").selectAll("h1").remove();
  d3.select("body").append("h1").text("AVERAGE PACKET SIZE");

avg_pkt_size_svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);



avg_pkt_size_svg.append("defs").append("clipPath")
    .attr("id", "clip")
  .append("rect")
    .attr("width", width)
    .attr("height", height);

focus = avg_pkt_size_svg.append("g")
    .attr("class", "focus")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

context = avg_pkt_size_svg.append("g")
    .attr("class", "context")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");




/*
  =============================================================
  =============== TOTAL PACKET COUNT PER 10 SECOND SLICE ======
  =============================================================
  
*/

d3.select("body").append("h1").text("TOTAL PACKET COUNT");

tp_svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);



tp_svg.append("defs").append("clipPath")
    .attr("id", "clip")
  .append("rect")
    .attr("width", width)
    .attr("height", height);

tp_focus = tp_svg.append("g")
    .attr("class", "tp_focus")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

tp_context = tp_svg.append("g")
    .attr("class", "tp_context")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");



/* ============================================================= 
   ===== AVG BYTES SENT PER UNIQUE IP PER 10 SECOND SLICE ======
   =============================================================
  
*/
d3.select("body").append("h1").text("AVERAGE BYTES SENT PER UNIQUE IP");

asi_svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);



asi_svg.append("defs").append("clipPath")
    .attr("id", "clip")
  .append("rect")
    .attr("width", width)
    .attr("height", height);

asi_focus = asi_svg.append("g")
    .attr("class", "asi_focus")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

asi_context = asi_svg.append("g")
    .attr("class", "asi_context")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");



/* ============================================================= 
   ===== TOTAL SRC IP PER 10 SECOND SLICE ======
   =============================================================
  
*/

d3.select("body").append("h1").text("TOTAL UNIQUE SOURCE IP");  
  
tsip_svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);



tsip_svg.append("defs").append("clipPath")
    .attr("id", "clip")
  .append("rect")
    .attr("width", width)
    .attr("height", height);

tsip_focus = tsip_svg.append("g")
    .attr("class", "tsip_focus")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

tsip_context = tsip_svg.append("g")
    .attr("class", "tsip_context")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

/* ============================================================= 
   ===== TOTAL SRC IP PER 10 SECOND SLICE ======
   =============================================================
  
*/

d3.select("body").append("h1").text("ENTROPY OF SOURCE IP");  
  
esip_svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);



esip_svg.append("defs").append("clipPath")
    .attr("id", "clip")
  .append("rect")
    .attr("width", width)
    .attr("height", height);

esip_focus = esip_svg.append("g")
    .attr("class", "esip_focus")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

esip_context = esip_svg.append("g")
    .attr("class", "esip_context")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");


}




graph("trace10.csv");