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

  var homeHtmlUrl =
    "snippets/home-snippet.html";

  var allCategoriesUrl =
    "https://coursera-jhu-default-rtdb.firebaseio.com/categories.json";

  var categoriesTitleHtml =
    "snippets/categories-title-snippet.html";

  var categoryHtml =
    "snippets/category-snippet.html";

  var menuItemsUrl =
    "https://coursera-jhu-default-rtdb.firebaseio.com/menu_items/";

  var menuItemsTitleHtml =
    "snippets/menu-items-title.html";

  var menuItemHtml =
    "snippets/menu-item.html";


  // Stores all categories
  var currentCategories = [];


  // Stores the currently selected random category
  var currentSpecialShortName = "";


  // Convenience function for inserting HTML
  var insertHtml = function (selector, html) {

    var targetElem =
      document.querySelector(selector);

    if (targetElem) {

      targetElem.innerHTML = html;

    }

  };


  // Show loading icon
  var showLoading = function (selector) {

    var html =
      "<div class='text-center'>";

    html +=
      "<img src='images/ajax-loader.gif'>";

    html +=
      "</div>";

    insertHtml(
      selector,
      html
    );

  };


  // Replace {{property}} with value
  var insertProperty =
    function (string, propName, propValue) {

      var propToReplace =
        "{{" + propName + "}}";

      string =
        string.replace(
          new RegExp(propToReplace, "g"),
          propValue
        );

      return string;

    };


  // Remove active from Home
  // and activate Menu
  var switchMenuToActive = function () {

    var homeButton =
      document.querySelector(
        "#navHomeButton"
      );

    var menuButton =
      document.querySelector(
        "#navMenuButton"
      );


    if (homeButton) {

      var classes =
        homeButton.className;

      classes =
        classes.replace(
          new RegExp("active", "g"),
          ""
        );

      homeButton.className =
        classes;

    }


    if (menuButton) {

      var menuClasses =
        menuButton.className;

      if (
        menuClasses.indexOf("active") === -1
      ) {

        menuClasses +=
          " active";

        menuButton.className =
          menuClasses;

      }

    }

  };


  // Page loaded
  document.addEventListener(
    "DOMContentLoaded",
    function (event) {

      showLoading(
        "#main-content"
      );


      $ajaxUtils.sendGetRequest(

        allCategoriesUrl,

        buildAndShowHomeHTML,

        true

      );

    }

  );


  // Build Home Page
  function buildAndShowHomeHTML(categories) {

    currentCategories =
      categories;


    var chosenCategory =
      chooseRandomCategory(
        categories
      );


    currentSpecialShortName =
      chosenCategory.short_name;


    $ajaxUtils.sendGetRequest(

      homeHtmlUrl,

      function (homeHtml) {

        var homeHtmlToInsertIntoMainPage =
          insertProperty(

            homeHtml,

            "randomCategoryShortName",

            "'" +
            chosenCategory.short_name +
            "'"

          );


        insertHtml(

          "#main-content",

          homeHtmlToInsertIntoMainPage

        );

      },

      false

    );

  }


  // Choose random category
  function chooseRandomCategory(categories) {

    var randomArrayIndex =
      Math.floor(
        Math.random() *
        categories.length
      );


    return categories[
      randomArrayIndex
    ];

  }


  // Choose a random category
  // different from the current one
  function chooseDifferentRandomCategory(
    categories,
    currentShortName
  ) {

    if (categories.length <= 1) {

      return categories[0];

    }


    var chosenCategory;


    do {

      chosenCategory =
        chooseRandomCategory(
          categories
        );

    }

    while (
      chosenCategory.short_name ===
      currentShortName
    );


    return chosenCategory;

  }


  // RANDOM AGAIN
  dc.randomizeSpecials =
    function () {

      if (
        !currentCategories ||
        currentCategories.length === 0
      ) {

        $ajaxUtils.sendGetRequest(

          allCategoriesUrl,

          function (categories) {

            currentCategories =
              categories;


            loadRandomSpecial();

          },

          true

        );


        return;

      }


      loadRandomSpecial();

    };


  // Load another random special
  function loadRandomSpecial() {

    var chosenCategory =
      chooseDifferentRandomCategory(

        currentCategories,

        currentSpecialShortName

      );


    currentSpecialShortName =
      chosenCategory.short_name;


    dc.loadMenuItems(
      chosenCategory.short_name
    );

  }


  // Load Menu Categories
  dc.loadMenuCategories =
    function () {

      showLoading(
        "#main-content"
      );


      $ajaxUtils.sendGetRequest(

        allCategoriesUrl,

        buildAndShowCategoriesHTML

      );

    };


  // Load Menu Items
  dc.loadMenuItems =
    function (categoryShort) {

      showLoading(
        "#main-content"
      );


      currentSpecialShortName =
        categoryShort;


      $ajaxUtils.sendGetRequest(

        menuItemsUrl +
        categoryShort +
        ".json",

        buildAndShowMenuItemsHTML

      );

    };


  // Build Categories Page
  function buildAndShowCategoriesHTML(
    categories
  ) {

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


  // Build Categories View
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
        "" +
        categories[i].name;


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


      finalHtml +=
        html;

    }


    finalHtml +=
      "</section>";


    return finalHtml;

  }


  // Build Menu Items Page
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


  // Build Menu Items View
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


    // RANDOM AGAIN BUTTON
    finalHtml +=
      "<div style='" +
      "text-align:center;" +
      "margin:20px 0;" +
      "'>" +

      "<button " +
      "type='button' " +

      "onclick='$dc.randomizeSpecials();' " +

      "style='" +
      "padding:10px 25px;" +
      "background-color:#61122f;" +
      "color:white;" +
      "border:none;" +
      "cursor:pointer;" +
      "font-size:16px;" +
      "border-radius:4px;" +
      "'>" +

      "Random Again" +

      "</button>" +

      "</div>";


    finalHtml +=
      "<section class='row'>";


    // Menu Items
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


      // Clear after every second item
      if (i % 2 !== 0) {

        html +=
          "<div class='clearfix " +
          "visible-lg-block " +
          "visible-md-block'>" +
          "</div>";

      }


      finalHtml +=
        html;

    }


    finalHtml +=
      "</section>";


    return finalHtml;

  }


  // Insert Price
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
      "$" +
      priceValue.toFixed(2);


    html =
      insertProperty(

        html,

        pricePropName,

        priceValue

      );


    return html;

  }


  // Insert Portion Name
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
      "(" +
      portionValue +
      ")";


    html =
      insertProperty(

        html,

        portionPropName,

        portionValue

      );


    return html;

  }


  // Expose dc
  global.$dc =
    dc;


})(window);
