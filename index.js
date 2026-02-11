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

  console.log(treeData);

  /* ===============================
     BUILD TREE (OPTIMIZED)
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

  const tree = treeContainer;
  let lastSelected = null;

  /* ===============================
     UTIL
  =============================== */
  function getVisibleItems() {
    return [...tree.querySelectorAll('[role="treeitem"]')].filter(
      (el) => el.offsetParent !== null,
    );
  }

  function clearSelection() {
    tree
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

  /* ===============================
     CLICK (EVENT DELEGATION)
  =============================== */
  tree.addEventListener("click", function (e) {
    const item = e.target.closest('[role="treeitem"]');
    if (!item) return;

    const isFolder = item.querySelector(":scope > ul");

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
     KEYBOARD
  =============================== */
  tree.addEventListener("keydown", function (e) {
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
     PATH
  =============================== */
  function getCurrentPath(item) {
    let parts = [];
    let current = item;

    while (current && current.matches('[role="treeitem"]')) {
      const labelEl = current.querySelector(":scope > .folder-label");
      const label = labelEl
        ? labelEl.textContent.trim()
        : current.childNodes[0].textContent.trim();

      parts.unshift(label);
      current = current.parentElement.closest('[role="treeitem"]');
    }

    return parts.join("/");
  }

  /* ===============================
     DELETE (NO DUPLICATE LISTENER)
  =============================== */
  document.addEventListener("click", function (e) {
    if (!e.target.matches(".hapus")) return;

    e.preventDefault();
    const selectedItems = tree.querySelectorAll(
      '[role="treeitem"][aria-selected="true"]',
    );

    if (!selectedItems.length) {
      alert("Pilih file atau folder dulu!");
      return;
    }

    const paths = [];
    selectedItems.forEach((item) => {
      paths.push(getCurrentPath(item));
      item.remove();
    });

    console.log("Dihapus:", paths);
  });
});
