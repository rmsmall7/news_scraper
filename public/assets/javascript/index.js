$(document).ready(function() {
  var articleContainer = $(".article-container");
  $(document).on("click", ".btn.save", handleArticleSave);
  $(document).on("click", ".scrape-new", handleArticleScrape);
  $(".clear").on("click", handleArticleClear);

  function initPage() {
    $.get("/api/headlines?saved=false")
    .then(function(data) {
      articleContainer.empty();

      if (data && data.length) {
        renderArticles(data);
      } else {
        renderEmpty();
      }
    });
  }

  function renderArticles(articles) {
    var articleCards = [];

    for (var i = 0; i < articles.length; i++) {
      articleCards.push(createCard(articles[i]));
    }
    articleContainer.append(articleCards);
  }

  function createCard(article) {
   var card = $("<div class='card'>");
   var cardHead = $("<div class='card-header'>").append(
     $("<h3>").append(
       $("<a class='article-link; targer='_blank' rel='noopener noreferrer'>")
       .attr("href", article.url)
       .text(article.headline),
       $("<a class='btn btn-success save'>Save Article</a>")
     )
   );

   var cardBody = $("<div class='card-body'>").text(article.summary);

   card.append(cardHead, cardBody);

   card.data("_id", article._id);
   return card;
  }

  function renderEmpty() {
    var emptyAlert = 
    $(["<div class='alert alert-warning text-center'>",
    "<h4> Oh no! There are no new articles </h4>",
    "</div>",
    "<div class='panel panel-default'>",
    "<div class='panel-heading text-center'>",
    "<h3> What would you like to do?</h3>",
    "</div>",
    "<div class='panel-body text-center'>",
    "<h4><a class='scrape-new'>Try scraping new articles</a></h4>",
    "<h4><a href='/saved'>Go to Saved Articles</a></h4>",
    "</div>",
    "</div>"
  ].join(""));
  articleContainer.append(emptyAlert);
  }

  function handleArticleSave() {
    var articleToSave = $(this).parents(".card").data();

    $(this).parents(".card").remove();

    articleToSave.saved = true;
    console.log(articleToSave);

    $.ajax({
      method: "PUT",
      url: "/api/headlines/" + articleToSave._id,
      data: articleToSave
    })
    .then(function(data) {
      console.log(data)
      if (data) {
       location.reload();
      }
    });
  }

  function handleArticleScrape() {
    $.get("/api/fetch")
    .then(function(data) {
      // initPage();
      // bootbox.alert("<h3 class='text-center m-top-80'>" + data.message + "<h3>");
      console.log(data)
      window.location.href ="/";
    });
  }

  function handleArticleClear() {
    $.get("api/clear").then(function(data){
      console.log(data)
      articleContainer.empty();
      location.reload();
    });
  }
});