(function($) {
  function promiseParseListick() {
    let promiseRequests = getTabsList().map((el) => {
      let url = getUrlForGroup(el);
      let tab_name = getTabName(el);
      return getData(url, tab_name);
    });

    let result = [];

    return new Promise(function (resolve, reject) {
      Promise.all(promiseRequests).then(function (responses) {
        result = responses.reduce((acc, response) => {
          acc[response.name] = response.data.data.map((el) => stripTagsFromString(replacePTagsByNewLine(el['text'])));
          return acc;
        }, {});
        return resolve(result);
      }).catch((error) => reject(error));
    })
  }

  function getXMLHttp(){
    try {
      return XPCNativeWrapper(new window.wrappedJSObject.XMLHttpRequest());
    }
    catch(evt) {
      return new XMLHttpRequest();
    }
  }

  function getData(url, tab_name) {
    return new Promise(function (resolve, reject) {
      let xhr = new getXMLHttp();
      xhr.open('GET', url, true);
      xhr.responseType = 'json';
      xhr.onload = () => resolve({name: tab_name, data: xhr.response});
      xhr.onerror = () => reject(xhr.status);
      xhr.send(null);
    });
  }

  function getTabsList() {
    return  $('.tablink').toArray();
  }
  
  function getTabName(el) {
    return $(el).parent('.view').find('.title').html();
  }
  
  function getUrlForGroup(group) {
    return window.location.origin + $(group).attr('href').replace(/#!/, '');
  }
  
  function stripTagsFromString(str) {
    let div = document.createElement("div");
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

  return promiseParseListick();
})( jQuery );
