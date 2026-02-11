document.addEventListener("DOMContentLoaded", function () {
  const treeContainer = document.getElementById("tree-container");

  const treeData = {
    name: "Belajar PHP",
    children: [
      { name: "file-level1.docx" },

      {
        name: "Dasar PHP",
        children: [
          { name: "root-file.txt" },
          {
            name: "Level 1 Folder",
            children: [
              { name: "file-l1.docx" },
              {
                name: "Level 2 Folder",
                children: [
                  { name: "file-l2.pdf" },
                  {
                    name: "Level 3 Folder",
                    children: [
                      { name: "file-l3.jpg" },
                      {
                        name: "Level 4 Folder",
                        children: [
                          { name: "file-l4.png" },
                          {
                            name: "Level 5 Folder",
                            children: [
                              { name: "file-l5-a.zip" },
                              { name: "file-l5-b.xls" },
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
        ],
      },

      {
        name: "Belajar OOP",
        children: [
          { name: "root-file.txt" },
          {
            name: "Level 1 Folder",
            children: [
              { name: "file-l1.docx" },
              {
                name: "Level 2 Folder",
                children: [
                  { name: "file-l2.pdf" },
                  {
                    name: "Level 3 Folder",
                    children: [
                      { name: "file-l3.jpg" },
                      {
                        name: "Level 4 Folder",
                        children: [
                          { name: "file-l4.png" },
                          {
                            name: "Level 5 Folder",
                            children: [
                              { name: "file-l5-a.zip" },
                              { name: "file-l5-b.docx" },
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
        ],
      },
    ],
  };

  function buildTree(node) {
    const li = document.createElement("li");
    li.setAttribute("role", "treeitem");
    li.setAttribute("tabindex", "0");
    li.setAttribute("aria-selected", "false");

    if (node.children) {
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

  function expandParents(item) {
    let parent = item.parentElement.closest('[role="treeitem"]');
    while (parent) {
      parent.setAttribute("aria-expanded", "true");
      parent = parent.parentElement.closest('[role="treeitem"]');
    }
  }

  function scrollToItem(item) {
    item.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function clearSearchHighlight() {
    tree.querySelectorAll(".tree-match").forEach((el) => {
      el.classList.remove("tree-match");
    });
  }

  tree.addEventListener("click", function (e) {
    const item = e.target.closest('[role="treeitem"]');
    if (!item) return;

    const isFolder = item.querySelector(":scope > ul");

    if (e.metaKey || e.ctrlKey) {
      toggleItem(item);
      lastSelected = item;
    } else if (e.shiftKey && lastSelected) {
      const items = getVisibleItems();
      const start = items.indexOf(lastSelected);
      const end = items.indexOf(item);
      const [min, max] = start < end ? [start, end] : [end, start];

      clearSelection();
      for (let i = min; i <= max; i++) {
        selectItem(items[i]);
      }
    } else {
      clearSelection();
      selectItem(item);
      lastSelected = item;
    }

    if (isFolder) {
      const expanded = item.getAttribute("aria-expanded") === "true";
      item.setAttribute("aria-expanded", (!expanded).toString());
    }

    e.stopPropagation();
  });

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
    });
  });

  document.getElementById("searchFile")?.addEventListener("input", function () {
    const keyword = this.value.toLowerCase().trim();

    clearSearchHighlight();
    clearSelection();

    tree.querySelectorAll('[aria-expanded="true"]').forEach((el) => {
      el.setAttribute("aria-expanded", "false");
    });

    if (!keyword) return;

    const items = tree.querySelectorAll('[role="treeitem"]');

    items.forEach((item) => {
      const labelEl = item.querySelector(":scope > span");
      const label = labelEl
        ? labelEl.innerText.toLowerCase()
        : item.childNodes[0].textContent.toLowerCase();

      if (label.includes(keyword)) {
        expandParents(item);
        item.classList.add("tree-match");
        item.setAttribute("aria-selected", "true");
        scrollToItem(item);
      }
    });
  });
});
