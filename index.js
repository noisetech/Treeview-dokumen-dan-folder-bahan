document.addEventListener("DOMContentLoaded", function () {
  const treeContainer = document.getElementById("tree-container");

  const treeData = [
    {
      name: "Belajar PHP",
      children: [
        { name: "intro.pdf" },
        {
          name: "Dasar PHP",
          children: [
            { name: "variabel.txt" },
            {
              name: "Struktur Kontrol",
              children: [
                { name: "if-else.docx" },
                {
                  name: "Perulangan",
                  children: [
                    { name: "for-loop.pdf" },
                    {
                      name: "Latihan",
                      children: [
                        { name: "latihan-1.zip" },
                        { name: "latihan-2.zip" },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: "Belajar JavaScript",
      children: [
        { name: "intro-js.pdf" },
        {
          name: "Fundamental",
          children: [
            { name: "variable.txt" },
            {
              name: "Function",
              children: [
                { name: "arrow-function.docx" },
                {
                  name: "Async JS",
                  children: [
                    { name: "promise.pdf" },
                    {
                      name: "Studi Kasus",
                      children: [
                        { name: "case-api.zip" },
                        { name: "case-dom.zip" },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: "Belajar Laravel",
      children: [
        { name: "overview.pdf" },
        {
          name: "Routing",
          children: [
            { name: "basic-route.txt" },
            {
              name: "Controller",
              children: [
                { name: "resource-controller.docx" },
                {
                  name: "Middleware",
                  children: [
                    { name: "auth-middleware.pdf" },
                    {
                      name: "Project Mini",
                      children: [
                        { name: "gw-banget.zip" },
                        { name: "mini-auth.zip" },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },

    {
      name: "Belajar Laravel",
      children: [
        { name: "overview.pdf" },
        {
          name: "Routing",
          children: [
            { name: "basic-route.txt" },
            {
              name: "Controller",
              children: [
                { name: "resource-controller.docx" },
                {
                  name: "Middleware",
                  children: [
                    { name: "auth-middleware.pdf" },
                    {
                      name: "Project Mini",
                      children: [
                        { name: "mini-crud.zip" },
                        { name: "mini-auth.zip" },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },

    {
      name: "Belajar Laravel",
      children: [
        { name: "overview.pdf" },
        {
          name: "Routing",
          children: [
            { name: "basic-route.txt" },
            {
              name: "Controller",
              children: [
                { name: "resource-controller.docx" },
                {
                  name: "Middleware",
                  children: [
                    { name: "auth-middleware.pdf" },
                    {
                      name: "Project Mini",
                      children: [
                        { name: "mini-crud.zip" },
                        { name: "mini-auth.zip" },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },

    {
      name: "Belajar Laravel",
      children: [
        { name: "overview.pdf" },
        {
          name: "Routing",
          children: [
            { name: "basic-route.txt" },
            {
              name: "Controller",
              children: [
                { name: "resource-controller.docx" },
                {
                  name: "Middleware",
                  children: [
                    { name: "auth-middleware.pdf" },
                    {
                      name: "Project Mini",
                      children: [
                        { name: "mini-crud.zip" },
                        { name: "mini-auth.zip" },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ];

  /* ===============================
     BUILD TREE
  =============================== */
  function buildTree(node) {
    const li = document.createElement("li");
    li.setAttribute("role", "treeitem");
    li.tabIndex = 0;
    li.setAttribute("aria-selected", "false");

    if (node.children) {
      li.setAttribute("aria-expanded", "false");

      const span = document.createElement("span");
      span.textContent = node.name;
      span.className = "folder-label";
      li.appendChild(span);

      const ul = document.createElement("ul");
      ul.setAttribute("role", "group");
      ul.hidden = true;

      node.children.forEach((child) => ul.appendChild(buildTree(child)));
      li.appendChild(ul);
    } else {
      li.classList.add("file");
      const ext = node.name.split(".").pop().toLowerCase();

      if (ext === "pdf") li.classList.add("pdf");
      else if (["doc", "docx"].includes(ext)) li.classList.add("word");
      else if (["xls", "xlsx"].includes(ext)) li.classList.add("excel");
      else if (["png", "jpg", "jpeg", "gif", "webp"].includes(ext))
        li.classList.add("image");
      else if (["mp4", "mov", "avi"].includes(ext)) li.classList.add("video");
      else if (["zip", "rar"].includes(ext)) li.classList.add("zip");
      else li.classList.add("file-default");

      li.textContent = node.name;
    }

    return li;
  }

  treeData.forEach((root) => treeContainer.appendChild(buildTree(root)));

  let lastSelected = null;

  /* ===============================
     UTIL FUNCTIONS
  =============================== */
  function getVisibleItems() {
    return [...treeContainer.querySelectorAll('[role="treeitem"]')].filter(
      (el) => el.offsetParent !== null,
    );
  }

  function clearSelection() {
    treeContainer
      .querySelectorAll('[aria-selected="true"]')
      .forEach((el) => el.setAttribute("aria-selected", "false"));
  }

  function selectItem(item) {
    item.setAttribute("aria-selected", "true");
  }

  function expandItem(item, state) {
    const group = item.querySelector(":scope > ul");
    if (!group) return;
    item.setAttribute("aria-expanded", state);
    group.hidden = !state;
  }

  function expandParents(item) {
    let parent = item.parentElement.closest('[role="treeitem"]');
    while (parent) {
      expandItem(parent, true);
      parent = parent.parentElement.closest('[role="treeitem"]');
    }
  }

  function getCurrentPath(item) {
    let parts = [];
    let current = item;

    while (current && current.matches('[role="treeitem"]')) {
      let label = current
        .querySelector(":scope > .folder-label")
        ?.textContent?.trim();
      if (!label) {
        // fallback ambil node text pertama
        label = Array.from(current.childNodes)
          .filter((n) => n.nodeType === Node.TEXT_NODE)
          .map((n) => n.textContent.trim())
          .join("");
      }

      parts.unshift(label);
      current = current.parentElement.closest('[role="treeitem"]');
    }

    return parts.join("/");
  }

  /* ===============================
     TREE CLICK
  =============================== */
  treeContainer.addEventListener("click", function (e) {
    const item = e.target.closest('[role="treeitem"]');
    if (!item) return;

    const isFolder = item.querySelector(":scope > ul");

    // MULTI SELECTION
    if (e.ctrlKey || e.metaKey) {
      item.setAttribute(
        "aria-selected",
        item.getAttribute("aria-selected") !== "true",
      );
      lastSelected = item;
    } else if (e.shiftKey && lastSelected) {
      const items = getVisibleItems();
      const start = items.indexOf(lastSelected);
      const end = items.indexOf(item);
      const [min, max] = start < end ? [start, end] : [end, start];
      clearSelection();
      for (let i = min; i <= max; i++) selectItem(items[i]);
    } else {
      clearSelection();
      selectItem(item);
      lastSelected = item;
    }

    if (isFolder) {
      const expanded = item.getAttribute("aria-expanded") === "true";
      expandItem(item, !expanded);
    }

    e.stopPropagation();
  });

  /* ===============================
     KEYBOARD NAVIGATION
  =============================== */
  treeContainer.addEventListener("keydown", function (e) {
    const current = document.activeElement.closest('[role="treeitem"]');
    if (!current) return;

    const visibleItems = getVisibleItems();
    let index = visibleItems.indexOf(current);

    if (e.key === "ArrowDown" && visibleItems[index + 1])
      visibleItems[index + 1].focus();

    if (e.key === "ArrowUp" && visibleItems[index - 1])
      visibleItems[index - 1].focus();

    if (e.key === "ArrowRight") expandItem(current, true);
    if (e.key === "ArrowLeft") expandItem(current, false);

    if (e.key === "Enter" || e.key === " ") current.click();
  });

  /* ===============================
   HAPUS ITEM TERPILIH
=============================== */
  const hapusBtn = document.querySelector(".hapus");

  hapusBtn.addEventListener("click", function (e) {
    e.preventDefault();

    // ambil semua item yang dipilih
    const selectedItems = treeContainer.querySelectorAll(
      '[aria-selected="true"]',
    );
    if (selectedItems.length === 0) {
      alert("Tidak ada item yang dipilih!");
      return;
    }

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        selectedItems.forEach((item) => {
          const path = getCurrentPath(item); // ambil path item
          console.log("Menghapus item:", path); // bisa ganti dengan alert(path) jika mau
          item.remove(); // hapus dari DOM
        });

        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
        });
      }
    });
  });

  let searchTimeout;
  document.getElementById("searchFile")?.addEventListener("input", function () {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => doSearch(this.value), 200);
  });

  function doSearch(keyword) {
    const kw = keyword.toLowerCase().trim();

    // Hapus highlight dan selection sebelumnya
    treeContainer
      .querySelectorAll(".tree-match")
      .forEach((el) => el.classList.remove("tree-match"));
    clearSelection();

    // Tutup semua folder
    treeContainer.querySelectorAll('[aria-expanded="true"]').forEach((el) => {
      el.setAttribute("aria-expanded", "false");
      const group = el.querySelector(":scope > ul");
      if (group) group.hidden = true;
    });

    if (!kw) return;

    // Ambil semua treeitem yang **bukan folder** (tidak punya ul child)
    const items = Array.from(
      treeContainer.querySelectorAll('[role="treeitem"]'),
    ).filter((item) => !item.querySelector(":scope > ul")); // Hanya file

    let firstMatch = null;

    items.forEach((item) => {
      // label bisa di folder-label atau textContent
      const labelEl = item.querySelector(":scope > .folder-label");
      const label = labelEl
        ? labelEl.textContent.toLowerCase()
        : item.childNodes[0]?.textContent.toLowerCase() || "";

      if (label.includes(kw)) {
        expandParents(item); // expand agar terlihat
        item.classList.add("tree-match");
        item.setAttribute("aria-selected", "true");

        if (!firstMatch) firstMatch = item;
      }
    });

    // Scroll hanya ke match pertama
    if (firstMatch)
      firstMatch.scrollIntoView({ behavior: "smooth", block: "center" });
  }
});
