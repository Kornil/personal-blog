$(document).ready(function(){

  $('#newArticleTextArea').on('change keyup paste', function() {
    $('#preview').text($('#newArticleTextArea').val());
  });

});