(function($) {

  function parseListick(finalCallbackFunction) {
    var result = {};
    var getObjects = [];
    getTabsList().each(function(index, el) {
      getObjects.push(
        $.ajax({
        async: false,
        type: 'GET',
        url: getUrlForGroup(el),
        success: function(data) {
                  var local_context = {};
                  $.each(data.data, function(n_index, n_el) {
                    local_context[n_index] = stripTagsFromString(replacePTagsByNewLine(n_el['text']));
                  });
                  result[getTabName(el)] = local_context;

                  var localResult = {};
                  localResult[getTabName(el)] = local_context;

                  return localResult;
                }
        })
      )
    });
        //$.get(getUrlForGroup(el), function( data ) {
        //  var local_context = {};
        //  $.each(data.data, function(n_index, n_el) {
        //    local_context[n_index] = stripTagsFromString(n_el['text']);
        //  });
        //  result[getTabName(el)] = local_context;

        //  var localResult = {};
        //  localResult[getTabName(el)] = local_context;

        //  return localResult;
        //})
      //);
    //});
  
    $.when.apply($, getObjects).done(function() {
        if ($.isFunction(finalCallbackFunction)) {
          var jsonResult = resultToJSON(result);
          finalCallbackFunction(jsonResult);
        }
    });
  
    return [getObjects, result];
  }
  
  function getTabsList() {
    return  $('.tablink');
  }
  
  function getTabName(el) {
    return $(el).parent('.view').find('.title').html();
  }
  
  function getUrlForGroup(group) {
    return window.location.origin + $(group).attr('href').replace(/#!/, '');
  }
  
  function stripTagsFromString(str) {
    var div = document.createElement("div");
    div.innerHTML = str;
    return div.innerText;
  }
  
  function alternativeStripTagsFromString(str) {
    return str.replace(/<(?:.|)*?>/gm, '\\n')
              .replace(/&nbsp;/g, '')
              .replace(/\\n\\n/g, "\\n");
  }
  
  function replacePTagsByNewLine(str) {
    if (str != undefined) {
      return str.replace(/<p>(.*?)<\/p>/g, "$1\n");
    } else {
      return '';
    }
  }
  
  function resultToJSON(res) {
    return JSON.stringify(res);
  }
  
  return parseListick(null)
})( jQuery );