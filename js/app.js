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
        mask: "(***) *** ****"
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

  $("#btn-search").on("click", function (e) {
    e.preventDefault();
    localStorage.clear(); //Clears storage for next request
    email = $('input[type="text"]').val().toLowerCase();

    var x, y;
    regEx = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (email.match(regEx)) {
      x = true;
    } else {
      x = false;
    }

    if (x === true) {
      document
        .querySelector('input[type="text"]')
        .parentNode.classList.remove("error");
      const proxyurl = "";
      const url =
        "https://ltv-data-api.herokuapp.com/api/v1/records.json?email=" + email;
      fetchApi(proxyurl + url)
        .then((response) => response.text())
        .then(function (contents) {
          localStorage.setItem("userObject", contents);
          window.location.href = "result.html";
        })
        .catch((e) => console.log(e));
    } else if (x !== true) {
      document
        .querySelector('input[type="text"]')
        .parentNode.classList.add("error");
    }
  });

  function updateInputTexts() {
    const elem = $(".cta-group .input-group").first();
    elem
      .find("input")
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
    email = $('input[type="text"]').val().toLowerCase();
    regEx = searchOptions.itemOptions[searchOptions.currentItem].regexp;
    if (email.match(regEx)) {
      x = true;
      document
        .querySelector('input[type="text"]')
        .parentNode.classList.remove("error");
    } else {
      x = false;
    }
    keycode = event.keyCode ? event.keyCode : event.which;
    if (keycode == "13") {
      /**
       * Makes a request to ltv API to search an specific email address.
       * If there's a response, it gets stored in the local storage and redirects to results page
       */
      event.preventDefault();
      localStorage.clear(); //Clears storage for next request

      var x, y;

      if (x === true) {
        const proxyurl = "";
        const url =
          "https://ltv-data-api.herokuapp.com/api/v1/records.json?" +
          searchOptions.currentItem +
          "=" +
          email;
        fetchApi(proxyurl + url)
          .then((response) => response.text())
          .then(function (contents) {
            localStorage.setItem("userObject", contents);
            window.location.href = "result.html";
          })
          .catch((e) => console.log(e));
      } else if (x !== true) {
        document
          .querySelector('input[type="text"]')
          .parentNode.classList.add("error");
      }
    }
  });
});
