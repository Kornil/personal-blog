$(document).ready(function(){

  $('#newArticleTextArea').on('change keyup paste', function() {
    $('#preview').html(
      marked($('#newArticleTitle').val()),
      marked($('#newArticleSubtitle').val()),
      marked(
        "<h1>"+$('#newArticleTitle').val()+"</h1>"+
        "<h2>"+$('#newArticleSubtitle').val()+"</h2>"+
        $('#newArticleTextArea').val()
      )
      );
  });

});
