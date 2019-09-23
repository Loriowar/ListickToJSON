$(document).ready(function(){
  var $result = $('#result');
  var $messages = $('#messages');
  var $resultTextArea = $('#result_text_area');
  var $loading = $('#loading');
  var rbSelector = '.format_selector';
  
  $('#btn_parse_listick').on('click', function(e){
    e.preventDefault();

    browser.tabs.query({'active': true}, function (tabs) {
      let currentTab = tabs[0];

      let tabUrl;
      tabUrl = currentTab.url;
      setErrorMessage(tabUrl, $messages, $loading);

      let tabId = currentTab.id;

      function onExecuted(scriptResult) {
        $loading.hide();
        $messages.html('Всё готово. Вот результат:');
        let textAreaVal;
        if (selectedFormat(rbSelector) === 'yaml') {
          textAreaVal = resultToYAML(scriptResult[0]);
        } else if (selectedFormat(rbSelector) === 'json') {
          textAreaVal = resultToJSON(scriptResult[0]);
        } else {
          textAreaVal = '';
        }
      $resultTextArea.val(textAreaVal);
      }

      function onError(error) {
        $loading.hide();
        $messages.html('Что-то пошло не так. Попробуйте позже или сообщите об ошибке автору.');
      }

      executing = browser.tabs.executeScript(tabId, {file: '/do_listick_parse.js'});
      executing.then(onExecuted, onError);
    });
  });
  
  $('.format_selector').on('change', function(e){
    let resultTextAreaVal = $resultTextArea.val();
    if (resultTextAreaVal !== '') {
      let object, new_result;
      if (selectedFormat(rbSelector) === 'yaml') {
        // was json
        object = $.parseJSON(resultTextAreaVal);
        new_result = resultToYAML(object);
      } else if (selectedFormat(rbSelector) === 'json') {
        // was yaml
        object = jsyaml.load(resultTextAreaVal);
        new_result = resultToJSON(object);
      } else {
        new_result = '';
      }
      
      $resultTextArea.val(new_result);
    }
  });
  
  $( "#dropdown_toggle" ).on('click', function() {
    $( "#donate_variants_container" ).slideToggle( "medium", function() {
      // Animation complete.
    });
  });
})

function setProperBackground(url) {
    if(url.match(/listick\.ru/i)) {
        $('body').css('background-color', 'greenyellow');
    } else {
        $('body').css('background-color', 'salmon');
    }
}

function flushBackground() {
     $('body').css('background-color', 'transparent');
}

function setErrorMessage(url, messageContainer, loadingElement) {
    if(url.match(/listick\.ru/i)) {
        messageContainer.html('Идёт преобразование, подождите немного...');
        loadingElement.show();
    } else {
        messageContainer.html('Текущая страница не является Listick.ru');
    }
}

function resultToJSON(res) {
  return JSON.stringify(res);
}

function resultToYAML(res) {
  return jsyaml.safeDump(res);
}

function selectedFormat(rbSelector) {
  return $(rbSelector + ':checked').val();
}