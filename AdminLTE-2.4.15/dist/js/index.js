

  var socket = io('http://localhost:8000/');
        
//On connection with socket, will start receiving the data
      socket.on('news', function (data) {
        function updateData() {
                         //Converting the fetched data in FusionCharts format
            var strData = "&label=" + data.label + "&value=" + data.value;
			console.log(strData);
        }
        //calling the update method
        updateData();

     });

