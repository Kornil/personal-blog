$(document).ready(function () {
  $('#newArticleTitle, #newArticleSubtitle, #newArticleTextArea').on('change keyup paste', function() {
    $('#preview').html(
      marked(
        "<h1>" + $('#newArticleTitle').val() + "</h1>" +
        "<h2>" + $('#newArticleHeading').val() + "</h2>" +
        $('#newArticleTextArea').val(),
      ),
    );
  });

  $('#comments-new').on('change keyup paste', function () {
    $('#comments-preview').html(
      marked( $('#comments-new').val()),
    );
  });
});
