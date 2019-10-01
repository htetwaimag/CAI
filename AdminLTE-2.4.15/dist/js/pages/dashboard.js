$(function() {

	'use strict';

	var currentPriceLable = "";

	var arrListedCompany = [];

	var languageType = 1;
	
	//$("#eng").css('color', 'black');

	var arrCompany = [];
	var arrColor = [];
	var arrCurrentPrice = [];
	var arrClosingPrice = [];
	var yse_column = [];
	var yse_column_eng = [];
	var yse_column_myan = [];
	var barColors = [];
	var labels = [];
	var ykeys = [];
	var chart;
	var date;
	var arrMultiSeries = [];
	var tradedShareLable="";
	var tradedAmtLable="";
	var diffAmtLable="";
	var arrDiffAmt = [];
	var arrTradedShare = [];
	var arrTradedAmt = [];
	var closingPriceIndex;
	var currentPriceIndex;
	var turnoverIndex;
	var tradedAmtIndex;
	var isFirstShowMultiSerie=false;
	var interval = null;
	function toggleDataSeries(e) {
		if (typeof (e.dataSeries.visible) === "undefined"
				|| e.dataSeries.visible) {
			e.dataSeries.visible = false;
		} else {
			e.dataSeries.visible = true;
		}
		chart.render();
	}

	var updateInterval = 5000;

	var time = new Date;

	function updateChart() {
		time.setTime(time.getTime() + updateInterval);
		for (var i = 0; i < arrCompany.length; i++) {

			arrMultiSeries[i].push({
				x : time.getTime(),
				y : parseInt(arrCurrentPrice[i])
			});

			// chart.options.data[i].legendText = arrCompany[i]['company'];
		}

		chart.render();
		$(".canvasjs-chart-credit").hide();
	}
	// updateChart();
	changeLanguage(1);
	function changeLanguage(type) {
		// alert(type);
		languageType = type;
		if (type == 1) {
			$("#eng").css('color', '#1bff00');
			$("#myan").css('color', 'white');
			$("#bi").css('color', 'white');
			$("#donutClosingPrice").text("Opening Price");
			// $("#donutOpeningPrice").text("Opeing Price");
			$("#lineCurrentPrice").text("Current Price");
			$("#barChartTurnover").text("Traded Shares");
			$(".currentPriceLabel").text("Current Price");
			$(".tradedShareLable").text("Traded Shares");
			$(".tradedAmtLable").text("Traded Amount");
			$(".diffAmtLable").text("Different Price");
		} else if (type == 2) {
			$("#myan").css('color', '#1bff00');
			$("#bi").css('color', 'white');
			$("#eng").css('color', 'white');
			$("#donutClosingPrice").text("အဖွင့်ဈေး");
			// $("#donutOpeningPrice").text("အဖွင့်ဈေး");
			$("#lineCurrentPrice").text("လက်ရှိဈေး");
			$("#barChartTurnover").text("အရောင်းအဝယ်ဖြစ်သည့်ရှယ်ယာအရေအတွက်");
			$(".currentPriceLabel").text("လက်ရှိဈေ");
			$(".tradedShareLable").text("ရောင်း/ဝယ်ဖြစ်သည့် ရှယ်ယာအရေအတွက်");
			$(".tradedAmtLable").text("ရောင်း/ဝယ်ဖြစ်သည့် ရှယ်ယာပမာဏ");
			$(".diffAmtLable").text("ခြားနားချက်");
			
		} else if (type == 3) {
			$("#bi").css('color', '#1bff00');
			$("#eng").css('color', 'white');
			$("#myan").css('color', 'white');
			$("#donutClosingPrice").text("Opening Price (အဖွင့်ဈေး)");
			// $("#donutOpeningPrice").text("Opening Price (အဖွင့်ဈေး)");
			$("#lineCurrentPrice").text("Current Price (လက်ရှိဈေး)");
			$("#barChartTurnover").text(
					"Traded Shares (အရောင်းအဝယ်ဖြစ်သည့်ရှယ်ယာအရေအတွက်)");
			$(".currentPriceLabel").text("Current Price (လက်ရှိဈေး)");
			$(".tradedShareLable").text("Traded Shares (ရောင်း/ဝယ်ဖြစ်သည့် ရှယ်ယာအရေအတွက်)");
			$(".tradedAmtLable").text("Traded Amount (ရောင်း/ဝယ်ဖြစ်သည့် ရှယ်ယာပမာဏ)");
			$(".diffAmtLable").text("Different Price (ခြားနားချက်)");

		}

		changeTableHeader();

	}
	window.changeLanguage = changeLanguage;
	initialData();

	/* function showBarChart(data, barColors, ykeys, labels) {

		if (data.length > 0) {
			var bar = new Morris.Bar({
				element : 'barChart',
				resize : true,
				data : data,
				barColors : barColors,
				xkey : 'y',
				ykeys : ykeys,
				labels : labels,
				hideHover : 'auto'
			});
		}

	} */
	
	function showBarChart(data) {
/* var bar_data = {
      data : [['FMI', 10,'#123'], ['TMH', 8], ['MCP', 4], ['April', 13], ['May', 17], ['June', 9]],
      color: ['#A41','#FF1']
    }
		//if (data.length > 0) {
			
			 $.plot('#barChart', [bar_data], {
      grid  : {
        borderWidth: 1,
        borderColor: '#f3f3f3',
        tickColor  : '#999'
      },
      series: {
        bars: {
          show    : true,
          barWidth: 0.5,
          align   : 'center'
        }
      },
      xaxis : {
        mode      : 'categories',
        tickLength: 0
      }
    }) */
	 CanvasJS.addColorSet("colorSet",
                arrColor);
	
	if (data.length > 0) {
	var chart = new CanvasJS.Chart("barChart", {
		colorSet:  "colorSet",
	animationEnabled: true,
	theme: "light1", // "light1", "light2", "dark1", "dark2"
	title:{
		text: ""
	},
	axisY: {
		title: "MMK"
	},
	data: [{        
		type: "column",  
		showInLegend: false, 
		legendMarkerColor: "black",
		legendText: "Company",
		dataPoints: data
	}]
});
chart.render();
$('.canvasjs-chart-credit').hide();
	}
			
		//}

	}
	window.showBarChart = showBarChart;
	function changeTableHeader() {
		var strHeader = "<tr>";

		for (var i = 0; i < yse_column_eng.length; i++) {
			
			if(turnoverIndex+1 !=i && tradedAmtIndex+1 !=i){
				strHeader += "<th class='tableHeader' style='font-family: Myanmar Sans Pro;text-align: center;'>";
				if (languageType == 1) {
					strHeader += yse_column_eng[i];
				} else if (languageType == 2) {
					strHeader += yse_column_myan[i];
				} else if (languageType == 3) {
					strHeader += yse_column_eng[i] + "<br/>(" + yse_column_myan[i]
							+ ")";
				}
				strHeader += "</th>";
			}

		}

		strHeader += "</tr>";
		$("#tblHeader").html(strHeader);

	}

	function sideBarMenuAction() {
		$("#main-sidebar").hide();
	}
	window.sideBarMenuAction = sideBarMenuAction;

	function companyPanelAnimation() {
		/*
		 * $(document).width(); $( ".company" ).first().animate({ "left":
		 * "+=100px" }, { duration: 1000, step: function( now, fx ){ $(
		 * ".company" ).slice( 1 ).css( "left", now ); } });
		 */

		/*
		 * $("#divCompanyPanel").animate({left: $(document).width()-200}, 10000,
		 * 'linear', function() { $(this).css('left', 1); showCompanyPanel();
		 * companyPanelAnimation(); });
		 */

		/*
		 * $("#divCompanyPanel").css({"left":'10px'}).show();
		 * 
		 * $("#divCompanyPanel").animate({left:'+=10px'},500);
		 * 
		 * $('#divCompanyPanel').delay(3500).fadeOut(500,companyPanelAnimation);
		 */
		/*
		 * $( ".company" ).animate({ width: "toggle", height: "toggle" }, {
		 * duration: 5000, specialEasing: { width: "linear", height:
		 * "easeOutBounce" }, complete: function() { console.log("com"); } });
		 */
	}
	function initialData() {

		$
				.getJSON(
						"http://localhost:8000/config/config.json",
						function(data) {
							// console.log(data);
							// var output = '<ul>';
							$("#divCompanyPanel").html("");
							var closingPriceList = [];
							var openingPriceList = [];
							$
									.each(
											data,
											function(key, val) {
												// output += '<li>'+ val.name +
												// " " + val.zipcode+ '</li>';

												if (key == "companyList") {
													if (languageType == 1) {
														currentPriceLable = "Current Price";
														tradedShareLable="Traded Shares";
														tradedAmtLable="Traded Amount";
														diffAmtLable="Different Price";
													} else if (languageType == 2) {
														currentPriceLable = "လက်ရှိဈေ";
														tradedShareLable="ရောင်း/ဝယ်ဖြစ်သည့် ရှယ်ယာအရေအတွက်";
														tradedAmtLable="ရောင်း/ဝယ်ဖြစ်သည့် ရှယ်ယာပမာဏ";
														diffAmtLable="ခြားနားချက်";
													} else if (languageType == 3) {
														currentPriceLable = "Current Price (လက်ရှိဈေး)"
														tradedShareLable="Traded Shares (ရောင်း/ဝယ်ဖြစ်သည့် ရှယ်ယာအရေအတွက်)";
														tradedAmtLable="Traded Amount (ရောင်း/ဝယ်ဖြစ်သည့် ရှယ်ယာပမာဏ)";
														diffAmtLable="Different Price (ခြားနားချက်)";
													}
													arrCompany = val;
													arrMultiSeries = [];
													for (var i = 0; i < val.length; i++) {
														console
																.log("JSON Data: "
																		+ val[i]['company']
																		+ " ");

														var htmlCompanyPanel = "<div class='col-lg-2 col-xs-2 company'>"
																+"<div class='box box-widget widget-user'>"
																+ "<div class='widget-user-header bg-aqua-active' style='background:"+arrCompany[i]['color']+" !important'>"
																+ "<h3 class='widget-user-username' style='color: #ffc46c;' id='currentPrice" + i + "'>0</h3>"
																+ "<h5 class='widget-user-desc currentPriceLabel' style='color: white;font-size: 0.9vw;'>"
																+ currentPriceLable
																+"</h5><img id='diffsign" + i + "' align='left' style='display:none' class='diffPriceArrow'/>"
																+ "<h3 class='widget-user-desc' style='color: #ffc46c;'  id='diffAmt" + i + "'>0"
																+ "</h3>"
																+ "<h5 class='widget-user-desc diffAmtLable' style='color: white;font-size: 0.9vw;'>"+diffAmtLable+"</h5>"
																+ "</div>"
																+ "<div class='widget-user-image'>"
																+ "<img  src='../images/"+arrCompany[i]['img']+"' alt='"+arrCompany[i]['company']+"'>"
																+ "</div>"
																+ "<div class='box-footer'>"
																+ "<div class='row'>"
																+ "<div class='col-sm-6 border-right'>"
																+ "<div class='description-block'>"
																+ "<h5 id='tradedShare"+i+"' class='description-header' style='font-size: 1.1vw;'>0</h5>"
																+ "<span style='font-family: Myanmar Sans Pro;font-size: 0.8vw;' class='tradedShareLable'>"+tradedShareLable+"</span>"
																+ " </div>"
																+ "</div>"
																+ "<div class='col-sm-6 border-right'>"
																+ "<div class='description-block'>"
																+ "<h5 id='tradedAmt"+i+"' class='description-header' style='font-size: 1.1vw;'>0</h5>"
																+ "<span style='font-family: Myanmar Sans Pro;font-size: 0.8vw;' class='tradedAmtLable'>"+tradedAmtLable+"</span>"
																+ "</div>"
																+ "</div>"
																+ "</div>"
																+ "</div>"
																+ "</div>";

														
														$("#divCompanyPanel")
																.append(
																		htmlCompanyPanel);
														// alert(val[i]['company']);
														arrClosingPrice
																.push({
																	label : val[i]['company'],
																	data : 0,
																	color : val[i]['color']
																});
														arrColor.push(val[i]['color']);
														/*
														 * var donutObj =
														 * {label:val[i]['company'],data:40,color:val[i]['color']}
														 * closingPriceList.push(donutObj);
														 * 
														 * openingPriceList.push(donutObj);
														 */

														

														// chart.options.data[i].legendText
														// =
														// arrCompany[i]['company'];

														barColors
																.push(val[i]['color'])
														ykeys.push('a' + i)
														labels
																.push(val[i]['company']);

														// setInterval(function(){updateChart()},
														// updateInterval);

														// setInterval(function(){companyPanelAnimation()},
														// 500);
													}
												} else if (key == "yse_column_eng") {
													yse_column_eng = val;
													console.log(yse_column_eng);
												} else if (key == "yse_column_myan") {
													yse_column_myan = val;
													console.log("myan=>"
															+ yse_column_myan);
												} else if (key == "yse_column") {
													yse_column = val;
													console.log("myan=>"
															+ yse_column);
													
													 closingPriceIndex = jQuery.inArray(11, yse_column);
													 currentPriceIndex = jQuery.inArray(9, yse_column);
													 turnoverIndex = jQuery.inArray(13, yse_column);
													 tradedAmtIndex = jQuery.inArray(14, yse_column);
												}
												// showCompanyPanel();
												// companyPanelAnimation();
												changeTableHeader();
												$("#tblBody").html("<tr><td colspan='"+yse_column_eng.length+"'>No record Found.</td></tr>");
												// updateChart();

												// $("#tblBody").html("<tr><td
												// colspan='"+yse_column_eng.length+"'>No
												// record Found.</td></tr>");
												/* showBarChart([], barColors,
														ykeys, labels); */
														
												showBarChart([]);

											});
							// showDonut(closingPriceList,openingPriceList);

						});

	}
	window.initialData = initialData;

	var companyIndex = 0;
	function showCompanyPanel() {
		$("#divCompanyPanel").html("");
		for (var i = companyIndex; i < arrCompany.length; i++) {
			companyIndex = i;
			if (companyIndex > 4) {
				var htmlCompanyPanel = " <div class='col-lg-2 col-xs-2 company' style='min-width:40px;display:none'>"
						+ "<div class='small-box' style='background-color: "
						+ arrCompany[i]['color']
						+ " !important;min-height:50px'>"
						+ "<div class='inner'>"
						+ "<h3 id='currentPrice"
						+ i
						+ "'>-</h3>"
						+ "<p style='font-family: Myanmar Sans Pro;font-size: 21sp;'>"
						+ currentPriceLable
						+ "</p>"
						+ "</div>"
						+ "<div class='icon'>"
						+ "<img src='/images/"
						+ arrCompany[i]['img']
						+ "' style='width: 40px;height: 40px;' alt='"
						+ arrCompany[i]['company'] + "'/>";
				"</div>" + "</div>" + "</div>";
				// alert(htmlCompanyPanel);
				$("#divCompanyPanel").append(htmlCompanyPanel);

			} else {
				var htmlCompanyPanel = " <div class='col-lg-2 col-xs-2 company' style='min-width:40px;'>"
						+ "<div class='small-box' style='background-color: "
						+ arrCompany[i]['color']
						+ " !important;min-height:50px'>"
						+ "<div class='inner'>"
						+ "<h3 id='currentPrice"
						+ i
						+ "'>-</h3>"
						+ "<p style='font-family: Myanmar Sans Pro;font-size: 21sp;'>"
						+ currentPriceLable
						+ "</p>"
						+ "</div>"
						+ "<div class='icon'>"
						+ "<img src='/images/"
						+ arrCompany[i]['img']
						+ "' style='width: 40px;height: 40px;' alt='"
						+ arrCompany[i]['company'] + "'/>";
				"</div>" + "</div>" + "</div>";
				$("#divCompanyPanel").append(htmlCompanyPanel);
			}
			if (companyIndex >= arrCompany.length) {
				companyIndex = 0;
			}

		}

	}
	window.showCompanyPanel = showCompanyPanel;

	/*
	 * $( "#divCompanyPanel" ).animate({ "margin-right": "0", "right": "0" },
	 * 1000 );
	 */

	function showMultiSerieChart() {
		var data = [];
			
		for (var i = 0; i < arrCompany.length; i++) {
			data.push({
				type : "line",
				xValueType : "dateTime",
				yValueFormatString : "####",
				xValueFormatString : "hh:mm:ss TT",
				showInLegend : true,
				name : arrCompany[i]['company'],
				dataPoints : arrMultiSeries[i]
			});
		}

		CanvasJS.addColorSet("colorSet",
                arrColor);
	
	
		
		chart = new CanvasJS.Chart("multiSeriesChart", {
			colorSet:  "colorSet",
			zoomEnabled : true,
			title : {
				text : ""
			},
			axisX : {
				title : ""
			},
			axisY : {
				prefix : "",
				includeZero : false
			},
			toolTip : {
				shared : true
			},
			legend : {
				cursor : "pointer",
				verticalAlign : "top",
				fontSize : 14,
				fontColor : "black",
				itemclick : toggleDataSeries
			},
			data : data
		});
		chart.render();
		$(".canvasjs-chart-credit").hide();
		interval = setInterval(function() {
				updateChart()
			}, updateInterval);
		/*
		 * chart = new CanvasJS.Chart("multiSeriesChart", { zoomEnabled: true,
		 * title: { text: "" }, axisX: { title: "" }, axisY:{ prefix: "",
		 * includeZero: false }, toolTip: { shared: true }, legend: {
		 * cursor:"pointer", verticalAlign: "top", fontSize: 14, fontColor:
		 * "black", itemclick : toggleDataSeries }, data: [{ type: "line",
		 * xValueType: "dateTime", yValueFormatString: "####.00",
		 * xValueFormatString: "hh:mm:ss TT", showInLegend: true, name: "FMI",
		 * dataPoints: dataPoints1 }, { type: "line", xValueType: "dateTime",
		 * yValueFormatString: "####.00", showInLegend: true, name: "TMH" ,
		 * dataPoints: dataPoints2 },{ type: "line", xValueType: "dateTime",
		 * yValueFormatString: "$####.00", showInLegend: true, name: "FPB" ,
		 * dataPoints: dataPoints3 },{ type: "line", xValueType: "dateTime",
		 * yValueFormatString: "$####.00", showInLegend: true, name: "MTSH" ,
		 * dataPoints: dataPoints4 }] });
		 */
	}
	window.showMultiSerieChart = showMultiSerieChart;

	/*
	 * var chart = new CanvasJS.Chart("chartContainer", { zoomEnabled: true,
	 * title: { text: "" }, axisX: { title: "" }, axisY:{ prefix: "",
	 * includeZero: false }, toolTip: { shared: true }, legend: {
	 * cursor:"pointer", verticalAlign: "top", fontSize: 14, fontColor: "black",
	 * itemclick : toggleDataSeries }, data: [{ type: "line", xValueType:
	 * "dateTime", yValueFormatString: "####.00", xValueFormatString: "hh:mm:ss
	 * TT", showInLegend: true, name: "FMI", dataPoints: dataPoints1 }, { type:
	 * "line", xValueType: "dateTime", yValueFormatString: "####.00",
	 * showInLegend: true, name: "TMH" , dataPoints: dataPoints2 },{ type:
	 * "line", xValueType: "dateTime", yValueFormatString: "$####.00",
	 * showInLegend: true, name: "FPB" , dataPoints: dataPoints3 },{ type:
	 * "line", xValueType: "dateTime", yValueFormatString: "$####.00",
	 * showInLegend: true, name: "MTSH" , dataPoints: dataPoints4 }] });
	 * 
	 * function toggleDataSeries(e) { if (typeof(e.dataSeries.visible) ===
	 * "undefined" || e.dataSeries.visible) { e.dataSeries.visible = false; }
	 * else { e.dataSeries.visible = true; } chart.render(); }
	 * 
	 * var updateInterval = 3000; // initial value var yValue1 = 1000; var
	 * yValue2 = 605; var yValue3 = 100; var yValue4 = 300;
	 * 
	 * var time = new Date; // starting at 9.30 am time.setHours(9);
	 * time.setMinutes(30); time.setSeconds(0); time.setMilliseconds(0);
	 *  // generates first set of dataPoints updateChart(100);
	 * setInterval(function(){updateChart()}, updateInterval);
	 */

	// showMultiSerieChart();
	// /updateChart(100);
	// setInterval(function(){updateChart()}, updateInterval);
	function showDonut(closingPriceList) {

		$.plot('#donutChartClosingPrice', closingPriceList, {
			series : {
				pie : {
					show : true,
					radius : 1,
					innerRadius : 0.4,
					label : {
						show : true,
						radius : 2 / 3,
						formatter : labelFormatter
					}

				}
			},
			legend : {
				show : false
			}
		});

		/*
		 * $.plot('#donutChartOpeningPrice', openingPriceList, { series: { pie: {
		 * show : true, radius : 1, innerRadius: 0.4, label : { show : true,
		 * radius : 2 / 3, formatter: labelFormatter, threshold: 0.1 } } },
		 * legend: { show: false } });
		 */
	}
	window.showDonut = showDonut;
	function labelFormatter(label, series) {
		// console.log(Math.round(series.percent));
		return '<div style="font-size:13px; text-align:center; padding:2px; color: #fff; font-weight: 600;">'
				+ label + '<br>' + series.data[0][1] + '</div>'
	}
	window.labelFormatter = labelFormatter;
	// /////
	var socket = io('http://localhost:8000/');

	// On connection with socket, will start receiving the data
	socket.on('news', function(data) {
		function updateData() {
			// Converting the fetched data in FusionCharts
			// format
			/*
			 * <thead> <tr> <th>Rendering engine</th> <th>Browser</th> <th>Platform(s)</th>
			 * <th>Engine version</th> <th>CSS grade</th> </tr> </thead>
			 * <tbody> <tr> <td>Trident</td> <td>Internet Explorer 4.0 </td>
			 * <td>Win 95+</td> <td> 4</td> <td>X</td> </tr> </tbody>
			 */
			// var strData = "&label=" + data.label + "&value=" + data.value;
			// var arr= JSON.parse(data);
			// console.log('data.length'+data);
			/*
			 * var strData ="<thead><tr>"; var array = $.map(data,
			 * function(value, index) { strData += "<th>"+value+"</th>";
			 * return [value]; });
			 */
			// $("#tbl").html('');
			// header
			date = new Date($.now());
			
			// arrClosingPrice=[];
			// arrCurrentPrice = [];

			/*
			 * var arrYSE300header = $.map(data.YSEHeader, function(value,
			 * index) { changeTableHeader();
			 * 
			 * return [value]; });
			 */

			// data
			var strData = "";
			// convert object to array
			var arrData = $.map(data.YSEData, function(value, index) {
				return [ value ];
			});

			var barChartData = [];
			
			var company = "";
			var closingPrice;
			var currentPrice;
			
			for (var i = 0; i < arrData.length - 1; i++) {
				strData += "<tr>";
				var arrData1 = $.map(arrData[i], function(value, index) {
					if (closingPriceIndex + 1 == index) {
						// if(arrClosingPrice[i]["company"] == company){
						arrClosingPrice[i]["data"] = parseFloat(value);
						// alert('closingPrice='+parseFloat(value));
						closingPrice = value;
						/*if(arrCurrentPrice[i] == undefined){
							 arrCurrentPrice[i] = value;
						}
						strData += "<td>" + arrCurrentPrice[i] + "</td>";*/
						
						// }
					} else if (currentPriceIndex + 1 == index) {
						if (value == "" || value == "-") {
							arrCurrentPrice[i] = closingPrice;
							if(isFirstShowMultiSerie==false){
								arrMultiSeries[i] = [ {
															x : time.getTime(),
															y : parseInt(closingPrice)
														} ];
							}else{
								if(arrMultiSeries.length==arrCompany.length)
								{
								arrMultiSeries[i].push({
															x : time.getTime(),
															y : parseInt(closingPrice)
														});
								}else{
									arrMultiSeries[i] = [ {
															x : time.getTime(),
															y : parseInt(value)
														} ];
								}							
							}
						} else {
							arrCurrentPrice[i] = value;
							if(isFirstShowMultiSerie==false){
							arrMultiSeries[i] = [ {
															x : time.getTime(),
															y : parseInt(value)
														} ];
							}else{
								if(arrMultiSeries.length==arrCompany.length)
								{
									arrMultiSeries[i].push({
															x : time.getTime(),
															y : parseInt(value)
													});
								}else{
									arrMultiSeries[i] = [ {
															x : time.getTime(),
															y : parseInt(value)
														} ];
								}	
							}

						}
						currentPrice = arrCurrentPrice[i];
						if(isNaN(parseInt(arrCurrentPrice[i]))){
							$('#currentPrice' + i).text("0");
						}else{
							$('#currentPrice' + i).text(parseInt(arrCurrentPrice[i]).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
						}
						
					} else if (turnoverIndex + 1 == index) {
						if(isNaN(parseInt(value))){
						barChartData.push({ y: 0, label: arrCompany[i]['company'] });
						arrTradedShare[i] = 0;
						$('#tradedShare' + i).text(0);	
						} else {
						barChartData.push({ y: parseInt(value), label: arrCompany[i]['company'] });
						arrTradedShare[i] = value;
						$('#tradedShare' + i).text(value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
						}
						
					} else if (tradedAmtIndex + 1 == index) {
						$('#tradedAmt' + i).text(value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
					}else if (index == 0) {

						company = value;
					}
					if( turnoverIndex+1 !=index && tradedAmtIndex+1 !=index ){
						if(value == "-" || index ==0 || value =="") {
							if(index ==0 ){
							strData += "<td>" + value + "</td>";	
							} else {
							strData += "<td style='text-align:right'>0</td>";	
							}
						}else{
							strData += "<td style='text-align:right'>" + parseInt(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); + "</td>";	
						}
					}
					return [ value ];
				});

				if (parseFloat(closingPrice) != parseFloat(currentPrice)) {
					var diff = parseFloat(currentPrice) - parseFloat(closingPrice);

					if (isNaN(diff)) {
						arrDiffAmt[i]=0;
						strData += "<td style='text-align:right'>0</td>";
					} else {
						arrDiffAmt[i]=diff;
						if(diff < 0 ) {
							strData += "<td style='color:red;margin-top: -5px;text-align:center'>" + diff.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "<img src='../../images/down-arrow02.png' width='20px' height='25vh' align='right'/></td>";	 
						} else { 
							strData += "<td style='color:green;margin-top: -5px;text-align:center'>" + diff.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "<img src='../../images/up-arrow02.png' width='20px' height='25vh' align='right'/></td>";
						}
					}
				} else {
					arrDiffAmt[i]=0;
					strData += "<td style='text-align:right'>0</td>";
				}
				
				$('#diffAmt' + i).text(arrDiffAmt[i].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
				if(parseInt(arrDiffAmt[i]) > 0) {
				document.getElementById("diffAmt"+i).style.color = "#16e616";
				document.getElementById("diffAmt"+i).style.fontweight = "bold";				
				document.getElementById("diffsign"+i).src = "../../images/up-arrow02.png";	
				$("#diffsign"+i).css('display','block');
				} else if(parseInt(arrDiffAmt[i]) < 0){
				document.getElementById("diffAmt"+i).style.color = "red";
				document.getElementById("diffAmt"+i).style.fontweight = "bold";	
				document.getElementById("diffsign"+i).src = "../../images/down-arrow02.png";		
				$("#diffsign"+i).css('display','block');
				}else{
				document.getElementById("diffAmt"+i).style.color = "#ffc46c";
				document.getElementById("diffAmt"+i).style.fontweight = "bold";	
				//document.getElementById("diffsign"+i).src = "../../images/down-arrow02.png";		
				$("#diffsign"+i).css('display','none');
				}
				
				/*tradedShare0
				var arrTradedShare = [];
				var arrTradedAmt = [];*/
				strData += "</tr>";
			}

			/*
			 * if(arrData.length > 0){ barChartData.push({y:'2016' +
			 * strTurnover}); }
			 */
			// strData+="</tbody>"
			// alert(barChartData)
			$("#tblBody").html(strData);

			showDonut(arrClosingPrice);

			

			// alert(barChartData);
			//showBarChart(barChartData, barColors, ykeys, labels);
			//barChartData=[data];
			showBarChart(barChartData);
			
			if(arrData.length > 1 && isFirstShowMultiSerie==false && arrMultiSeries.length==arrCompany.length){
				showMultiSerieChart();
				isFirstShowMultiSerie=true;
			}
			
			if(arrData.length > 1 && arrMultiSeries.length==arrCompany.length) {
				updateChart();
			}else{
				$("#tblBody").html("<tr><td colspan='"+yse_column_eng.length+"'>No record Found.</td></tr>");
			}
			// updateChart();
		}
		// calling the update method
		updateData();

	});
	socket.io.on('connect_error', function(err) {
		// handle server error here
		//alert('Error connecting to server');
		if($('#modal-info').css('display') == 'none')
		{
			$("#modal-info").css("display","block");
			if(interval != null){
				clearInterval(interval);
			}
		}
		
	});
	 
	function exportPDF() {
		
		  var body = $("#body"); 
		  var pdf = new jsPDF("landscape"); 
		  html2canvas(body, {
		  useCORS: true, onrendered: function(canvas) { var
		  imgDonutChartClosingPrice =canvas.toDataURL("image/jpeg,1.0");
		  pdf.addImage(imgDonutChartClosingPrice, 'JPEG', 10, 10, 275, 190);
		  pdf.save('MarketBoardInformation.pdf')
		   } });

	}
	window.exportPDF = exportPDF;
});
