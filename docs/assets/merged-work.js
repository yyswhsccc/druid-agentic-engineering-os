async function renderMergedWork() {
  const target = document.querySelector("[data-merged-work]");
  if (!target) return;

  try {
    const response = await fetch("data/merged_work.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();

    target.innerHTML = data.groups.map((group, index) => {
      const items = group.items.map((item) => `
        <article class="merged-item">
          <h4><a href="${item.url}">${item.repo} #${item.number}</a> · ${item.title}</h4>
          <p><strong>Technical point:</strong> ${item.technical_point}</p>
          <p><strong>Why it matters:</strong> ${item.why_it_matters}</p>
          <div class="merged-meta">
            <span>${item.scope}</span>
            <span>Merged ${item.merged_at.slice(0, 10)}</span>
          </div>
        </article>
      `).join("");

      return `
        <details class="evidence-group" ${index < 3 ? "open" : ""}>
          <summary>
            <h3>${group.name}</h3>
            <span>${group.items.length} merged PR${group.items.length === 1 ? "" : "s"}</span>
          </summary>
          <div class="merged-list">
            <article class="merged-item">
              <p>${group.summary}</p>
            </article>
            ${items}
          </div>
        </details>
      `;
    }).join("");

    document.querySelector("[data-expand-merged]")?.addEventListener("click", () => {
      document.querySelectorAll(".evidence-group").forEach((group) => {
        group.open = true;
      });
    });

    document.querySelector("[data-collapse-merged]")?.addEventListener("click", () => {
      document.querySelectorAll(".evidence-group").forEach((group) => {
        group.open = false;
      });
    });
  } catch (error) {
    target.innerHTML = `
      <div class="notice">
        Could not load the full merged-work evidence JSON. Open
        <a href="data/merged_work.json">data/merged_work.json</a> directly.
      </div>
    `;
  }
}

renderMergedWork();
