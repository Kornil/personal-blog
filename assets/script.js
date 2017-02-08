$(document).ready(function(){

  $('#newArticleTitle, #newArticleSubtitle, #newArticleTextArea').on('change keyup paste', function() {
    $('#preview').html(
      marked(
        "<h1>"+$('#newArticleTitle').val()+"</h1>"+
        "<h2>"+$('#newArticleSubtitle').val()+"</h2>"+
        $('#newArticleTextArea').val()
      )
    );
  });

});
