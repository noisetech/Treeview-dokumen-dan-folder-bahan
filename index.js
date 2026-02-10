document.addEventListener("DOMContentLoaded", function () {
  const tree = document.querySelector('[role="tree"]');
//   const output = document.getElementById("last_action");

  /* ===============================
     INIT TREE (UNLIMITED LEVEL SAFE)
  =============================== */
  document.querySelectorAll('[role="treeitem"]').forEach(item => {
    const group = item.querySelector(':scope > ul');

    if (group) {
      group.setAttribute('role', 'group');
      item.setAttribute('aria-expanded', 'false'); // default closed
    }

    item.setAttribute('tabindex', '0');
  });

  /* ===============================
     FUNCTION: GET FULL PATH
  =============================== */
  function getFullPath(item) {
    let path = [];
    let current = item;

    while (current && current.matches('[role="treeitem"]')) {
      const labelEl = current.querySelector(':scope > span');
      const label = labelEl
        ? labelEl.innerText.trim()
        : current.childNodes[0].textContent.trim();

      path.unshift(label);
      current = current.parentElement.closest('[role="treeitem"]');
    }

    return path.join(" / ");
  }

  /* ===============================
     CLICK HANDLER
  =============================== */
  tree.addEventListener("click", function (e) {
    const item = e.target.closest('[role="treeitem"]');
    if (!item) return;

    const isFolder = item.querySelector(':scope > ul');

    // REMOVE OLD SELECTION
    document.querySelectorAll('[aria-selected="true"]')
      .forEach(el => el.setAttribute("aria-selected", "false"));

    // SET NEW SELECTION
    item.setAttribute("aria-selected", "true");

    // GET NAME
    const labelEl = item.querySelector(':scope > span');
    const name = labelEl
      ? labelEl.innerText.trim()
      : item.childNodes[0].textContent.trim();

    // GET PATH
    const path = getFullPath(item);

    // SHOW NAME IN INPUT
    // output.value = name;

    // DEBUG / BACKEND READY
    console.log("Nama:", name);
    console.log("Full Path:", path);

    // OPTIONAL hidden inputs (Laravel ready)
    document.getElementById("file_name")?.setAttribute("value", name);
    document.getElementById("file_path")?.setAttribute("value", path);

    // TOGGLE FOLDER
    if (isFolder) {
      const expanded = item.getAttribute("aria-expanded") === "true";
      item.setAttribute("aria-expanded", !expanded);
    }

    e.stopPropagation();
  });

  /* ===============================
     KEYBOARD NAVIGATION
  =============================== */
  tree.addEventListener("keydown", function (e) {
    const current = document.activeElement.closest('[role="treeitem"]');
    if (!current) return;

    const visibleItems = [...tree.querySelectorAll('[role="treeitem"]')]
      .filter(el => el.offsetParent !== null);

    let index = visibleItems.indexOf(current);

    switch (e.key) {
      case "ArrowDown":
        if (visibleItems[index + 1]) visibleItems[index + 1].focus();
        break;

      case "ArrowUp":
        if (visibleItems[index - 1]) visibleItems[index - 1].focus();
        break;

      case "ArrowRight":
        const openGroup = current.querySelector(':scope > ul');
        if (openGroup) current.setAttribute("aria-expanded", "true");
        break;

      case "ArrowLeft":
        if (current.getAttribute("aria-expanded") === "true") {
          current.setAttribute("aria-expanded", "false");
        } else {
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

});
