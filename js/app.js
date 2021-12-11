$(document).ready(function () {
  const searchOptions = {
    // currentItem can be oneOf 'email', 'phone'
    currentItem: "email",
    itemOptions: {
      email: {
        regexp: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
        errorText: "Please enter a valid email address",
        placeholderText: "Enter an Email Address",
        mask: null,
      },
      phone: {
        regexp: /^[\d]{10}$/,
        errorText: "Please enter a valid phone number",
        placeholderText: "Enter a phone number",
      },
    },
  };

  // Decorator function for API calls.
  const showLoading = () => {
    $(".hide-loading").addClass("d-none");
    $(".show-loading").removeClass("d-none");
  };

  const hideLoading = () => {
    $(".hide-loading").removeClass("d-none");
    $(".show-loading").addClass("d-none");
  };

  function fetchApi() {
    return new Promise((res, rej) => {
      showLoading();
      fetch
        .apply(this, arguments)
        .then((resp) => {
          res(resp);
          // because of page reload there is a flickering issue, hence not hiding the loading icon on successfull result
        })
        .catch((err) => {
          rej(err);
          hideLoading();
        });
    });
  }

  function searchForResults(shouldFetch) {
    const searchText = $('input[type="text"]').val().toLowerCase();
    const regEx = searchOptions.itemOptions[searchOptions.currentItem].regexp;

    if (searchText.match(regEx)) {
      document
        .querySelector('input[type="text"]')
        .parentNode.classList.remove("error");
    } else {
      document
        .querySelector('input[type="text"]')
        .parentNode.classList.add("error");
      return
    }

    if (shouldFetch) {
      /**
       * Makes a request to ltv API to search an specific searchText address.
       * If there's a response, it gets stored in the local storage and redirects to results page
       */
      localStorage.clear(); //Clears storage for next request

      const proxyurl = "";
      const url =
        "https://ltv-data-api.herokuapp.com/api/v1/records.json?" +
        searchOptions.currentItem +
        "=" +
        searchText;
      fetchApi(proxyurl + url)
        .then((response) => response.text())
        .then(function (contents) {
          localStorage.setItem("userObject", contents);
          window.location.href = "result.html";
        })
        .catch((e) => console.log(e));
    }
  }

  $("#btn-search").on("click", function (e) {
    e.preventDefault();
    searchForResults(true);
  });

  function updateInputTexts() {
    const elem = $(".cta-group .input-group").first().removeClass('error');
    elem
      .find("input")
      .val('')
      .attr(
        "placeholder",
        searchOptions.itemOptions[searchOptions.currentItem].placeholderText
      );

    elem
      .find(".error-msg")
      .text(searchOptions.itemOptions[searchOptions.currentItem].errorText);
  }

  $(".type-selector .nav-link").click((ev) => {
    searchOptions.currentItem = $(ev.currentTarget).attr("aria-controls");
    updateInputTexts();
  });

  $('input[type="text"]').keypress(function (event) {
    const keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode === '13') {
      event.preventDefault();
      searchForResults(true);
    } else {
      searchForResults(false);
    }
  });
});
