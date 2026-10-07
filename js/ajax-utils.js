(function (global) {

  var ajaxUtils = {};

  function getRequestObject() {

    if (window.XMLHttpRequest) {
      return new XMLHttpRequest();
    }

    else if (window.ActiveXObject) {
      return new ActiveXObject("Microsoft.XMLHTTP");
    }

    else {
      global.alert("Ajax is not supported!");
      return null;
    }
  }


  ajaxUtils.sendGetRequest =
    function (requestUrl, responseHandler, isJsonResponse) {

      var request = getRequestObject();

      if (!request) {
        return;
      }


      request.onreadystatechange =
        function () {

          if (request.readyState == 4) {

            if (request.status == 200) {

              if (isJsonResponse == undefined) {
                isJsonResponse = true;
              }


              if (isJsonResponse) {

                try {

                  responseHandler(
                    JSON.parse(request.responseText)
                  );

                }

                catch (error) {

                  console.error(
                    "JSON parsing error:",
                    error
                  );

                }

              }

              else {

                responseHandler(
                  request.responseText
                );

              }

            }

            else {

              console.error(
                "Request failed:",
                requestUrl,
                "Status:",
                request.status
              );

            }

          }

        };


      request.open(
        "GET",
        requestUrl,
        true
      );


      request.send(null);

    };


  global.$ajaxUtils = ajaxUtils;

})(window);
