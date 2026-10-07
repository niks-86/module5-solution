$(function () {
  $("#navbarToggle").blur(function (event) {
    var screenWidth = window.innerWidth;
    if (screenWidth < 768) {
      $("#collapsable-nav").collapse('hide');
    }
  });
});


(function (global) {

var dc = {};
var homeHtmlUrl = "snippets/home-snippet.html";
var allCategoriesUrl =
  "https://coursera-jhu-default-rtdb.firebaseio.com/categories.json";
var categoriesTitleHtml = "snippets/categories-title-snippet.html";
var categoryHtml = "snippets/category-snippet.html";
var menuItemsUrl =
  "https://coursera-jhu-default-rtdb.firebaseio.com/menu_items/";
var menuItemsTitleHtml = "snippets/menu-items-title.html";
var menuItemHtml = "snippets/menu-item.html";

var currentCategories = [];


// Convenience function for inserting innerHTML
var insertHtml = function (selector, html) {
  var targetElem = document.querySelector(selector);
  if (targetElem) {
    targetElem.innerHTML = html;
  }
};


// Show loading icon
var showLoading = function (selector) {
  var html = "<div class='text-center'>";
  html += "<img src='images/ajax-loader.gif'></div>";
  insertHtml(selector, html);
};


// Return substitute of '{{propName}}'
// with propValue in given 'string'
var insertProperty = function (string, propName, propValue) {
  var propToReplace = "{{" + propName + "}}";

  string = string.replace(
    new RegExp(propToReplace, "g"),
    propValue
  );

  return string;
};


// Remove active from Home and activate Menu
var switchMenuToActive = function () {

  var classes = document.querySelector("#navHomeButton").className;

  classes = classes.replace(
    new RegExp("active", "g"),
    ""
  );

  document.querySelector("#navHomeButton").className = classes;


  classes = document.querySelector("#navMenuButton").className;

  if (classes.indexOf("active") === -1) {
    classes += " active";
    document.querySelector("#navMenuButton").className = classes;
  }
};


// On page load
document.addEventListener("DOMContentLoaded", function (event) {

  showLoading("#main-content");

  $ajaxUtils.sendGetRequest(
    allCategoriesUrl,
    buildAndShowHomeHTML,
    true
  );

});


// Builds HTML for the home page
function buildAndShowHomeHTML(categories) {

  currentCategories = categories;

  $ajaxUtils.sendGetRequest(
    homeHtmlUrl,

    function (homeHtml) {

      var chosenCategory =
        chooseRandomCategory(categories);

      var chosenCategoryShortName =
        chosenCategory.short_name;


      var homeHtmlToInsertIntoMainPage =
        insertProperty(
          homeHtml,
          "randomCategoryShortName",
          "'" + chosenCategoryShortName + "'"
        );


      insertHtml(
        "#main-content",
        homeHtmlToInsertIntoMainPage
      );


      var randomText =
        document.querySelector("#random-specials-text");

      if (randomText) {
        randomText.innerHTML =
          "Random Pick: " + chosenCategory.name;
      }

    },

    false
  );
}


// Choose random category
function chooseRandomCategory(categories) {

  var randomArrayIndex =
    Math.floor(
      Math.random() * categories.length
    );

  return categories[randomArrayIndex];
}


// RANDOM AGAIN BUTTON
dc.randomizeSpecials = function () {

  if (!currentCategories || currentCategories.length === 0) {

    $ajaxUtils.sendGetRequest(
      allCategoriesUrl,

      function (categories) {

        currentCategories = categories;

        chooseAndUpdateSpecial();

      },

      true
    );

    return;
  }


  chooseAndUpdateSpecial();
};


function chooseAndUpdateSpecial() {

  var chosenCategory =
    chooseRandomCategory(currentCategories);

  var chosenCategoryShortName =
    chosenCategory.short_name;


  var specialsLink =
    document.querySelector("#specials-link");


  if (specialsLink) {

    specialsLink.setAttribute(
      "onclick",
      "$dc.loadMenuItems('" +
      chosenCategoryShortName +
      "'); return false;"
    );

  }


  var randomText =
    document.querySelector("#random-specials-text");


  if (randomText) {

    randomText.innerHTML =
      "Random Pick: " +
      chosenCategory.name;

  }

}


// Load menu categories
dc.loadMenuCategories = function () {

  showLoading("#main-content");

  $ajaxUtils.sendGetRequest(
    allCategoriesUrl,
    buildAndShowCategoriesHTML
  );

};


// Load menu items
dc.loadMenuItems = function (categoryShort) {

  showLoading("#main-content");

  $ajaxUtils.sendGetRequest(
    menuItemsUrl +
    categoryShort +
    ".json",

    buildAndShowMenuItemsHTML
  );

};


// Build categories HTML
function buildAndShowCategoriesHTML(categories) {

  $ajaxUtils.sendGetRequest(

    categoriesTitleHtml,

    function (categoriesTitleHtml) {

      $ajaxUtils.sendGetRequest(

        categoryHtml,

        function (categoryHtml) {

          switchMenuToActive();

          var categoriesViewHtml =
            buildCategoriesViewHtml(
              categories,
              categoriesTitleHtml,
              categoryHtml
            );

          insertHtml(
            "#main-content",
            categoriesViewHtml
          );

        },

        false
      );

    },

    false
  );

}


// Build categories view
function buildCategoriesViewHtml(
  categories,
  categoriesTitleHtml,
  categoryHtml
) {

  var finalHtml =
    categoriesTitleHtml;

  finalHtml +=
    "<section class='row'>";


  for (
    var i = 0;
    i < categories.length;
    i++
  ) {

    var html =
      categoryHtml;

    var name =
      "" + categories[i].name;

    var short_name =
      categories[i].short_name;


    html =
      insertProperty(
        html,
        "name",
        name
      );


    html =
      insertProperty(
        html,
        "short_name",
        short_name
      );


    finalHtml += html;

  }


  finalHtml +=
    "</section>";


  return finalHtml;
}


// Build menu items HTML
function buildAndShowMenuItemsHTML(
  categoryMenuItems
) {

  $ajaxUtils.sendGetRequest(

    menuItemsTitleHtml,

    function (menuItemsTitleHtml) {

      $ajaxUtils.sendGetRequest(

        menuItemHtml,

        function (menuItemHtml) {

          switchMenuToActive();


          var menuItemsViewHtml =
            buildMenuItemsViewHtml(
              categoryMenuItems,
              menuItemsTitleHtml,
              menuItemHtml
            );


          insertHtml(
            "#main-content",
            menuItemsViewHtml
          );

        },

        false
      );

    },

    false
  );

}


// Build menu items view
function buildMenuItemsViewHtml(
  categoryMenuItems,
  menuItemsTitleHtml,
  menuItemHtml
) {

  menuItemsTitleHtml =
    insertProperty(
      menuItemsTitleHtml,
      "name",
      categoryMenuItems.category.name
    );


  menuItemsTitleHtml =
    insertProperty(
      menuItemsTitleHtml,
      "special_instructions",
      categoryMenuItems.category.special_instructions
    );


  var finalHtml =
    menuItemsTitleHtml;

  finalHtml +=
    "<section class='row'>";


  var menuItems =
    categoryMenuItems.menu_items;

  var catShortName =
    categoryMenuItems.category.short_name;


  for (
    var i = 0;
    i < menuItems.length;
    i++
  ) {

    var html =
      menuItemHtml;


    html =
      insertProperty(
        html,
        "short_name",
        menuItems[i].short_name
      );


    html =
      insertProperty(
        html,
        "catShortName",
        catShortName
      );


    html =
      insertItemPrice(
        html,
        "price_small",
        menuItems[i].price_small
      );


    html =
      insertItemPortionName(
        html,
        "small_portion_name",
        menuItems[i].small_portion_name
      );


    html =
      insertItemPrice(
        html,
        "price_large",
        menuItems[i].price_large
      );


    html =
      insertItemPortionName(
        html,
        "large_portion_name",
        menuItems[i].large_portion_name
      );


    html =
      insertProperty(
        html,
        "name",
        menuItems[i].name
      );


    html =
      insertProperty(
        html,
        "description",
        menuItems[i].description
      );


    if (i % 2 !== 0) {

      html +=
        "<div class='clearfix visible-lg-block visible-md-block'></div>";

    }


    finalHtml += html;

  }


  finalHtml +=
    "</section>";


  return finalHtml;
}


// Insert price
function insertItemPrice(
  html,
  pricePropName,
  priceValue
) {

  if (!priceValue) {

    return insertProperty(
      html,
      pricePropName,
      ""
    );

  }


  priceValue =
    "$" + priceValue.toFixed(2);


  html =
    insertProperty(
      html,
      pricePropName,
      priceValue
    );


  return html;
}


// Insert portion name
function insertItemPortionName(
  html,
  portionPropName,
  portionValue
) {

  if (!portionValue) {

    return insertProperty(
      html,
      portionPropName,
      ""
    );

  }


  portionValue =
    "(" + portionValue + ")";


  html =
    insertProperty(
      html,
      portionPropName,
      portionValue
    );


  return html;
}


global.$dc = dc;

})(window);
