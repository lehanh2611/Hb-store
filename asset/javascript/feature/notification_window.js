/***** Import *****/
import { $, $$ } from "../end_point.js";

//Notification window
export let notificationWindowBody = $(".notification");
export function notificationWindow(
  status = "close",
  title,
  content,
  callback,
  contentBtn = null,
  fixed = false
) {
  let titleElement = $(".notification__title"),
    contentElement = $(".notification__content"),
    agreeBox = $(".notification__btn"),
    close = $(".notification__close");

  if (fixed) {
    notificationWindowBody.classList.add("fixed");
  } else {
    const btns = [agreeBox, close];
    function removeFixed() {
      notificationWindowBody.classList.remove("fixed");
      for (const btn of btns) {
        btn.removeEventListener("click", removeFixed);
      }
    }
    for (const btn of btns) {
      btn.addEventListener("click", removeFixed);
    }
  }

  notificationWindowBody.click();

  //Notification close
  if (status === "close") {
    notificationWindowBody.classList.remove("on", "success", "fail");
  } else {
    //Notification Form
    if (status) {
      notificationWindowBody.classList.add("success");
      agreeBox.innerHTML = contentBtn === null ? "Đồng ý" : contentBtn;
    } else {
      notificationWindowBody.classList.add("fail");
      agreeBox.innerHTML = contentBtn === null ? "Thử lại" : contentBtn;
    }

    //Close with key enter
    document.onkeydown = (e) => {
      switch (e.which) {
        case 13:
          if (notificationWindowBody.getBoundingClientRect().width !== 0) {
            agreeBox.onclick();
            notificationWindow();
          }
      }
    };

    //Render content
    titleElement.innerHTML = title;
    contentElement.innerHTML = content;

    notificationWindowBody.classList.add("on");
    //Listen event
    agreeBox.onclick = () => {
      callback(true);
    };
    close.onclick = () => {
      callback(false);
    };
  }
}
