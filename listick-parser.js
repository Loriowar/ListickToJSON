function parseListick() {
  var result = {};
  getTabsList().each(function(index, el) {
    $.get(getUrlForGroup(el), function( data ) {
      var local_context = {};
      $.each(data.data, function(n_index, n_el) {
        local_context[n_index] = stripTagsFromString(n_el['text']);
      });
      result[getTabName(el)] = local_context;
    });
  });
  return result;
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

function resultToJSON(res) {
  return JSON.stringify(res);
}

