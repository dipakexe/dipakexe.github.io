function handle_scrolling() {
  /**
   * The UI is similar to a book. When the user scrolls on desktop or mobile the pages slides alongwith swipes or wheel movement..
   */

  const sections = document.querySelectorAll(".page");

  /**
   * The current page index is `current_page_index`, which is 0 initially, Indicating the first page.
   */

  let current_page_index = 0;

  /**
   * `page_number` is shown at the bottom-right corner.
   */

  const page_number = window.document.querySelectorAll(".page-number")[0];

  /**
   * A common utility function for scrolling pages.
   */
  function scroll_to_current_page_index() {
    /**
     * This takes the the page pointed by the current page index to the user's visual area.
     */
    window.document.querySelectorAll(".page-number")[0].textContent =
      current_page_index + 1;
    sections[current_page_index].scrollIntoView({
      behavior: "smooth",
    });
  }

  if ("ontouchstart" in window || navigator.maxTouchPoints) {
    /**
     * If their are touch related callbacks available then we will apply logic for scrolling with finger swipe.
     * For touch screens where we are interested in the vertical movement of finger tip. It's an event like a swipe.
     */

    let touch_start_y;
    let touch_delta = 0;
    let swipe_direction;

    function handle_touch_start(event) {
      /**
       * Get the first touch point's vertical postition. Whenever a new touch is initialted we update this.
       */
      touch_start_y = event.touches[0].clientY;
    }

    function handle_touch_move(event) {
      /**
       * Update the change in position of the touch tip untill it stops.
       */
      touch_delta = event.touches[0].clientY - touch_start_y;
    }

    function handle_touch_end(event) {
      /**
       * When the touch event end we check whether the touch was upwards or downwards.
       * We move the page by updating the current page index according to it.
       */
      swipe_direction = touch_delta < 0 ? "up" : "down";

      if (swipe_direction == "up" && current_page_index < sections.length - 1) {
        current_page_index++;
      } else if (swipe_direction == "down" && current_page_index > 0) {
        current_page_index--;
      } else if (
        swipe_direction == "up" &&
        current_page_index === sections.length - 1
      ) {
        current_page_index = 0;
      } else if (swipe_direction == "down" && current_page_index === 0) {
        current_page_index = sections.length - 1;
      }

      scroll_to_current_page_index();
    }

    document.addEventListener("touchstart", handle_touch_start);
    document.addEventListener("touchmove", handle_touch_move);
    document.addEventListener("touchend", handle_touch_end);
  } else if (
    !("ontouchstart" in window || navigator.maxTouchPoints) &&
    window.innerWidth > 768
  ) {
    /**
     * If we don't have touch events and the screen size is larger than a threshold then we assume it is a desktop device.
     */

    function handle_wheel_movement_on_larger_screen(event) {
      /**
       *
       *  This callback works for desktop screens.
       *
       *  The value of deltaY is the change in position of wheel due to scrolling.
       *
       *  If the change is positive then scroll down.
       *  Else scroll up.
       *
       *  The scroll happends by updating (incrementing or decrementing) the `current_page_index`.
       *  Then we call `scroll_to_current_page_index()` to scroll to the page index
       *
       *  This also goes to the top or bottom on reaching the bottom or top ends respectively when user further scrolls to reach to the extream ends of the page.
       *
       */

      if (event.deltaY > 0 && current_page_index < sections.length - 1) {
        current_page_index++;
      } else if (event.deltaY < 0 && current_page_index > 0) {
        current_page_index--;
      }

      // Upto this part is for the normal scrolling
      else if (event.deltaY > 0 && current_page_index === sections.length - 1) {
        /**
         * This is to go to the top on reaching to the bottom and scrolling further.
         */

        current_page_index = 0;
      } else if (event.deltaY < 0 && current_page_index === 0) {
        /**
         * To go to the bottom on reaching to the top yet scrolling upwards.
         */

        current_page_index = sections.length - 1;
      }

      scroll_to_current_page_index();
    }

    document.addEventListener("wheel", handle_wheel_movement_on_larger_screen);
  }
}

function update_gradient() {
  /**
   * This callback is for updation the background color based on the scroll postino of the page.
   */
  const body = document.body;
  const scroll_percentage =
    (window.scrollY + window.innerHeight) /
    document.documentElement.scrollHeight;
  const gradient_value = `linear-gradient( to bottom, #607bf4 0%, #0d2364 ${
    scroll_percentage * 100
  }%)`;
  body.style.background = gradient_value;
}

window.onload = function () {
  /**
   * On the HTML page is fully loaded we are intended to apply the callbacks, and start the bubble animation on the background.
   */

  try {
    update_gradient();
    window.addEventListener("scroll", update_gradient);
    handle_scrolling();
    create_bubbles();
  } catch (error) {
    console.log(error);
  }
};

const create_bubbles = () => {
  /**
   * Crating bubbles for the background. These bubbles will be created dynamically.
   * The Size of them and the interval of bubble creation will be determined randomly.
   */

  const bubbles_container = document.querySelector(".bubbles");

  function create_bubble() {
    /**
     * Crrate a `div` element and set the styles, animation for it them make it visible by adding it to the page.
     * The `div.bubbles` is the entry point of the bubbles. Its situated in the botom so that the bubbles can appeare from the bottom.
     */
    const bubble = document.createElement("div");
    bubble.className = "bubble";
    const random_radius = Math.random() * 10 + 10;
    bubble.style.width = `${random_radius}px`;
    bubble.style.height = `${random_radius}px`;
    bubble.style.borderRadius = "50%";
    bubble.style.position = "absolute";
    bubble.style.background = `linear-gradient(to bottom, #87dcff, #87CEFA)`;
    bubble.style.zIndex = "100";
    bubble.style.boxShadow = "0px 0px 1px rgba(27, 14, 216, 0.67)";

    const random_position = `${Math.random() * 90 + 5}vw`;
    bubble.style.left = random_position;

    bubbles_container.appendChild(bubble);

    const animation_duration = Math.random() * 300 + 4000;
    bubble.animate(
      [
        {
          transform: "translateY(0)",
          opacity: 1,
        },
        {
          transform: "translateY(-100vh)",
          opacity: 0,
        },
      ],
      { duration: animation_duration }
    );

    setTimeout(() => {
      bubble.remove();
    }, animation_duration);
  }

  setInterval(create_bubble, 500);
};
