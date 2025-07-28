document.addEventListener("DOMContentLoaded", async () => {
    const postsArea = document.querySelector(".posts-area");
    const navButtons = document.querySelector(".nav-buttons");
    const categoriesList = document.querySelector(".categories-list");

    // Load config nav buttons
    const config = await fetch("data/config.json").then(res => res.json());
    navButtons.innerHTML = "";
    config.nav.forEach(item => {
        const a = document.createElement("a");
        a.className = "nav-button";
        a.textContent = item.label;
        a.href = item.link;
        if (item.action) a.setAttribute("onclick", item.action + "()");
        navButtons.appendChild(a);
    });

    // Load Markdown from posts folder
    const response = await fetch("posts/2025-07-28-my-first-post.md");
    const text = await response.text();

    const metaMatch = text.match(/^---([\s\S]+?)---/);
    const meta = {};
    if (metaMatch) {
        const lines = metaMatch[1].trim().split("\n");
        lines.forEach(line => {
            const [key, val] = line.split(":").map(s => s.trim());
            if (key === "categories") {
                meta[key] = JSON.parse(val.replace(/'/g, '"'));
            } else {
                meta[key] = val.replace(/^["']|["']$/g, "");
            }
        });
    }

    const markdown = text.replace(/^---[\s\S]+?---/, "").trim();
    const html = marked.parse(markdown);
    postsArea.innerHTML = `
        <article class="post-item">
            <div class="post-date">${meta.date}</div>
            <h2 class="post-title"><a href="#">${meta.title}</a></h2>
            <div class="post-excerpt">${html}</div>
            <div class="post-meta-footer">Categories: ${meta.categories.join(", ")}</div>
        </article>
    `;

    // Load categories
    categoriesList.innerHTML = "";
    meta.categories.forEach(cat => {
        const li = document.createElement("li");
        li.innerHTML = `<a href="#">${cat}</a>`;
        categoriesList.appendChild(li);
    });
});