document.addEventListener("DOMContentLoaded", function () {
  const treeContainer = document.getElementById("tree-container");

  // ===============================
  // DATA TREE
  // ===============================
  const treeData = {
    name: "Root Folder",
    children: [
      { name: "file-level1.docx" },
      {
        name: "Level 1 Folder",
        children: [
          {
            name: "Level 2 Folder",
            children: [
              {
                name: "Level 3 Folder",
                children: [
                  { name: "file-gg-1.docx" },
                  { name: "file-ww-2.jpg" },
                  {
                    name: "Level 4 Folder",
                    children: [
                      {
                        name: "Level 5 Folder",
                        children: [
                          { name: "file-dd-1.pdf" },
                          { name: "file-aa-2.zip" },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          { name: "file-bebas.xls" },
        ],
      },
    ],
  };

  // ===============================
  // BUILD TREE
  // ===============================
  // function buildTree(node) {
  //   const li = document.createElement("li");
  //   li.setAttribute("role", "treeitem");
  //   li.setAttribute("tabindex", "0");
  //   li.setAttribute("aria-selected", "false");

  //   if (node.children) {
  //     li.setAttribute("aria-expanded", "false");
  //     const span = document.createElement("span");
  //     span.textContent = node.name;
  //     li.appendChild(span);

  //     const ul = document.createElement("ul");
  //     ul.setAttribute("role", "group");
  //     node.children.forEach((child) => ul.appendChild(buildTree(child)));
  //     li.appendChild(ul);
  //   } else {
  //     li.classList.add("file");
  //     li.textContent = node.name;
  //   }

  //   return li;
  // }

  function buildTree(node) {
    const li = document.createElement("li");
    li.setAttribute("role", "treeitem");
    li.setAttribute("tabindex", "0");
    li.setAttribute("aria-selected", "false");

    if (node.children) {
      // folder
      li.setAttribute("aria-expanded", "false");
      const span = document.createElement("span");
      span.textContent = node.name;
      li.appendChild(span);

      const ul = document.createElement("ul");
      ul.setAttribute("role", "group");
      node.children.forEach((child) => {
        ul.appendChild(buildTree(child));
      });
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

  treeContainer.appendChild(buildTree(treeData));
  const tree = treeContainer;

  let lastSelected = null;

  // ===============================
  // HELPER
  // ===============================
  function getVisibleItems() {
    return [...tree.querySelectorAll('[role="treeitem"]')].filter(
      (el) => el.offsetParent !== null,
    );
  }

  function clearSelection(scope = tree) {
    scope
      .querySelectorAll('[aria-selected="true"]')
      .forEach((el) => el.setAttribute("aria-selected", "false"));
  }

  function selectItem(item) {
    item.setAttribute("aria-selected", "true");
  }

  function toggleItem(item) {
    const isSelected = item.getAttribute("aria-selected") === "true";
    item.setAttribute("aria-selected", (!isSelected).toString());
  }

  // ===============================
  // CLICK (MULTI SELECT + FOLDER TOGGLE)
  // ===============================
  tree.addEventListener("click", function (e) {
    const item = e.target.closest('[role="treeitem"]');
    if (!item) return;

    const isFolder = item.querySelector(":scope > ul");

    // CMD / CTRL select
    if (e.metaKey || e.ctrlKey) {
      toggleItem(item);
      lastSelected = item;
    }
    // SHIFT range
    else if (e.shiftKey && lastSelected) {
      const items = getVisibleItems();
      const start = items.indexOf(lastSelected);
      const end = items.indexOf(item);
      const [min, max] = start < end ? [start, end] : [end, start];

      clearSelection();
      for (let i = min; i <= max; i++) {
        selectItem(items[i]);
      }
    }
    // Single select
    else {
      clearSelection();
      selectItem(item);
      lastSelected = item;
    }

    // console.log(lastSelected);

    // Toggle folder
    if (isFolder) {
      const expanded = item.getAttribute("aria-expanded") === "true";
      item.setAttribute("aria-expanded", (!expanded).toString());
    }

    e.stopPropagation();
  });

  // ===============================
  // KEYBOARD NAVIGATION (TETAP ADA)
  // ===============================
  tree.addEventListener("keydown", function (e) {
    const current = document.activeElement.closest('[role="treeitem"]');
    if (!current) return;

    const visibleItems = getVisibleItems();
    let index = visibleItems.indexOf(current);

    switch (e.key) {
      case "ArrowDown":
        if (visibleItems[index + 1]) visibleItems[index + 1].focus();
        break;
      case "ArrowUp":
        if (visibleItems[index - 1]) visibleItems[index - 1].focus();
        break;
      case "ArrowRight":
        const openGroup = current.querySelector(":scope > ul");
        if (openGroup) current.setAttribute("aria-expanded", "true");
        break;
      case "ArrowLeft":
        if (current.getAttribute("aria-expanded") === "true")
          current.setAttribute("aria-expanded", "false");
        else {
          const parent = current.parentElement.closest('[role="treeitem"]');
          if (parent) parent.focus();
        }
        break;
      case "Enter":
      case " ":
        current.click();
        break;
    }
  });

  // ===============================
  // GET CURRENT PATH
  // ===============================
  function getCurrentPath(item) {
    const parentFolder = item.parentElement.closest('[role="treeitem"]');
    const parentLabelEl = parentFolder?.querySelector(":scope > span");
    const parentLabel = parentLabelEl
      ? parentLabelEl.innerText.trim()
      : parentFolder
        ? parentFolder.childNodes[0].textContent.trim()
        : "";

    const itemLabelEl = item.querySelector(":scope > span");
    const itemLabel = itemLabelEl
      ? itemLabelEl.innerText.trim()
      : item.childNodes[0].textContent.trim();

    return parentLabel ? `${parentLabel}/${itemLabel}` : itemLabel;
  }

  // function getCurrentPath(item) {
  //   const parts = [];
  //   let current = item;

  //   while (current && current.getAttribute("role") === "treeitem") {
  //     const labelEl = current.querySelector(":scope > span");
  //     const label = labelEl
  //       ? labelEl.innerText.trim()
  //       : current.childNodes[0].textContent.trim();

  //     parts.unshift(label);
  //     current = current.parentElement.closest('[role="treeitem"]');
  //   }

  //   return parts.join("/");
  // }

  // ===============================
  // DELETE MULTI
  // ===============================
  // document.querySelectorAll(".hapus").forEach((btn) => {
  //   btn.addEventListener("click", function (e) {
  //     e.preventDefault();
  //     e.stopPropagation();

  //     const card = btn.closest(".card");
  //     const selectedItems = card.querySelectorAll(
  //       '[role="treeitem"][aria-selected="true"]',
  //     );

  //     if (!selectedItems.length) {
  //       alert("Pilih file atau folder dulu!");
  //       return;
  //     }

  //     selectedItems.forEach((item) => {
  //       const path = getCurrentPath(item);
  //       console.log("Hapus:", path);
  //       item.remove();

  //       // kirim ke backend contoh
  //       // fetch('/hapus-file', {
  //       //   method: 'POST',
  //       //   headers: { 'Content-Type': 'application/json' },
  //       //   body: JSON.stringify({ path })
  //       // });
  //     });
  //   });
  // });

  document.querySelectorAll(".hapus").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      const card = btn.closest(".card");
      const selectedItems = card.querySelectorAll(
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

      console.log("Dihapus banyak:", paths);

      // contoh kirim array ke backend
      // fetch('/hapus-file', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ paths })
      // });
    });
  });
});
