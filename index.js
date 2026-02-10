document.addEventListener("DOMContentLoaded", function () {
  const treeContainer = document.getElementById("tree-container");

  // ===============================
  // Contoh JSON untuk tree
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
                          { name: "file-aa-2.docx" },
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

  console.log(treeData);

  // ===============================
  // FUNCTION: BUILD TREE RECURSIVE
  // ===============================
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

  // build root tree
  treeContainer.appendChild(buildTree(treeData));

  // ===============================
  // TREE INTERACTION (sesuai js lama)
  // ===============================
  const tree = treeContainer;

  tree.addEventListener("click", function (e) {
    const item = e.target.closest('[role="treeitem"]');
    if (!item) return;

    const isFolder = item.querySelector(":scope > ul");

    // REMOVE OLD SELECTION
    document
      .querySelectorAll('[aria-selected="true"]')
      .forEach((el) => el.setAttribute("aria-selected", "false"));

    // SET NEW SELECTION
    item.setAttribute("aria-selected", "true");

    // TOGGLE FOLDER
    if (isFolder) {
      const expanded = item.getAttribute("aria-expanded") === "true";
      item.setAttribute("aria-expanded", !expanded);
    }

    e.stopPropagation();
  });

  tree.addEventListener("keydown", function (e) {
    const current = document.activeElement.closest('[role="treeitem"]');
    if (!current) return;

    const visibleItems = [...tree.querySelectorAll('[role="treeitem"]')].filter(
      (el) => el.offsetParent !== null,
    );

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
  // HAPUS FILE/FOLDER SESUAI ITEM TERPILIH
  // ===============================
  // ===============================
  // FUNCTION: GET CURRENT PATH
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

    // jika ada parent, gabungkan parent + item, jika tidak hanya item
    return parentLabel ? `${parentLabel} / ${itemLabel}` : itemLabel;
  }

  // ===============================
  // HAPUS FILE / FOLDER SESUAI ITEM TERPILIH
  // ===============================
  const deleteButtons = document.querySelectorAll(".hapus");

  deleteButtons.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      // cari card tempat tombol ini berada
      const card = btn.closest(".card");
      if (!card) return;

      // cari item yang dipilih di card
      const selectedItem = card.querySelector(
        '[role="treeitem"][aria-selected="true"]',
      );
      if (!selectedItem) {
        alert("Pilih file atau folder yang ingin dihapus!");
        return;
      }

      // ambil current path (folder saat ini)
      const currentPath = getCurrentPath(selectedItem);

      // hapus item dari DOM
      selectedItem.remove();

      console.log("Item terpilih dihapus (current path):", currentPath);

      // contoh kirim ke backend
      // fetch('/hapus-file', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ path: currentPath })
      // });
    });
  });
});
