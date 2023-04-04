import {
  /***** Function *****/
  recursive,
  GETelement,
  PATCHelement,
  DELETEelement,
  formatMoney,
  select,

  /***** Constant *****/
  $,
  $$,

  /***** Variable *****/
  accountApi,
  productAPi,
  admin_accountApi,

  /***** Feature *****/
  notificationWindow,
  validate,
  filter,
  processLoad,
  logHistory,
  Get,
  orderAPi,
  depositAPi,
  orderForm,
  Patch,
  Delete,
  simpleNoti,
  orderDoneAPi,
  introduce_codeAPi,
  Put,
} from "../../asset/javascript/end_point.js";

let admin;
let apiBody;

/***** Body *****/
const body = {
  bodyMain: $("#body"),

  //Handle from branching structure
  handle: {
    account: {
      manage: function (categoryKey) {
        const keyBody = "Account.Manage";
        const apiBody = accountApi;
        localStorage.setItem("categoryHistory", JSON.stringify(categoryKey));

        //get the account
        new Promise((resolve) => {
          GETelement(apiBody, (accounts) => resolve(accounts));
        })

          //Get product list
          .then((accounts) => {
            localStorage.setItem(keyBody, JSON.stringify(accounts));

            const manage = {
              appBoradContain: $(".app-borad__contain"),

              //Render the account
              render: function (data = accounts) {
                const output = data.reduce((accmulate, account) => {
                  if (!account) {
                    return accmulate;
                  }
                  return (accmulate += `<ul item_id="${account.UserID}" ${account.Block === "true"
                    ? 'block = "true" '
                    : 'block = "false"'
                    } class="app-board__data">
                                    <li class="app-board__data-item userId l-2 m-2 c-3">
                                    ${account.Block === "true"
                      ? '<i class="app-board__data-lock fa-solid fa-lock"></i>'
                      : ""
                    }
                                    ${account.UserID}
                                    </li>
                                    <li class="app-board__data-item userName l-3 m-4 c-9">${account.Username
                    }</li>
                                    <li class="app-board__data-item email l-4 hide-mt">${account.Email === undefined
                      ? "Emtpy"
                      : account.Email
                    }</li>
                                    <li class="app-board__data-item money hide-m">
                                    ${formatMoney(account.Money)}</li>
                                </ul>`);
                }, "");

                this.appBoradContain.innerHTML = output;

                const appboradElement = $$(".app-board__data");

                //Callback return element in process active
                select(appboradElement, (element) => {
                  this.fullInfoRender(element);
                });

                // render done
                setTimeout(() => {
                  this.renderDone();
                }, 0);
              },

              fullInfoRender: function (element, reload = false) {
                //render full information
                new Promise((resolve) => {
                  //get new data account
                  if (reload) {
                    GETelement(apiBody, (newAccounts) => {
                      resolve(newAccounts);
                    });
                  } else {
                    resolve(accounts);
                  }
                }).then((accounts) => {
                  accounts.forEach((account) => {
                    if (account?.UserID == element.getAttribute("item_id")) {
                      const date = account.DateCreated;
                      $(".app-bot__info-data.value.userid").innerText =
                        account.UserID;
                      $(".app-bot__info-data.value.username").innerText =
                        account.Username;
                      $(".app-bot__info-data.value.nickname").innerText =
                        account.Nickname === undefined
                          ? "N/A"
                          : account.Nickname;
                      $(".app-bot__info-data.value.email").innerText =
                        account.Email;
                      $(".app-bot__info-data.value.money").innerText =
                        formatMoney(account.Money);
                      $(".app-bot__info-data.value.moneySpent").innerText =
                        account.MoneySpent === undefined
                          ? "N/A"
                          : formatMoney(account.MoneySpent);
                      $(".app-bot__info-data.value.totalDeposit").innerText =
                        formatMoney(account.TotalDeposit);
                      $(
                        ".app-bot__info-data.value.date"
                      ).innerText = `${date.date}/${date.month}/${date.year}`;
                    }
                  });

                  // Check lock status
                  const parentIcon = $(".app__top-feature.block");

                  if (element.getAttribute("block") === "true") {
                    parentIcon.classList.add("unlock");
                  } else {
                    parentIcon.classList.remove("unlock");
                  }
                });
              },

              lock: function () {
                const lockBtn = $(".app__top-feature.block");

                if (!lockBtn) {
                  return;
                }
                lockBtn.addEventListener("click", lockHandle);

                function lockHandle() {
                  const elementActive = $(".app-board__data.active");

                  // Check select, not select => skip logic
                  if (!elementActive) {
                    return;
                  }
                  lockBtn.removeEventListener("click", lockHandle);

                  const containId = elementActive
                    .closest(".app-board__data")
                    .getAttribute("item_id");
                  const lockBox = elementActive.querySelector(
                    ".app-board__data-item.userId"
                  );

                  if (elementActive) {
                    GETelement(`${accountApi}/${containId}`, (account) => {
                      new Promise((resolve) => {
                        if (account.Block == "false") {
                          PATCHelement(
                            `${accountApi}/${containId}`,
                            {
                              Block: "true",
                            },
                            () => {
                              resolve();
                            }
                          );

                          //add icon lock
                          lockBox.innerHTML = `<i class="app-board__data-lock fa-solid fa-lock"></i>${lockBox.innerHTML}`;

                          //change icon button lock
                          lockBtn.classList.add("unlock");
                        } else {
                          PATCHelement(
                            `${accountApi}/${containId}`,
                            {
                              Block: "false",
                            },
                            () => {
                              resolve();
                            }
                          );

                          //remove icon lock
                          const lockIcon = elementActive.querySelector(
                            ".app-board__data-lock"
                          );

                          if (lockIcon) {
                            lockIcon.remove();
                          }

                          //change icon button lock
                          lockBtn.classList.remove("unlock");
                        }
                        setTimeout(() => {
                          lockBtn.addEventListener("click", lockHandle);
                        }, 0);
                      });
                    });
                  }
                }
              },

              deposit: function () {
                const depositBtn = $(".app__top-feature.depositBtn");
                const depositBox = $(".deposit");
                const depositClose = $(".deposit__close");
                const nameContain = $(".deposit__title-sub");
                const depositSubmit = $(".deposit__button");

                depositBtn.onclick = () => {
                  const elementActive = $(".app-board__data.active");

                  // Check select, not select => skip logic
                  if (!elementActive) {
                    return;
                  }

                  //show deposit box
                  depositBox.style.display = "flex";

                  //close deposit box
                  depositClose.onclick = () => {
                    depositBox.style.display = "none";
                  };

                  $(".deposit__contain").onclick = (e) => e.stopPropagation();

                  depositBox.onclick = () => {
                    depositBox.style.display = "none";
                  };

                  //show username deposit
                  nameContain.innerText =
                    elementActive.querySelector(".userName").innerText;

                  // send request deposit
                  depositSubmit.onclick = () => {
                    //activated animate button
                    depositSubmit.classList.add("active");

                    //check password admin
                    GETelement(
                      `${admin_accountApi}/${admin.UserId}`,
                      (account) => {
                        //password ok => continue deposit
                        //password not ok => stop deposit
                        if (
                          $(".deposit__input.password").value ===
                          account.Password
                        ) {
                          //Get value deposit
                          const depositValue = Number(
                            $(".deposit__input.money").value
                          );

                          // not value => exit deposit request
                          if (depositValue === 0 || depositValue === NaN) {
                            //stop animate button
                            depositSubmit.classList.remove("active");
                            return;
                          }

                          const url = `${accountApi}/${elementActive.getAttribute(
                            "item_id"
                          )}`;

                          //deposit...
                          GETelement(url, (account) => {
                            const currentMoney = account.Money;
                            const newMoney = currentMoney + depositValue;

                            //deposit successful
                            PATCHelement(
                              url,
                              {
                                Money: newMoney,
                                TotalDeposit:
                                  account.TotalDeposit + depositValue,
                              },
                              () => {
                                //show new money
                                elementActive.querySelector(
                                  ".app-board__data-item.money"
                                ).innerText = formatMoney(newMoney);

                                notificationWindow(
                                  true,
                                  "Nạp tiền hoàn tất",
                                  "",
                                  () => {
                                    notificationWindow();
                                    depositBox.style.display = "none";
                                  }
                                );

                                depositBox.click();

                                //update full info
                                this.fullInfoRender(elementActive, true);

                                //stop animate button
                                depositSubmit.classList.remove("active");

                                // clear value
                                depositBox
                                  .querySelectorAll("input")
                                  .forEach((element) => {
                                    element.value = "";
                                  });
                              }
                            );
                          });
                        } else {
                          notificationWindow(
                            false,
                            "Mật khẩu Quản trị viên sai",
                            "Vui lòng thử lại",
                            () => {
                              //stop animate button
                              depositSubmit.classList.remove("active");
                              notificationWindow();
                            },
                            "Thử lại"
                          );
                        }
                      }
                    );
                  };
                };

                //remove default submit
                depositBox
                  .querySelector("form")
                  .addEventListener("submit", (e) => e.preventDefault());
              },
              search: function () {
                const input = $(".app__mid-nav-search");
                function search() {
                  input.removeEventListener("input", search);

                  filter(accounts, { all: input.value }, (v) => {
                    manage.render(v);
                    input.addEventListener("input", search);
                  });
                }
                input.addEventListener("input", search);
              },

              shared: {
                featureNotAvailable: function () {
                  $$(".app__top-feature.disable").forEach((element) => {
                    element.addEventListener("click", () => {
                      notificationWindow(
                        false,
                        "Chức năng chưa sẵn sàng",
                        "vẫn đang trong quá trình phát triển, vui lòng thử lại sau",
                        () => {
                          notificationWindow();
                        },
                        "Quay lại"
                      );
                    });
                  });
                },
              },

              renderDone: function () {
                body.handle.shared.notSelect();
                body.handle.shared.delete(keyBody);
                this.shared.featureNotAvailable();
              },

              start: function () {
                this.render();
                this.lock();
                this.deposit();
                this.search();
              },
            };

            manage.start();
          });
      },
    },
    product: {
      manage: function (categoryKey) {
        const keyBody = "Product.Manage";
        const productContain = $(".app-borad__contain");
        const form = $(".product-form");
        const submit = $(".product-form__submit");
        const formTitle = $(".product-form__title");
        const formTitleSub = $(".product-form__title-sub");

        localStorage.setItem("categoryHistory", JSON.stringify(categoryKey));

        new Promise((resolve) => {
          GETelement(apiBody, (products) => resolve(products));
        })

          //Get product list
          .then((products) => {
            //update product
            localStorage.setItem(keyBody, JSON.stringify(products));

            const manage = {
              //Render products
              renderProduct: function (rule) {
                new Promise((resolve) => {
                  if (arguments.length >= 1) {
                    filter(products, rule, (productsFil) => {
                      resolve(productsFil);
                    });
                  } else {
                    resolve(products);
                  }
                }).then((data) => {
                  if (!Array.isArray(data)) { data = Object.values(data) }
                  const output = data.reduce((accmulate, product) => {
                    if (!product) {
                      return accmulate;
                    }
                    return (accmulate += `<ul item_id="${product.ProductID
                      }" sold="${product.Sold}"class="app-board__data">
                                    <li class="app-board__data-item productId l-2 m-2 c-4">
                                    ${product.ProductID}
                                    </li>
                                    <li class="app-board__data-item uid l-3 m-4 c-8">
                                    ${product.UID}</li>
                                    <li class="app-board__data-item type l-4 hide-mt">${product.Type
                      }</li>
                                    <li class="app-board__data-item price hide-m">
                                    ${formatMoney(product.Price)}
                                    </li>
                                </ul>`);
                  }, "");

                  productContain.innerHTML = output;
                  this.renderDone();
                });
              },

              renderInfoProduct: function (element) {
                if (!Array.isArray(products)) { products = Object.values(products) }
                products.forEach((product) => {
                  if (product?.ProductID == element.getAttribute("item_id")) {
                    $(".app-bot__info-data.value.productId").innerText =
                      product?.ProductID;
                    $(".app-bot__info-data.value.uid").innerText = product?.UID;
                    $(".app-bot__info-data.value.type").innerText =
                      product?.Type;
                    $(".app-bot__info-data.value.price").innerText =
                      formatMoney(product?.Price);
                    $(".app-bot__info-data.value.server").innerText =
                      product?.Server;
                    $(".app-bot__info-data.value.discount").innerText =
                      product?.Discount;
                    $(".app-bot__info-data.value.flashSale").innerText =
                      product?.Flashsale;
                    $(".app-bot__info-data.value.sold").innerText =
                      product?.Sold;
                  }
                });
              },

              addProduct: function () {
                //Show form add product
                $(".app__top-feature.create").addEventListener("click", () => {
                  //reset form
                  if (!form.classList.value.includes("createForm")) {
                    for (let input of form.querySelectorAll("input")) {
                      input.value = "";
                    }

                    formTitle.innerText = "Thêm sản phẩm";
                    formTitleSub.innerText = "";
                  }

                  form.classList.add("show");

                  //Hide form add product
                  $(".product-form__close").onclick = () => {
                    form.classList.remove("show");
                  };

                  //stop submit default
                  $(".product-form__contain").addEventListener("submit", (e) =>
                    e.preventDefault()
                  );

                  //Validate
                  const inputs = [
                    {
                      selector: $(".product-form__input-box.uid"),
                      options: ["required", "number", "leng_9"],
                    },
                    {
                      selector: $(".product-form__input-box.price"),
                      options: ["required", "number"],
                    },
                  ];

                  function validateRequest(selector, validateType) {
                    const parent = selector.closest(".product-form__input-box");
                    const selectorElm = {
                      parent: parent,
                      input: parent.querySelector("input"),
                      message: parent.querySelector("message"),
                    };

                    selector.addEventListener("input", () => {
                      selectorElm.message.innerText = "";
                    });
                    validate.start(selectorElm, validateType);
                  }

                  //act focusout
                  inputs[0].selector.addEventListener("focusout", (e) => {
                    validateRequest(e.target, ["required", "leng_9"]);
                  });
                  inputs[1].selector.addEventListener("focusout", (e) => {
                    validateRequest(e.target, ["required"]);
                  });

                  //act submit
                  submit.onclick = (e) => {
                    inputs.forEach((input) => {
                      validateRequest(input.selector, input.options);
                    });

                    //All no more error messages
                    const result = Array.from(
                      form.querySelectorAll("message")
                    ).every((element) => {
                      return element.innerText === "";
                    });
                    //Exist error messages => skip
                    if (!result) {
                      return;
                    }

                    // show button loading
                    form.classList.add("active");
                    //Get value submit
                    const value = {
                      UID: $("#product-form__input-uid").value,
                      ImageUrl: $("#product-form__input-image-url").value,
                      Price: $("#product-form__input-price").value,
                      Type: $("#product-form__select-type").value,
                      Server: $("#product-form__select-server").value,
                    };

                    //Product constructor
                    function NewProduct(uid, imageUrl, price, type, server) {
                      this.ProductID = products.length;
                      this.UID = uid;
                      this.ImageUrl = imageUrl;
                      this.Server = server;
                      this.Price = price;
                      this.Type = type;
                      this.Discount = "0%";
                      this.Flashsale = "No";
                      this.Sold = "No";
                    }
                    const newProduct = new NewProduct(
                      value.UID,
                      value.ImageUrl,
                      value.Price,
                      value.Type,
                      value.Server
                    );

                    //Push product to api
                    PATCHelement(
                      `${apiBody}/${newProduct.ProductID}`,
                      newProduct,
                      (product) => {
                        // hide button loading
                        form.classList.remove("active");

                        //show notification
                        notificationWindow(
                          true,
                          "Thêm sản phẩm thành công",
                          "Bạn muốn tiếp tục thêm sản phẩm mới?",
                          (isSuccess) => {
                            //reset form
                            for (let input of form.querySelectorAll("input")) {
                              input.value = "";
                            }

                            if (isSuccess) {
                              notificationWindow();
                            } else {
                              //close form add product
                              notificationWindow();
                              $(".product-form__close").click();
                            }
                          },
                          "Tiếp tục"
                        );

                        //Add product to DOM
                        let newPdtDom = document.createElement("ul");

                        //Add product to list
                        $(".app-borad__contain").appendChild(newPdtDom);

                        newPdtDom.outerHTML = `<ul item_id="${product.ProductID
                          }"class="app-board__data">
                                    <li class="app-board__data-item productId l-2 m-2 c-4">
                                    ${product.ProductID}
                                    </li>
                                    <li class="app-board__data-item uid l-3 m-4 c-8">
                                    ${product.UID}</li>
                                    <li class="app-board__data-item type l-4 hide-mt">${product.Type
                          }</li>
                                    <li class="app-board__data-item price hide-m">
                                    ${formatMoney(product.Price)}
                                    </li>
                                </ul>`;
                        //update products
                        GETelement(apiBody, (value) => {
                          products = value;
                          this.renderDone();
                        });

                        //pull scroll
                        const contain = $(".app-borad__contain");
                        contain.scrollTop += contain.scrollTop + 38;
                      }
                    );
                  };
                });
              },

              replaceProduct: function () {
                $(".app__top-feature.replace").addEventListener("click", async () => {
                  const elmActive = $(".app-board__data.active");

                  //not select skip => logic
                  if (!elmActive) {
                    return;
                  }

                  const productData = (await Get(`${apiBody}/${elmActive.getAttribute("item_id")}`)) ?? {}

                  const close = $(".product-form__close");
                  const { UID, ImageUrl, Server, Type, Price } = productData

                  let uid = elmActive.querySelector(
                    ".app-board__data-item.uid"
                  )
                  let type = elmActive.querySelector(
                    ".app-board__data-item.type"
                  );
                  let price = elmActive.querySelector(
                    ".app-board__data-item.price"
                  );

                  //show form
                  form.classList.add("show");

                  //hide form
                  close.onclick = () => {
                    form.classList.remove("show");
                  };

                  //change content form
                  form.classList.remove("createForm");
                  formTitle.innerHTML = "Chỉnh sửa UID:";

                  formTitleSub.innerHTML = UID;
                  $("#product-form__input-uid").value = UID;
                  $("#product-form__input-image-url").value = ImageUrl;
                  $("#product-form__input-price").value = Price
                  $("#product-form__select-server").value = Server
                  $("#product-form__select-type").value = Type

                  //act submit
                  $(".product-form__contain").addEventListener("submit", (e) =>
                    e.preventDefault()
                  );

                  submit.onclick = () => {
                    // show buttom loading
                    submit.classList.add("active");
                    processLoad.run(1);

                    //get value submit
                    let newValue = {
                      UID: $("#product-form__input-uid").value,
                      ImageUrl: $("#product-form__input-image-url").value,
                      Price: $("#product-form__input-price").value,
                      Type: $("#product-form__select-type").value,
                      Server: $("#product-form__select-server").value,
                    };

                    //update to api
                    PATCHelement(
                      `${apiBody}/${elmActive.getAttribute("item_id")}`,
                      newValue,
                      (product) => {
                        notificationWindow(
                          true,
                          "Chỉnh sửa thông tin thành công",
                          "Thông tin mới đã được áp dụng",
                          () => {
                            notificationWindow();
                            close.click();
                          }
                        );

                        //update to dom
                        // productid.innerText = product.ProductID
                        uid.innerText = product.UID;
                        type.innerText = product.Type;
                        price.innerText = formatMoney(product.Price);

                        //update products
                        GETelement(apiBody, (value) => {
                          products = value;
                          this.renderDone();
                        });

                        // hide buttom loading
                        submit.classList.remove("active");
                        processLoad.run(1);
                      }
                    );
                  };
                });
              },

              toggleStatusProduct: async () => {
                const button = $(".app__top-feature.status")

                button.addEventListener("click", async () => {
                  const elmActive = $(".app-board__data.active");

                  //not select skip => logic
                  if (!elmActive) {
                    return;
                  }

                  const product = (await Get(apiBody)).find(
                    (product) => {
                      if (!product) { return }
                      return $(".app-board__data.active").getAttribute("item_id") == product.ProductID
                    }
                  )

                  if (!product) { return }

                  PATCHelement(`${apiBody}/${product.ProductID}`, { Sold: product.Sold === "Yes" ? "No" : "Yes" }, (response) => {
                    const status = response.Sold
                    if (status === "Yes") {
                      simpleNoti(`${product.UID} thành đã bán`, false, 5000)
                    }
                    if (status === "No") {
                      simpleNoti(`${product.UID} thành chưa bán`, true, 5000)
                    }
                  })
                });
              },

              renderDone: function () {
                const appboradElement = $$(".app-board__data");
                const elmActive = $(".app-board__data.active");

                body.handle.shared.notSelect();
                body.handle.shared.delete();

                //update info product
                if (elmActive) {
                  this.renderInfoProduct(elmActive);
                }

                //Callback return element in process active
                select(appboradElement, (element) => {
                  this.renderInfoProduct(element);
                });
              },

              start: function () {
                this.renderProduct();
                this.addProduct();
                this.replaceProduct();
                this.toggleStatusProduct();
                body.handle.shared.productSearch(this);
              },
            };
            manage.start();
          });
      },
      flashSale: function (categoryKey) {
        const keyBody = "Product.FlashSale";
        const createBtn = $(".app__top-feature.create");
        const deleteBtn = $(".app__top-feature.delete");

        localStorage.setItem("categoryHistory", JSON.stringify(categoryKey));

        new Promise((resolve) => {
          GETelement(apiBody, (products) => resolve(products));
        })

          //Get product list
          .then((products) => {
            // update product
            localStorage.setItem(keyBody, JSON.stringify(products));

            const productNFScontain = $(
              ".app__flashsale-product-contain.notFlashSale"
            );
            const productFScontain = $(
              ".app__flashsale-product-contain.flashSale"
            );

            const flashSale = {
              //Render the products
              renderProduct: function (rule = { flashSale: "No" }) {
                let contain = productNFScontain;

                if (rule.flashSale !== "No") {
                  contain = productFScontain;
                }

                filter(products, rule, (productsFil) => {
                  const output = productsFil.reduce((accmulate, product) => {
                    return (accmulate += `<ul item_id="${product.ProductID}"
                                               class="app__flashsale-product-item-box ${product.Sold
                      }">
                                               <li class="app__flashsale-product-item">
                                                   <span class="app__flashsale-product-item-check-wrap">
                                                       <i class="app__flashsale-product-item-check fa-solid fa-check"></i>
                                                   </span>
                                               </li>
                                               <li class="app__flashsale-product-item uid">${product.UID
                      }</li>
                                               <li class="app__flashsale-product-item hide-m price">${formatMoney(
                        product.Price
                      )}</li>
                                               <li class="app__flashsale-product-item hide-m discount">${product.Discount
                      }</li>
                                               <li class="app__flashsale-product-item sold">${product.Sold
                      }</li>
                                           </ul>`);
                  }, "");
                  if (!contain) {
                    return;
                  }
                  contain.innerHTML = output;

                  // render done
                  setTimeout(() => {
                    this.renderDone();
                  }, 0);
                });
              },
              renderProductFS: function () {
                this.renderProduct({ flashSale: "Yes" });
              },

              selectsProducts: function (
                parents = $$(".app__flashsale-contain")
              ) {
                const btn = $(".app__top-feature.selects");

                btn.onclick = () => {
                  for (let parent of parents) {
                    btn.classList.toggle("active");
                    parent.classList.toggle("show");
                    this.selectProduct.selectAll();

                    if (!parent.classList.value.includes("show")) {
                      this.selectProduct.selectAll("clear");
                      this.selectProduct.selectOne();
                    }
                  }
                };
              },
              disableFeature: function (isCheck = false) {
                for (let elm of $$(".app__flashsale-product-item-box")) {
                  // elm.removeEventListener('click', checkType)

                  elm.addEventListener("click", checkType);
                }

                if (isCheck) {
                  checkType();
                }

                function checkType() {
                  const elmActive = $(
                    ".app__flashsale-product-item-box.active"
                  );

                  if (!elmActive) {
                    deleteBtn.classList.remove("disable");
                    createBtn.classList.remove("disable");
                    return;
                  }

                  const parent = elmActive.closest(
                    ".app__flashsale-product-contain"
                  );

                  //Select Flash sale => disable list all
                  if (parent.classList.value.includes("flashSale")) {
                    createBtn.classList.add("disable");
                    deleteBtn.classList.remove("disable");
                  }
                  //Select list all => disable Flash sale
                  else {
                    createBtn.classList.remove("disable");
                    deleteBtn.classList.add("disable");
                  }

                  //Select list all and Flash sale => disable flash sale and list all
                  const containAll = $(
                    ".app__flashsale-product-contain.notFlashSale"
                  ).querySelector(".app__flashsale-product-item-box.active");

                  const containFS = $(
                    ".app__flashsale-product-contain.flashSale"
                  ).querySelector(".app__flashsale-product-item-box.active");

                  if (containAll && containFS) {
                    createBtn.classList.add("disable");
                    deleteBtn.classList.add("disable");
                  }
                }
              },
              moveProductFS: function () {
                const btns = [
                  $(".app__top-feature.delete"),
                  $(".app__top-feature.create"),
                ];
                const containFS = $(
                  ".app__flashsale-product-contain.flashSale"
                );
                const containNFS = $(
                  ".app__flashsale-product-contain.notFlashSale"
                );
                const btnLoadings = $$(".app__flashsale-page .btn-loading");

                for (const btn of btns) {
                  btn.onclick = function () {
                    let containReceive = containNFS;
                    let contain = containFS;
                    let rule = "No";
                    let i = 0;

                    if (btn.classList.value.includes("create")) {
                      containReceive = containFS;
                      contain = containNFS;
                      rule = "Yes";
                    }

                    let elements = Array.from(
                      contain.querySelectorAll(
                        ".app__flashsale-product-item-box.active"
                      )
                    );

                    //Feature disable => skip logic
                    if (
                      btn.classList.value.includes("disable") ||
                      elements.length === 0
                    ) {
                      return;
                    }

                    const datas = elements.map((element) =>
                      element.getAttribute("item_id")
                    );

                    //show loading
                    for (const btnLoading of btnLoadings) {
                      btnLoading.classList.add("active");
                    }
                    function update() {
                      processLoad.run(datas.length);
                      if (i === datas.length) {
                        simpleNoti("Thao tác hoàn thành");
                        flashSale.containLeng();
                        for (const btnLoading of btnLoadings) {
                          btnLoading.classList.remove("active");
                        }
                        return GETelement(apiBody, (v) => {
                          products = v;
                        });
                      }

                      PATCHelement(
                        `${apiBody}/${datas[i]}`,
                        { Flashsale: rule },
                        () => {
                          update();
                        }
                      );

                      containReceive.appendChild(elements[i]);
                      containReceive.scrollTop =
                        containReceive.scrollTop + 99e9;

                      flashSale.selectProduct.selectAll("clear");
                      for (const elm of $$(".app__flashsale-bars-checkAll")) {
                        elm.classList.remove("all");
                      }

                      if (
                        $(".app__flashsale-contain").classList.value.includes(
                          "show"
                        )
                      ) {
                        flashSale.selectProduct.selectAll();
                      } else {
                        flashSale.selectProduct.selectOne();
                      }
                      flashSale.disableFeature();

                      i++;
                    }
                    update();
                  };
                }
              },
              replaceDiscount: function () {
                const contain = $(".discount-form");
                const btn = $(".app__top-feature.replace");
                const submit = $(".discount-form__submit");
                const close = $(".discount-form__close");
                const input = $(".discount-form__input");
                const selectorElm = {
                  input: input,
                  message: contain.querySelector("message"),
                };
                const rule = ["required", "maxLeng_2", "number"];

                btn.onclick = () => {
                  const elmActive = Array.from(
                    $$(".app__flashsale-product-item-box.active")
                  );

                  if (elmActive.length === 0) {
                    return;
                  }

                  //show form
                  contain.classList.add("active");
                  contain
                    .querySelector("form")
                    .addEventListener("submit", (e) => e.preventDefault());
                  selectorElm.message.innerText = "";

                  //hide form
                  close.onclick = () => {
                    contain.classList.remove("active");
                  };

                  //show UID
                  $(".discount-form__title-sub").innerText = elmActive.reduce(
                    (acc, elm) => {
                      return (acc += `${elm.querySelector(".app__flashsale-product-item.uid")
                        .innerText
                        }
                                    `);
                    },
                    ""
                  );

                  //atc focusout
                  input.addEventListener("focusout", () => {
                    validate.start(selectorElm, rule);
                  });

                  //atc submit
                  submit.onclick = () => {
                    const data = input.value;
                    let i = 0;

                    //exist error message stop => submit
                    if (!validate.start(selectorElm, rule)) {
                      return;
                    }
                    //sumbmit => done
                    close.click();
                    input.value = "";

                    notificationWindow(
                      true,
                      "Thay đổi đã được áp dụng",
                      "Đang xử lý yêu cầu",
                      () => {
                        this.selectProduct.selectAll("clear");
                        for (const item of $$(
                          ".app__flashsale-bars-checkAll"
                        )) {
                          item.classList.remove("all");
                        }
                        notificationWindow();
                      }
                    );

                    updateDiscount();
                    function updateDiscount() {
                      const item = elmActive[i];

                      processLoad.run(elmActive.length);

                      if (i === elmActive.length) {
                        simpleNoti("Thao tác hoàn thành");
                        return GETelement(apiBody, (v) => {
                          products = v;
                        });
                      }

                      //update data => server
                      PATCHelement(
                        `${apiBody}/${item.getAttribute("item_id")}`,
                        { Discount: data + "%" },
                        () => {
                          updateDiscount();
                        }
                      );
                      //update data => dom
                      item.querySelector(
                        ".app__flashsale-product-item.discount"
                      ).innerText = data + "%";
                      i++;
                    }
                  };
                };
              },
              containLeng: function () {
                const contains = $$(".app__flashsale-page");

                for (const contain of contains) {
                  const getLeng = contain.querySelectorAll(
                    ".app__flashsale-product-item-box"
                  ).length;
                  contain.querySelector(
                    ".btn-loading__text-value"
                  ).innerText = `(${getLeng})`;
                }
              },
              selectProduct: {
                selectAll: function (isClear) {
                  const selectors = $$(".app__flashsale-product-item-box");

                  if (isClear) {
                    for (let selector of selectors) {
                      deleteBtn.classList.remove("disable");
                      createBtn.classList.remove("disable");
                      selector.classList.remove("active");
                    }
                  } else {
                    for (let selector of selectors) {
                      selector.onclick = () => {
                        selector.classList.toggle("active");
                      };
                    }
                  }
                },
                selectOne: function () {
                  const selectors = $$(".app__flashsale-product-item-box");
                  for (let selector of selectors) {
                    selector.onclick = () => {
                      for (let selector2 of selectors) {
                        if (selector2 != selector) {
                          selector2.classList.remove("active");
                        }
                      }

                      selector.classList.toggle("active");
                    };
                  }
                },
              },
              selectAllProduct: function () {
                const btns = $$(".app__flashsale-bars-checkAll");

                for (let btn of btns) {
                  btn.onclick = () => {
                    const parent = btn.closest(".app__flashsale-page");
                    const elmNFS = $$(
                      ".app__flashsale-page.notFlashSale .app__flashsale-product-item-box "
                    );
                    const elmFS = $$(
                      ".app__flashsale-page.flashSale .app__flashsale-product-item-box "
                    );
                    let elmHandle;

                    btn.classList.toggle("all");

                    if (parent.classList.value.includes("flashSale")) {
                      elmHandle = elmFS;
                    } else {
                      elmHandle = elmNFS;
                    }

                    if (btn.classList.value.includes("all")) {
                      for (const elm of elmHandle) {
                        elm.classList.add("active");
                      }
                    } else {
                      for (const elm of elmHandle) {
                        elm.classList.remove("active");
                      }
                    }

                    this.disableFeature(true);
                  };
                }
              },
              renderDone: function () {
                this.selectProduct.selectOne();
                this.selectsProducts();
                this.disableFeature();
                this.moveProductFS();
                this.containLeng();
                this.replaceDiscount();
              },
              ui: function () {
                //set height contain
                const contains = $$(".app__flashsale-product-contain");
                const widthParent = $(".app__flashsale-page");

                if (!widthParent || !contains) {
                  return;
                }
                for (const contain of contains) {
                  contain.style.height =
                    widthParent.getBoundingClientRect().height - 84 + "px";
                }
              },

              start: function () {
                this.ui();
                this.renderProduct();
                this.renderProductFS();
                this.selectAllProduct();
                body.handle.shared.notSelect();
                body.handle.shared.productSearch(this);
              },
            };
            flashSale.start();
          });
      },
      ProcessOrders: async function (categoryKey) {
        localStorage.setItem("categoryHistory", JSON.stringify(categoryKey));
        const [orders, products, accounts] = await Promise.all([
          Get(orderAPi),
          Get(productAPi),
          Get(accountApi),
        ]);

        const ProductsOrder = {
          renderOrder: function () {
            if (!orders) {
              return;
            }
            const contain = $(".app__mid-item-wrap");
            const output = Object.values(orders).reduce((acc, order) => {
              const productUid = products[order?.ProductID]?.UID;

              if (!order || !productUid) {
                return acc;
              }
              const date = order.Date;
              return (acc += `<ul orderCode="${order.Ordercode
                }" class="app__mid-item-list content">
                            <li class="app__mid-item code">${order.Ordercode
                }</li>
                            <li class="app__mid-item product">${productUid}</li>
                            <li class="app__mid-item price">${formatMoney(
                  order.Price
                )}</li>
                            <li class="app__mid-item date">${date.date}/${date.month
                }/${date.year}</li>
                        </ul>`);
            }, "");
            contain.innerHTML = output;

            //total order
            body.handle.shared.totalOrder();
            this.renderDone();
          },
          renderDone: function () {
            this.handleOrder();
          },
          handleOrder: function () {
            const elms = $$(".app__mid-item-list.content");

            for (const elm of elms) {
              elm.onclick = () => {
                let data = orders[elm.getAttribute("orderCode")];
                const urlUser = `${accountApi}/${data.UserID}`;
                const orderCode = data.Ordercode;
                const orderPrice = data.Price;
                const servicePrice = data.ServicePrice;
                const nitroduceCode = data.NitroduceCode ?? "";
                const productId = data.ProductID;
                const userId = data.UserID;
                const date = data.Date;

                data = {
                  Title: {
                    title: "Đơn hàng",
                    value: orderCode,
                  },
                  User: {
                    title: "Tên người dùng",
                    value: accounts[userId].Username,
                  },
                  Product: {
                    title: "UID",
                    value: products[productId].UID,
                  },
                  Price: {
                    title: "Giá trị đơn hàng",
                    value: formatMoney(orderPrice),
                  },
                  ServicePrice: {
                    title: "Giá trị combo",
                    value: formatMoney(servicePrice),
                  },
                  NitroduceCode: {
                    title: "Mã giới thiệu",
                    value: nitroduceCode,
                  },
                  // Status: {
                  //   title: "Thanh toán",
                  //   value:
                  //     data.Status == "Paid"
                  //       ? "Đã thanh toán"
                  //       : "Chưa thanh toán",
                  // },
                  Method: {
                    title: "Phương thức",
                    value: data.Menthod,
                  },
                  Email: {
                    title: "Email nhận tài khoản",
                    value: data.Email,
                  },
                  Date: {
                    title: "Thời gian tạo đơn",
                    value: `${date.date}/${date.month}/${date.year}`,
                  },
                };

                orderForm("order", data, (result) => orderHandle(result));

                async function orderHandle(result) {
                  const order = await Get(`${orderAPi}/${orderCode}`)

                  if (order === null) {
                    return;
                  }
                  const userData = await Get(urlUser);

                  let message = {
                    Seen: "No",
                    Type: "Product",
                  };

                  // remove from DOM
                  elm.remove();

                  // update status order
                  Patch(`${urlUser}/Order/${orderCode}`, {
                    Status: result === "Resolve" ? "Resolve" : "Reject",
                  });

                  //remove order
                  Delete(`${orderAPi}/${orderCode}`);

                  if (result === 'Not-payment') {
                    message = {
                      ...message,
                      content:
                        "Liên hệ với chúng tôi để được hỗ trợ nếu bạn đã thanh toán",
                      title: `Đơn hàng ${orderCode} bị hủy do chưa thanh toán`,
                    };
                  } else {
                    if (result === "Reject") {
                      //update status product
                      // Patch(`${productAPi}/${productId}`, { Sold: "No" });

                      if (data.Method.value === "shopMoney") {
                        //return money
                        Patch(urlUser, { Money: userData.Money + orderPrice });
                      }

                      // create message error
                      message = {
                        ...message,
                        content:
                          "Đặt mua lại một tài khoản khác ngay thôi nào",
                        title: `Rất tiếc đơn hàng ${orderCode} đã có người mua`,
                      };
                    } else {
                      try {
                        const nitroduceValue = await Get(`${introduce_codeAPi}/${nitroduceCode}`)
                        await Promise.all([
                          Patch(`${productAPi}/${productId}`, { Sold: "Yes" }),
                          Patch(`${orderDoneAPi}/${order.Ordercode}`, order),
                          Put(`${introduce_codeAPi}/${nitroduceCode}`, nitroduceValue + 1),
                          Patch(`${urlUser}`, {
                            MoneySpent: Number(userData.MoneySpent) + orderPrice,
                          })])
                        message = {
                          ...message,
                          content: "Tài khoản đã được gửi đến email bạn đã điền",
                          title: `Đơn hàng ${orderCode} đã được xử lý thành công`,
                        };
                        simpleNoti("Thao tác hoàn thành")
                      } catch (error) {
                        simpleNoti(error, false)
                      }
                    }
                  }

                  //send message
                  const urlNoti = `${urlUser}/Notification`;
                  Patch(urlNoti, { [(await Get(urlNoti) ?? []).length]: message });

                  // updata total order
                  body.handle.shared.totalOrder();
                }
              };
            }
          },

          ui: function () {
            // set height contain
            const parent = $(".app__mid-contain");
            if (!parent) {
              return;
            }
            $(".app__mid-item-wrap").style.height =
              parent.getBoundingClientRect().height - 38 + "px";
          },

          start: function () {
            this.ui();
            this.renderOrder();
            select($$(".app__mid-item-list.content"));
          },
        };
        ProductsOrder.start();
      },
    },
    currency: {
      manage: async function (categoryKey) {
        localStorage.setItem("categoryHistory", JSON.stringify(categoryKey));
        let [deposits, accounts] = await Promise.all([
          Get(depositAPi),
          Get(accountApi),
        ]);

        const manage = {
          renderDeposit: function () {
            if (!deposits) {
              return;
            }
            // if(!Array.isArray(deposits)) {deposits = Object.values(deposits)}

            const contain = $(".app__mid-item-wrap");
            const output = deposits.reduce((acc, value, index) => {
              if (!value) {
                return acc;
              }
              const date = value.date;
              return (acc += ` <ul index="${index}" class="app__mid-item-list content">
                                <li class="app__mid-item code">${value.orderCode
                }</li>
                            <li class="app__mid-item userName">${accounts[value.userId].Username
                }</li>
                            <li class="app__mid-item money">${value.money}</li>
                            <li class="app__mid-item date">${date.date}/${date.month
                }/${date.year}</li></ul>`);
            }, "");

            if (!contain) {
              return;
            }
            contain.innerHTML = output;

            //total order
            body.handle.shared.totalOrder();

            this.renderDone();
          },
          handleDeposit: function () {
            const elms = $$(".app__mid-item-list.content");
            if (elms.length === 0) {
              return;
            }

            for (const elm of elms) {
              elm.onclick = () => {
                const index = elm.getAttribute("index");
                let data = deposits[index];
                const userId = data.userId;
                const urlUser = `${accountApi}/${userId}`;
                const moneyDep = Number(data.money);
                const date = data.date;

                data = {
                  Title: {
                    title: "Đơn nạp",
                    value: data.orderCode,
                  },
                  Username: {
                    title: "Tên người dùng",
                    value: accounts[userId].Username,
                  },
                  Money: {
                    title: "Số tiền nạp",
                    value: formatMoney(moneyDep),
                  },
                  Method: {
                    title: "Phương thức",
                    value: data.method,
                  },
                  Data: {
                    title: "Thời gian tạo đơn",
                    value: `${date.date}/${date.month}/${date.year}`,
                  },
                };
                orderForm("deposit", data, async (result) => {
                  const dataUser = await Get(urlUser);
                  let message = {
                    Seen: "No",
                    Type: "Money",
                  };

                  //remove order from DOM
                  elm.remove();

                  if (result) {
                    // Depost...
                    Patch(urlUser, {
                      Money: dataUser.Money + moneyDep,
                      TotalDeposit: dataUser.TotalDeposit + moneyDep,
                    });

                    message = {
                      ...message,
                      content: "Số tiền đã được chuyển vào số dư của bạn",
                      title: `Đơn nạp ${formatMoney(moneyDep)} thành công`,
                    };
                  } else {
                    message = {
                      ...message,
                      content: "Vui lòng thanh toán trước khi xác nhận đơn",
                      title: `Đơn nạp ${formatMoney(moneyDep)} thất bại`,
                    };
                  }

                  //send message
                  let notiLeng = dataUser?.Notification?.length;
                  if (!notiLeng) {
                    notiLeng = 0;
                  }
                  Patch(`${urlUser}/Notification`, { [notiLeng]: message });

                  //delete order
                  Delete(`${depositAPi}/${index}`);

                  // updata total order
                  body.handle.shared.totalOrder();
                });
              };
            }
          },

          renderDone: function () {
            this.handleDeposit();
          },
          ui: function () {
            // set height contain
            const parent = $(".app__mid-contain");
            if (!parent) {
              return;
            }
            $(".app__mid-item-wrap").style.height =
              parent.getBoundingClientRect().height - 38 + "px";
          },
          start: function () {
            this.ui();
            this.renderDeposit();
            select($$(".app__mid-item-list.content"));
          },
        };
        manage.start();
      },
    },

    shared: {
      //notification not select
      notSelect: function () {
        $$(".app__top-feature").forEach((element) => {
          element.addEventListener("click", () => {
            if (
              $(".app-board__data.active") === null &&
              $(".app__flashsale-product-item-box.active") === null &&
              !element.classList.value.includes("disable") &&
              !element.classList.value.includes("selects") &&
              !element.classList.value.includes("create product")
            ) {
              notificationWindow(
                false,
                "Bạn chưa chọn mục tiêu để thực hiện",
                "vui lòng chọn một mục và thử lại",
                () => {
                  notificationWindow();
                },
                "Thử lại"
              );
            }
          });
        });
      },

      //feature delete
      //Delete data from app-borad
      delete: function (keyBody) {
        $(".app__top-feature.delete").onclick = function () {
          const elementActive = $(".app-board__data.active");

          if (elementActive) {
            notificationWindow(
              false,
              "Bạn chắc chắn muốn xóa",
              "Sẽ không thể khôi phục lại",
              (isSuccess) => {
                if (isSuccess) {
                  const Id = elementActive.getAttribute("item_id");

                  //Delete data from api
                  DELETEelement(`${apiBody}/${Id}`, () => {
                    //remove null
                    // removeNull(apiBody)
                  });

                  //Delete from DOM
                  elementActive.outerHTML = "";
                  notificationWindow();
                } else {
                  notificationWindow();
                }
              },
              "Tiếp tục"
            );
          }
        };
      },

      productSearch: function (category) {
        const inputs = $$(".app__mid-nav-search");
        for (const input of inputs) {
          input.oninput = () => {
            let parent = input.closest(".app__flashsale-page");
            let flashSale = "No";
            if (inputs.length === 1) {
              parent = $(".app__mid");
              flashSale = "";
            }

            const clear = parent.querySelector(".app__mid-nav-clear");
            const value = input.value;

            // Clear value
            clear.classList.add("active");
            parent.querySelector(".app__mid-nav-search").style.paddingRight =
              "26px";

            clear.onclick = () => {
              input.value = "";
              category.renderProduct({
                flashSale,
                all: input.value,
              });

              clear.classList.remove("active");
              parent.querySelector(".app__mid-nav-search").style.paddingRight =
                "0";
            };

            if (parent.classList.value.includes("flashSale")) {
              flashSale = "Yes";
            }

            category.renderProduct({
              flashSale,
              all: value,
            });

            if (value.length == 0) {
              clear.classList.remove("active");
              parent.querySelector(".app__mid-nav-search").style.paddingRight =
                "0";
            }
          };
        }
      },

      //Total order
      totalOrder: function () {
        const totalOrders = $$(".app__mid-item-list.content").length;
        const totalBox = $(".app__mid-title-total");
        if (totalOrders === 0) {
          totalBox.classList.remove("active");
        } else {
          totalBox.classList.add("active");
          totalBox.innerText = totalOrders;
        }
      },

      //Get new order realtime
      getOrderRealtime: async function () {
        const title = $("head title");
        const options = [
          {
            api: orderAPi,
            elm: $(".nav__category-options.productOrder"),
          },
          {
            api: depositAPi,
            elm: $(".nav__category-options.depositOrder"),
          },
        ];
        const optionsLeng = options.length;
        let i = 0;

        async function updateData() {
          if (i < optionsLeng) {
            const option = options[i];
            const data = await Get(option.api);
            if (data !== null) {
              option.elm.classList.add("noti");

              title.innerText = `(${$$(".nav__category-options.noti").length})
                            Mục chờ xử lý`;
            } else {
              if (!$(".nav__category-options.noti")) {
                title.innerText = "Admin | Hbstore";
              }
              option.elm.classList.remove("noti");
            }
          } else {
            i = -1;
          }
          i++;
        }

        // first run
        for (let i = 0; i < 2; i++) {
          setTimeout(() => {
            updateData();
          }, i * 1000);
        }

        setInterval(() => {
          updateData();
        }, 5000);
      },
    },
  },

  //Branching structure
  account: {
    manage: function (key) {
      body.handle.account.manage(key);
    },
  },

  product: {
    manage: function (key) {
      body.handle.product.manage(key);
    },
    flashSale: function (key) {
      body.handle.product.flashSale(key);
    },
    ProcessOrders: function (key) {
      body.handle.product.ProcessOrders(key);
    },
  },

  currency: {
    manage: function (key) {
      body.handle.currency.manage(key);
    },
  },

  login: function () {
    admin = JSON.parse(sessionStorage.getItem("adminInfo"));
    if (admin !== null) {
      const avtContain = $(".user__avt");
      const nameContain = $(".user__name");

      if (admin.Avatar) {
        avtContain.src = admin.Avatar;
      } else {
        avtContain.src = "../asset/img/user-avt/user-default.png";
      }

      if (admin.Nickname) {
        nameContain.innerText = admin.Nickname;
      } else {
        nameContain.innerText = admin.Username;
      }
    } else {
      window.location.href = window.location.origin + "/admin-manager26/login";
    }
  },

  //Render body HTML
  renderHTML: function (key) {
    this.bodyHTML.forEach((element) => {
      if (element.key.parent == key.parent && element.key.child == key.child) {
        this.bodyMain.innerHTML = element.value;
        apiBody = element.url;
        element.start(key);
        //Set height contain
        const boardGrid = $(".app-board");
        const boardContain = $(".app-borad__contain");

        if (boardContain) {
          boardContain.style.height =
            boardGrid.getBoundingClientRect().height - 30 + "px";
        }
      }
    });
  },

  // Body Handle
  bodyHTML: [
    {
      url: accountApi,
      key: { parent: "TÀI KHOẢN", child: "Manage" },
      start: (key) => {
        body.account.manage(key);
      },
      value: `<div class="body__app">
            <div class="app__top">
                <h3 class="app__top-title">Manage</h3>
                <div class="app__top-feature-contain">
                    <div class="app__top-feature rippleBtn message disable">
                        <i class="app__top-feature-icon fa-solid fa-message"></i>
                        <p class="app__top-feature-text">Nhắn tin</p>
                    </div>
                    <div class="app__top-feature rippleBtn depositBtn">
                        <i class="app__top-feature-icon fa-solid fa-credit-card"></i>
                        <p class="app__top-feature-text">Nạp tiền</p>
                    </div>
                    <div class="app__top-feature rippleBtn replace disable">
                        <i class="app__top-feature-icon fa-sharp fa-solid fa-screwdriver-wrench"></i>
                        <p class="app__top-feature-text">Chỉnh sửa</p>
                    </div>
                    <div class="app__top-feature rippleBtn block">
                        <i class="app__top-feature-icon fa-solid fa-user-lock"></i>
                        <p class="app__top-feature-text">Tạm khóa</p>
                        <i class="app__top-feature-icon lock fa-solid fa-user-unlock"></i>
                        <p class="app__top-feature-text lock ">Mở khóa</p>
                    </div>
                    <div class="app__top-feature rippleBtn delete">
                        <i class="app__top-feature-icon fa-solid fa-user-minus"></i>
                        <p class="app__top-feature-text">Xóa bỏ</p>
                    </div>
                    <div class="app__top-feature rippleBtn create disable">
                        <i class="app__top-feature-icon fa-solid fa-user-plus"></i>
                        <p class="app__top-feature-text">Tạo mới</p>
                    </div>
                </div>
            </div>
            <div class="app__mid">
                <div class="app__mid-nav">
                    <div class="app__mid-nav-search-box">
                    <input class="app__mid-nav-search" type="text" placeholder="Tìm kiếm với ID, tên tài khoản, biệt danh...">
                    <i class="app__mid-nav-icon search fa-solid fa-magnifying-glass"></i>
                    <i class="app__mid-nav-clear fa-solid fa-xmark"></i>
                    </div>

                    <div class="app__mid-nav-ft-box">
                        <div class="app__mid-nav-ft">
                            <i class="app__mid-nav-icon fa-regular fa-bars-filter"></i>
                            Bộ lọc
                        </div>
                        <div class="app__mid-nav-ft">
                            <i class="app__mid-nav-icon fa-solid fa-file-arrow-down"></i>
                            Xuất ra
                        </div>
                    </div>
                </div>
                <div class="app-board grid">
                    <ul class="app-board__nav">
                        <li class="app-board__nav-item l-2 m-2 c-3">User ID</li>
                        <li class="app-board__nav-item l-3 m-4 c-9">User Name</li>
                        <li class="app-board__nav-item l-4 hide-mt hide-t">Email</li>
                        <li class="app-board__nav-item hide-m">Money</li>
                    </ul>
                    <div class="app-borad__contain""></div>
                </div>
                <!-- <div class="app__mid-nav-page">
                    <p class="app__mid-nav-page-info">1-9 of 99 pages</p>
                    <div class="app__mid-nav-page-btn-box">
                        <i class="app__mid-nav-page-btn fa-sharp fa-solid fa-arrow-left"></i>
                        <i class="app__mid-nav-page-btn fa-sharp fa-solid fa-arrow-right"></i>
                    </div>
                </div> -->
            </div>
            <div class="app-bot">
                <h3 class="app-bot__title">
                    <i class="fa-solid fa-address-card"></i>
                    <p>Information</p>
                    <!-- <i class="app-bot__title-resize fa-solid fa-arrow-down"></i> -->
                </h3>
                <div class="app-bot__info-contain">
                    <ul class="app-bot__info-list">
                        <li class="app-bot__info">
                            <p class="app-bot__info-data title userid">1.User ID:</p>
                            <p class="app-bot__info-data value userid"></p>
                        </li>
                        <li class="app-bot__info">
                            <p class="app-bot__info-data title username">2.User Name:</p>
                            <p class="app-bot__info-data value username"></p>
                        </li>
                        <li class="app-bot__info">
                            <p class="app-bot__info-data title nickname">3.Nick Name:</p>
                            <p class="app-bot__info-data value nickname"></p>
                        </li>
                        <li class="app-bot__info">
                            <p class="app-bot__info-data title email">4.Email:</p>
                            <p class="app-bot__info-data value email"></p>
                        </li>
                    </ul>
                    <ul class="app-bot__info-list">
                        <li class="app-bot__info">
                            <p class="app-bot__info-data title money">5.Money:</p>
                            <p class="app-bot__info-data value money"></p>
                        </li>
                        <li class="app-bot__info">
                            <p class="app-bot__info-data title moneySpent">6.Money Spent:</p>
                            <p class="app-bot__info-data value moneySpent"></p>
                        </li>
                        <li class="app-bot__info">
                            <p class="app-bot__info-data title totalDeposit">7.Total Deposit:</p>
                            <p class="app-bot__info-data value totalDeposit"></p>
                        </li>
                        <li class="app-bot__info">
                            <p class="app-bot__info-data title date">8.Date created:</p>
                            <p class="app-bot__info-data value date"></p>
                        </li>
                    </ul>
                    </ul>
                </div>
            </div>
        </div>`,
    },
    {
      url: productAPi,
      key: { parent: "SẢN PHẨM", child: "Manage" },
      start: (key) => {
        body.product.manage(key);
      },
      value: ` <div class="body__app">
            <div class="app__top">
                <h3 class="app__top-title">Manage</h3>
                <div class="app__top-feature-contain">
                <div class="app__top-feature rippleBtn replace">
                <i class="app__top-feature-icon fa-sharp fa-solid fa-screwdriver-wrench"></i>
                <p class="app__top-feature-text">Chỉnh sửa</p>
                    </div>
                    <div class="app__top-feature rippleBtn create product">
                        <i class="app__top-feature-icon fa-solid fa-layer-plus"></i>
                        <p class="app__top-feature-text">Tạo mới</p>
                    </div>
                    <div class="app__top-feature rippleBtn status">
                    <i class="app__top-feature-icon fa-solid fa-toggle-on"></i>
                    <p class="app__top-feature-text">Toggle status</p>
                </div>
                    <div class="app__top-feature rippleBtn delete">
                        <i class="app__top-feature-icon fa-solid fa-layer-minus"></i>
                        <p class="app__top-feature-text">Xóa bỏ</p>
                    </div>
                </div>
            </div>
            <div class="app__mid">
                <div class="app__mid-nav">
                    <div class="app__mid-nav-search-box">
                    <input class="app__mid-nav-search" type="text" placeholder="Tìm kiếm với UID, Server, Type...">
                    <i class="app__mid-nav-icon search fa-solid fa-magnifying-glass"></i>
                    <i class="app__mid-nav-clear fa-solid fa-xmark"></i>
                    </div>

                    <div class="app__mid-nav-ft-box">
                        <div class="app__mid-nav-ft">
                            <i class="app__mid-nav-icon fa-regular fa-bars-filter"></i>
                            Bộ lọc
                        </div>
                        <div class="app__mid-nav-ft">
                            <i class="app__mid-nav-icon fa-solid fa-file-arrow-down"></i>
                            Xuất ra
                        </div>
                    </div>
                </div>
                <div class="app-board grid">
                    <ul class="app-board__nav">
                        <li class="app-board__nav-item l-2 m-2 c-4">Product ID</li>
                        <li class="app-board__nav-item l-3 m-4 c-8">UID</li>
                        <li class="app-board__nav-item l-4 hide-mt hide-t">Type</li>
                        <li class="app-board__nav-item hide-m">Price</li>
                    </ul>
                    <div class="app-borad__contain">
                    </div>
                </div>
            </div>
            <div class="app-bot">
                <h3 class="app-bot__title">
                    <i class="fa-solid fa-address-card"></i>
                    <p>Information</p>
                    <!-- <i class="app-bot__title-resize fa-solid fa-arrow-down"></i> -->
                </h3>
                <div class="app-bot__info-contain">
                    <ul class="app-bot__info-list">
                        <li class="app-bot__info">
                            <p class="app-bot__info-data title productId">1.Product ID:</p>
                            <p class="app-bot__info-data value productId"</p>
                        </li>
                        <li class="app-bot__info">
                            <p class="app-bot__info-data title uid">2.UID:</p>
                            <p class="app-bot__info-data value uid"</p>
                        </li>
                        <li class="app-bot__info">
                            <p class="app-bot__info-data title type">3.Type:</p>
                            <p class="app-bot__info-data value type"</p>
                        </li>
                        <li class="app-bot__info">
                            <p class="app-bot__info-data title price">4.Price:</p>
                            <p class="app-bot__info-data value price"</p>
                        </li>
                    </ul>
                    <ul class="app-bot__info-list">
                        <li class="app-bot__info">
                            <p class="app-bot__info-data title server">5.Server:</p>
                            <p class="app-bot__info-data value server"</p>
                        </li>
                        <li class="app-bot__info">
                            <p class="app-bot__info-data title discount">6.Discount:</p>
                            <p class="app-bot__info-data value discount"</p>
                        </li>
                        <li class="app-bot__info">
                            <p class="app-bot__info-data title flashSale">7.FlashSale:</p>
                            <p class="app-bot__info-data value flashSale"</p>
                        </li>
                        <li class="app-bot__info">
                            <p class="app-bot__info-data title sold">8.Sold:</p>
                            <p class="app-bot__info-data value sold"</p>
                        </li>
                    </ul>
                </div>
            </div>
        </div>`,
    },
    {
      url: productAPi,
      key: { parent: "SẢN PHẨM", child: "Flash sale" },
      start: (key) => {
        body.product.flashSale(key);
      },
      value: `<div class="body__app">
            <div class="app__top">
                <h3 class="app__top-title">Flash sale</h3>
                <div class="app__top-feature-contain flashSale">
                    <div class="app__top-feature rippleBtn create">
                        <i class="app__top-feature-icon fa-solid fa-circle-plus"></i>
                        <p class="app__top-feature-text">Thêm vào D.s Flash Sale</p>
                    </div>
                    <div class="app__top-feature rippleBtn delete">
                        <i class="app__top-feature-icon fa-solid fa-circle-minus"></i>
                        <p class="app__top-feature-text">Xóa khỏi D.s Flash Sale</p>
                    </div>
                    <div class="app__top-feature rippleBtn selects">
                        <i class="app__top-feature-icon fa-regular fa-check-double"></i>
                        <p class="app__top-feature-text">Chọn nhiều sản phẩm</p>
                    </div>
                    <div class="app__top-feature rippleBtn replace">
                        <i class="app__top-feature-icon fa-solid fa-gift-card"></i>
                        <p class="app__top-feature-text">Điều chỉnh % giảm giá</p>
                    </div>
                </div>
            </div>
            <div class="app__mid">
                <div class="app__flashsale-contain">
                    <div class="app__flashsale-page notFlashSale">
                        <div class="app__flashsale-product-contain-title-box">
                            <h3 class="app__flashsale-product-contain-title">
                                Sản phẩm chưa Flash sale
                                <svg focusable="false" viewBox="0 0 24 25" aria-hidden="true" width="24" height="25"
                                    fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g clip-path="url(#clip0_7893_45671)">
                                        <path
                                            d="M19.882 8.3615C19.708 8.0365 19.369 7.8335 19 7.8335H14.326L15.962 2.1085C16.048 1.8065 15.988 1.4825 15.799 1.2315C15.61 0.980496 15.314 0.833496 15 0.833496H7.99998C7.54898 0.833496 7.15398 1.1355 7.03498 1.5705L4.03498 12.5705C3.95298 12.8715 4.01598 13.1935 4.20498 13.4405C4.39498 13.6875 4.68798 13.8335 4.99998 13.8335H9.80198L8.01598 23.6545C7.93098 24.1205 8.18498 24.5825 8.62498 24.7605C8.74798 24.8105 8.87498 24.8335 8.99998 24.8335C9.32698 24.8335 9.64298 24.6735 9.83298 24.3885L19.833 9.3885C20.037 9.0815 20.056 8.6875 19.882 8.3615Z"
                                            fill="#FF6264"></path>
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_7893_45671">
                                            <rect width="24" height="24" fill="white" transform="translate(0 0.833496)">
                                            </rect>
                                        </clipPath>
                                    </defs>
                                </svg>
                            </h3>
                            <button class="btn-loading app__flashsale-product-total-box">
                            <div class="btn-loading__text">
                            <p class="btn-loading__text-title">Toàn bộ</p>
                            <p class="btn-loading__text-value">(99)</p>
                            </div>
                                <div class="btn-loading__icon"></div>
                            </button>
                            <span class="app__flashsale-product-process"></span>
                        </div>
                        <ul class="app__flashsale-bars-nav">
                            <li class="app__flashsale-bars-item">
                            <i class="app__flashsale-bars-checkAll fa-solid fa-check-double"></i></li>
                            <li class="app__flashsale-bars-item uid">UID</li>
                            <li class="app__flashsale-bars-item price hide-m">Price</li>
                            <li class="app__flashsale-bars-item discount hide-m">Discount</li>
                            <li class="app__flashsale-bars-item sold">Sold</li>

                            <li class="app__flashsale-bars-item app__mid-nav">
                                <div class="app__mid-nav-search-box">
                                <input class="app__mid-nav-search" type="text" placeholder="Tìm kiếm...">
                                <i class="app__mid-nav-icon search fa-solid fa-magnifying-glass"></i>
                                <i class="app__mid-nav-clear fa-solid fa-xmark"></i>
                                </div>
                                <div class="app__mid-nav-ft-box">
                                    <div class="app__mid-nav-ft">
                                        <i class="app__mid-nav-icon fa-regular fa-bars-filter"></i>
                                    </div>
                                </div>
                            </li>
                        </ul>
                        
                        <div class="app__flashsale-product-contain notFlashSale" style="height: 374.047px;">
                        </div>
                    </div>

                    <div class="app__flashsale-page flashSale">
                        <div class="app__flashsale-product-contain-title-box">
                            <h3 class="app__flashsale-product-contain-title">
                                Sản phẩm Flash sale
                                <svg focusable="false" viewBox="0 0 24 25" aria-hidden="true" width="24" height="25"
                                    fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g clip-path="url(#clip0_7893_45671)">
                                        <path
                                            d="M19.882 8.3615C19.708 8.0365 19.369 7.8335 19 7.8335H14.326L15.962 2.1085C16.048 1.8065 15.988 1.4825 15.799 1.2315C15.61 0.980496 15.314 0.833496 15 0.833496H7.99998C7.54898 0.833496 7.15398 1.1355 7.03498 1.5705L4.03498 12.5705C3.95298 12.8715 4.01598 13.1935 4.20498 13.4405C4.39498 13.6875 4.68798 13.8335 4.99998 13.8335H9.80198L8.01598 23.6545C7.93098 24.1205 8.18498 24.5825 8.62498 24.7605C8.74798 24.8105 8.87498 24.8335 8.99998 24.8335C9.32698 24.8335 9.64298 24.6735 9.83298 24.3885L19.833 9.3885C20.037 9.0815 20.056 8.6875 19.882 8.3615Z"
                                            fill="#FF6264"></path>
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_7893_45671">
                                            <rect width="24" height="24" fill="white" transform="translate(0 0.833496)">
                                            </rect>
                                        </clipPath>
                                    </defs>
                                </svg>
                            </h3>
                            <button class="btn-loading app__flashsale-product-total-box">
                                <div class="btn-loading__text">
                                <p class="btn-loading__text-title">Toàn bộ</p>
                                <p class="btn-loading__text-value">(99)</p>
                                </div>
                                <div class="btn-loading__icon"></div>
                            </button>
                            <span class="app__flashsale-product-process"></span>
                        </div>
                        <ul class="app__flashsale-bars-nav">
                            <li class="app__flashsale-bars-item">
                            <i class="app__flashsale-bars-checkAll fa-solid fa-check-double"></i></li>
                            <li class="app__flashsale-bars-item">UID</li>
                            <li class="app__flashsale-bars-item hide-m">Price</li>
                            <li class="app__flashsale-bars-item hide-m">Discount</li>
                            <li class="app__flashsale-bars-item">Sold</li>

                            <li class="app__flashsale-bars-item app__mid-nav">
                                <div class="app__mid-nav-search-box">
                                <input class="app__mid-nav-search" type="text" placeholder="Tìm kiếm...">
                                <i class="app__mid-nav-icon search fa-solid fa-magnifying-glass"></i>
                                <i class="app__mid-nav-clear fa-solid fa-xmark"></i>
                                </div>
                                <div class="app__mid-nav-ft-box">
                                    <div class="app__mid-nav-ft">
                                        <i class="app__mid-nav-icon fa-regular fa-bars-filter"></i>
                                    </div>
                                </div>
                            </li>
                        </ul>
                        <div class="app__flashsale-product-contain flashSale">
                        </div>
                    </div>
                </div>
            </div>
        </div>`,
    },
    {
      key: { parent: "SẢN PHẨM", child: "Process orders" },
      start: (key) => {
        body.product.ProcessOrders(key);
      },
      value: `<div class="body__app">
            <div class="app__top">
                <h3 class="app__top-title">Process order</h3>
                <!-- <div class="app__top-feature-contain handleOrder">
                    <div class="app__top-feature rippleBtn handle">
                        <i class="app__top-feature-icon fa-solid fa-microchip"></i>
                        <p class="app__top-feature-text">Xử lý đơn hàng</p>
                    </div>
                </div> -->
            </div>
            <div class="app__mid">
                <div class="app__mid-title-box">
                    <h3 class="app__mid-title">Các đơn hàng chưa xử lý</h3>
                    <span class="app__mid-title-total">10</span>
                </div>
                <div class="app__mid-contain">
                    <ul class="app__mid-item-list title">
                        <li class="app__mid-item code">Code</li>
                        <li class="app__mid-item product">Uid</li>
                        <li class="app__mid-item price">Price</li>
                        <li class="app__mid-item date">Date</li>
                        <li class="app__mid-item app__mid-nav">
                            <div class="app__mid-nav-search-box">
                            <input class="app__mid-nav-search" type="text" placeholder="Tìm kiếm...">
                            <i class="app__mid-nav-icon search fa-solid fa-magnifying-glass"></i>
                            <i class="app__mid-nav-clear fa-solid fa-xmark"></i>
                            </div>
                            <div class="app__mid-nav-ft-box">
                                <div class="app__mid-nav-ft">
                                    <i class="app__mid-nav-icon fa-regular fa-bars-filter"></i>
                                </div>
                            </div>
                        </li>
                    </ul>
                    <div class="app__mid-item-wrap">
                        <!-- <ul class="app__mid-item-list content">
                            <li class="app__mid-item code">BHB881999999</li>
                            <li class="app__mid-item product">881999999</li>
                            <li class="app__mid-item price">500.500đ</li>
                            <li class="app__mid-item date">26/01/2023</li>
                        </ul> -->
                    </div>
                </div>
            </div>
        </div>`,
    },
    {
      key: { parent: "TIỀN TỆ", child: "Manage" },
      start: (key) => {
        body.currency.manage(key);
      },
      value: ` <div class="body__app">
            <div class="app__top">
                <h3 class="app__top-title">Manage</h3>
            </div>
            <div class="app__mid">
                <div class="app__mid-title-box">
                    <h3 class="app__mid-title">Các đơn nạp chưa xử lý</h3>
                    <span class="app__mid-title-total">0</span>
                </div>
                <div class="app__mid-contain">
                    <ul class="app__mid-item-list title">
                        <li class="app__mid-item code">Code</li>
                        <li class="app__mid-item product">Username</li>
                        <li class="app__mid-item price">Money</li>
                        <li class="app__mid-item date">Date</li>
                        <li class="app__mid-item app__mid-nav">
                            <div class="app__mid-nav-search-box">
                                <input class="app__mid-nav-search" type="text" placeholder="Tìm kiếm...">
                                <i class="app__mid-nav-icon search fa-solid fa-magnifying-glass"></i>
                                <i class="app__mid-nav-clear fa-solid fa-xmark"></i>
                            </div>
                            <div class="app__mid-nav-ft-box">
                                <div class="app__mid-nav-ft">
                                    <i class="app__mid-nav-icon fa-regular fa-bars-filter"></i>
                                </div>
                            </div>
                        </li>
                    </ul>
                    <div class="app__mid-item-wrap">
                    </div>
                </div>
            </div>
        </div>`,
    },
  ],
  categoryHistory: function () {
    const key = JSON.parse(localStorage.getItem("categoryHistory"));

    //Render the category history
    if (!key) {
      this.renderHTML(body.bodyHTML[0].key);
      $(".nav__category-options").classList.add("active");
    } else {
      this.renderHTML(key);

      //Active category
      for (let parent of $$(".nav__category-title")) {
        if (parent.innerText.includes(key.parent)) {
          parent = parent.closest(".nav__category");

          for (const child of parent.querySelectorAll(
            ".nav__category-options-tx"
          )) {
            if (child.innerText.includes(key.child)) {
              child.closest(".nav__category-options").classList.add("active");
            }
          }
        }
      }
    }
  },

  start: function () {
    this.login();
    this.categoryHistory();
  },
};
body.start();

//Handle from branching structure

//Top
const appTop = {
  feature: $$(".app__top-feature"),

  start: function () {
    select(this.feature);
  },
};
appTop.start();

//Mid
/***** Nav *****/
const nav = {
  navMain: $(".nav"),
  navTop: $(".nav-top"),
  navMid: $(".nav-mid"),
  optElement: $$(".nav__category-options"),

  //Create key and call render body
  open: function () {
    this.optElement.forEach((element) => {
      element.onclick = () => {
        const key = {
          parent: element.closest(".nav__category").getAttribute("Name"),
          child: element.querySelector(".nav__category-options-tx").innerText,
        };
        body.renderHTML(key);
      };
    });
  },

  resize: function () {
    let titleOld = [];
    let contentOld = [];
    let userInfo = $(".user__info");
    let logOutText = $(".log-out__text");
    const button = $(".nav-top-resize");

    //Zoom out
    const resize = () => {
      const titles = $$(".nav__category-title");
      const optTexts = $$(".nav__category-options-tx");
      const logo = $(".nav-logo");

      this.navMain.classList.toggle("resize");
      this.navTop.classList.toggle("resize");
      this.navMid.classList.toggle("resize");

      if (this.navTop.classList.value.match(/resize/) !== null) {
        const handleText = (element, accmulate) => {
          let current = element.innerText;

          accmulate.push(current);
          return current;
        };

        titleOld = [];
        contentOld = [];

        logo.src = "../asset/icon/Hb-store_not-text_remove-bg.png";

        for (let item of optTexts) {
          item.style.opacity = 0;
          item.style.display = "none";
          handleText(item, contentOld);
        }

        for (let item of titles) {
          item.innerText = handleText(item, titleOld).slice(0, 1);
        }

        userInfo.style.opacity = 0;
        userInfo.style.display = "none";

        logOutText.style.opacity = 0;
        logOutText.style.display = "none";
      } else {
        logo.src = "../asset/img/logo-full.png";

        setTimeout(() => {
          for (let i = 0; i < titleOld.length; i++) {
            titles[i].innerText = titleOld[i];
          }

          for (let i = 0; i < contentOld.length; i++) {
            optTexts[i].innerText = contentOld[i];

            userInfo.style.display = "block";
            logOutText.style.display = "block";
            optTexts[i].style.display = "block";
            setTimeout(() => {
              userInfo.style.opacity = 1;
              logOutText.style.opacity = 1;
              optTexts[i].style.opacity = 1;
            }, 30);
          }
        }, 50);
      }
    };

    if (window.innerWidth < 960) {
      setTimeout(() => {
        button.click();
      }, 500);
    }
    button.addEventListener("click", resize);
  },

  logout: function () {
    //remove data and navigation to login page
    $(".nav_bot__log-out").onclick = () => {
      sessionStorage.removeItem("adminInfo");
      admin = "";
      window.location.href = window.location.origin + "/admin-manager26/login";
    };
  },

  //Set name category
  setNameCategory: function () {
    $$(".nav__category").forEach((element) => {
      const categoryName = element.querySelector(
        ".nav__category-title"
      ).innerText;
      element.setAttribute("Name", categoryName);
    });
  },

  start: function () {
    this.setNameCategory();
    select(this.optElement);
    this.open();
    this.resize();
    this.logout();
    body.handle.shared.getOrderRealtime();
  },
};
nav.start();