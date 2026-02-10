document.addEventListener("DOMContentLoaded", function () {
  const tree = document.querySelector('[role="tree"]');
  const output = document.getElementById("last_action");

  /* ===== INIT FOLDER DETECTION (UNLIMITED LEVEL SAFE) ===== */
  document.querySelectorAll('[role="treeitem"]').forEach(item => {
    const group = item.querySelector(':scope > ul');
    if (group) {
      group.setAttribute('role', 'group');
      item.setAttribute('aria-expanded', 'false');
    }
    item.setAttribute('tabindex', '0');
  });

  /* ===== CLICK HANDLER ===== */
  tree.addEventListener("click", function (e) {
    const item = e.target.closest('[role="treeitem"]');
    if (!item) return;

    const isFolder = item.querySelector(':scope > ul');

    // SELECT
    document.querySelectorAll('[aria-selected="true"]')
      .forEach(el => el.setAttribute("aria-selected", "false"));

    item.setAttribute("aria-selected", "true");

    // TAMPILKAN NAMA
    const label = item.querySelector("span")
      ? item.querySelector("span").innerText
      : item.innerText;

    output.value = label.trim();

    // TOGGLE FOLDER
    if (isFolder) {
      const expanded = item.getAttribute("aria-expanded") === "true";
      item.setAttribute("aria-expanded", !expanded);
    }

    e.stopPropagation();
  });

  /* ===== KEYBOARD NAVIGATION ===== */
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