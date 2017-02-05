$(document).ready(function(){

  $('#newArticleTextArea').on('change keyup paste', function() {
    $('#preview').html(marked($('#newArticleTextArea').val()));
  });

});
