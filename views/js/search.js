// Global
var query = "dog+cat"; //store query incase user wants more results from said query (pagination)
var host = "http://localhost:3000/api/search?";
var currentPage = 1;

// Get query from user
$("#queryform").submit(function(event) {
    event.preventDefault();
    query = $(this).find('input[type="text"]').val().replace(" ", "+");
    //getResults(query);
});

// Next page of results
$("#nextpage").click(function(event) {
    event.preventDefault();
    currentPage += 1
    query = query + "&" + currentPage;
    //getResults(query);
});

// Prev Page
$("#prevpage").click(function(event) {
    event.preventDefault();
    if (currentPage != 1) {
        currentPage -= 1
        query += "&" + currentPage;
    }
});


// Create CURL and send  respone
function getResults(query) {
    $.ajax({
      url: host,
      dataType: 'jsonp',
      type: 'get',
      success: function(data) {
        var json_response = data;
      }
    });

    // Add results to table
    //$('#result-table > tbody:last').append('<tr><td>'result here'</td></tr>');
}
