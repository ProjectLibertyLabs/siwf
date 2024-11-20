// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = `
        <a id="logo" href="https://projectlibertylabs.github.io/siwf/v2/docs">
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" viewBox="0 0 484.9 136.3">
            <style type="text/css">
             	.st0{fill:#00B6AF;}
             	.st2{fill:#ffffff;}
            </style>
            <path d="M0 1.5v68.9h12.1V49l24.3-10.4-.3-12.3-23.9 10.1V13H43V1.5H0zM58.8 13H75c5.3 0 9.6 2.6 9.6 8.3s-4.3 8.4-9.6 8.4H58.8V13zM46.6 1.5v68.9h12.2V53.5l37.9 16.9V57.2L59.8 41.3h14.9c11.8 0 22-7.6 22-19.9S86.5 1.5 74.7 1.5H46.6zm53.7 0v68.9h42.9V58.8h-30.8V41.6h30.8V30.1h-30.8V13h30.8V1.5h-42.9zm158.5 0v47.1c0 7.1-5.1 11.9-12.1 11.9s-12-4.8-12-11.9V1.5h-12.1v46.9c0 13.9 10.8 23.4 24.2 23.4 13.4 0 24.2-9.6 24.2-23.4V1.5h-12.2zm15.8 0v68.9h42.9V58.8h-30.8V41.6h30.8V30.1h-30.8V13h30.8V1.5h-42.9zm85 0V48L334.4 1.5h-13.1v68.9h11.9V24l25.4 46.4h13V1.5h-12zm112.4 0-9.6 25.9-10-25.9H439l29.2 68.9h12.6l-12.1-28.7 16.2-40.1h-12.8c-.1 0-.1-.1-.1-.1zM158.5 35.9c0-13.5 10.9-24.5 24.5-24.5s24.5 10.9 24.5 24.5c0 4.3-1 8.5-3.3 12.3L177 31.4v13.7l19.1 11.6c-4 2.4-8.5 3.8-13.2 3.8-13.4.1-24.3-10.6-24.4-24v-.6M182.9 0c-19.8.1-35.9 16.2-35.8 36s16.2 35.9 36 35.8c8.6 0 16.9-3.2 23.4-8.8l12.2 7.4V57.2l-4.8-2.9c3.2-5.6 4.8-11.9 4.8-18.3C218.9 16.3 203 .2 183.4.1c-.2 0-.3 0-.5-.1zm228.2 0c-19.8 0-36 16-36 35.9s16 36 35.9 36c11.5 0 22.2-5.4 28.9-14.6l-8.4-8.4c-4.1 7.4-12 11.9-20.4 11.7-13.9 0-24.3-10.6-24.3-24.5s10.5-24.6 24.3-24.6c8.4-.2 16.3 4.3 20.4 11.8l8.4-8.4c-6.7-9.6-17.4-15-28.8-14.9z" class="st0"/>
            <defs>
              <path id="a" d="M0 1.5v68.9h12.1V49l24.3-10.4-.3-12.3-23.9 10.1V13H43V1.5H0zM58.8 13H75c5.3 0 9.6 2.6 9.6 8.3s-4.3 8.4-9.6 8.4H58.8V13zM46.6 1.5v68.9h12.2V53.5l37.9 16.9V57.2L59.8 41.3h14.9c11.8 0 22-7.6 22-19.9S86.5 1.5 74.7 1.5H46.6zm53.7 0v68.9h42.9V58.8h-30.8V41.6h30.8V30.1h-30.8V13h30.8V1.5h-42.9zm158.5 0v47.1c0 7.1-5.1 11.9-12.1 11.9s-12-4.8-12-11.9V1.5h-12.1v46.9c0 13.9 10.8 23.4 24.2 23.4 13.4 0 24.2-9.6 24.2-23.4V1.5h-12.2zm15.8 0v68.9h42.9V58.8h-30.8V41.6h30.8V30.1h-30.8V13h30.8V1.5h-42.9zm85 0V48L334.4 1.5h-13.1v68.9h11.9V24l25.4 46.4h13V1.5h-12zm112.4 0-9.6 25.9-10-25.9H439l29.2 68.9h12.6l-12.1-28.7 16.2-40.1h-12.8c-.1 0-.1-.1-.1-.1zM158.5 35.9c0-13.5 10.9-24.5 24.5-24.5s24.5 10.9 24.5 24.5c0 4.3-1 8.5-3.3 12.3L177 31.4v13.7l19.1 11.6c-4 2.4-8.5 3.8-13.2 3.8-13.4.1-24.3-10.6-24.4-24v-.6M182.9 0c-19.8.1-35.9 16.2-35.8 36s16.2 35.9 36 35.8c8.6 0 16.9-3.2 23.4-8.8l12.2 7.4V57.2l-4.8-2.9c3.2-5.6 4.8-11.9 4.8-18.3C218.9 16.3 203 .2 183.4.1c-.2 0-.3 0-.5-.1zm228.2 0c-19.8 0-36 16-36 35.9s16 36 35.9 36c11.5 0 22.2-5.4 28.9-14.6l-8.4-8.4c-4.1 7.4-12 11.9-20.4 11.7-13.9 0-24.3-10.6-24.3-24.5s10.5-24.6 24.3-24.6c8.4-.2 16.3 4.3 20.4 11.8l8.4-8.4c-6.7-9.6-17.4-15-28.8-14.9z"/>
            </defs>
            <clipPath id="b">
              <use xlink:href="#a" style="overflow:visible"/>
            </clipPath>
            <path d="M4.2 110.1h485v71.8H4.2z" class="st0" style="clip-path:url(#b)"/>
            <path d="M283.3 92.6c.5-1.6 1.1-3.1 3.1-3.1s2.7 1.5 3.1 3.1l11.6 40.6c.4 1.4-1.2 3-2.9 3-1.9 0-2.8-1.6-3.2-3l-2.2-7.2H280l-2.3 7.2c-.4 1.4-1.4 3-3.2 3-1.7 0-3.3-1.6-2.9-3l11.7-40.6zm3.2 11.2h-.1l-4.7 16.3h9.4l-4.6-16.3zm37.2 32.4c-4.5 0-7.1-1.8-9-5.7l-5.5-11.2c-1-2-1.6-4-1.6-6.3 0-2.6.5-4.3 1.7-6.7l5.5-11.1c2-4.1 4.6-5.8 9.2-5.8h10.2c1.3 0 3 .7 3 3 0 2.2-1.6 3-3 3h-10c-2.6 0-3 .2-4.1 2.5l-5.2 10.4c-.8 1.6-1.3 2.7-1.3 4.6 0 1.7.5 2.7 1.3 4.1l5.1 10.4c1.2 2.5 1.8 2.6 4.5 2.6h9.8c1.3 0 3 .7 3 3 0 2.2-1.6 3-3 3h-10.6v.2zm32.4 0c-4.5 0-7.1-1.8-9-5.7l-5.5-11.2c-1-2-1.6-4-1.6-6.3 0-2.6.5-4.3 1.7-6.7l5.5-11.1c2-4.1 4.6-5.8 9.2-5.8h10.2c1.3 0 3 .7 3 3 0 2.2-1.6 3-3 3h-10c-2.6 0-3 .2-4.1 2.5l-5.2 10.4c-.8 1.6-1.3 2.7-1.3 4.6 0 1.7.5 2.7 1.3 4.1l5.1 10.4c1.2 2.5 1.8 2.6 4.5 2.6h9.8c1.3 0 3 .7 3 3 0 2.2-1.6 3-3 3h-10.6v.2zm50.1-6c1.6 0 3 .8 3 3s-1.4 3-3 3h-26.6V89.6h26.6c1.6 0 3 .8 3 3s-1.4 3-3 3h-20.6v14.3h8.8c1.6 0 3 .8 3 3s-1.4 3-3 3h-8.8v14.3h20.6zm38.1-5.7c1.2 1.6 2.1 2.9 2.1 5 0 4.5-3.4 6.8-7.6 6.8h-13.2c-2.3 0-4.3-.4-6.1-1.9-1.6-1.3-2.8-3.5-2.8-5.6 0-1.9 1.1-3.6 3.2-3.6 1.7 0 2.8 1.4 2.8 3.1 0 1.8 1 2 2.6 2h13c.5 0 2 .2 2-.7 0-.5-.8-1.4-1.1-1.7l-20.5-26.6c-1.3-1.6-2-2.8-2-4.9 0-2.4 1.1-4.4 3.2-5.8 1.7-1.1 3.1-1.1 5-1.1h12.7c2.3 0 4.2.5 5.9 2 1.6 1.4 2.8 3.6 2.8 5.7 0 1.9-1 3.5-3.1 3.5-1.8 0-2.9-1.1-2.9-2.8 0-2-1-2.3-2.9-2.3h-12.7c-.7 0-2-.2-2 .8 0 .5.7 1.3.9 1.6l20.7 26.5zm37.2 0c1.2 1.6 2.1 2.9 2.1 5 0 4.5-3.4 6.8-7.6 6.8h-13.2c-2.3 0-4.3-.4-6.1-1.9-1.6-1.3-2.8-3.5-2.8-5.6 0-1.9 1.1-3.6 3.2-3.6 1.7 0 2.8 1.4 2.8 3.1 0 1.8 1 2 2.6 2h13c.5 0 2 .2 2-.7 0-.5-.8-1.4-1.1-1.7l-20.6-26.5c-1.3-1.6-2-2.8-2-4.9 0-2.4 1.1-4.4 3.2-5.8 1.7-1.1 3.1-1.1 5-1.1h12.7c2.3 0 4.2.5 5.9 2 1.6 1.4 2.8 3.6 2.8 5.7 0 1.9-1 3.5-3.1 3.5-1.8 0-2.9-1.1-2.9-2.8 0-2-1-2.3-2.9-2.3h-12.7c-.7 0-2-.2-2 .8 0 .5.7 1.3.9 1.6l20.8 26.4z" class="st2"/>
          </svg>
          </a>
        <ol class="chapter"><li class="chapter-item affix "><a href="index.html">Introduction</a></li><li class="chapter-item "><a href="QuickStart.html">Quick Start</a></li><li class="chapter-item "><a href="Actions/Actions.html">Actions</a><a class="toggle"><div>❱</div></a></li><li><ol class="section"><li class="chapter-item "><a href="Actions/Start.html">Start Login</a></li><li class="chapter-item "><a href="Actions/Response.html">Login Response</a></li></ol></li><li class="chapter-item "><a href="Reference.html">Reference</a><a class="toggle"><div>❱</div></a></li><li><ol class="section"><li class="chapter-item "><a href="SignatureGeneration.html">Signature Generation</a><a class="toggle"><div>❱</div></a></li><li><ol class="section"><li class="chapter-item "><a href="Generate.html">Generator</a></li></ol></li><li class="chapter-item "><a href="Credentials.html">Credentials</a></li><li class="chapter-item "><a href="Delegations.html">Delegations</a></li><li class="chapter-item "><a href="Payloads.html">Payloads</a></li><li class="chapter-item "><a href="DataStructures/All.html">Data Structures</a></li></ol></li></ol>
        <ol class="chapter">
            <li class="chapter-item">
                <a href="https://docs.frequency.xyz" class="nav-return">
                    Frequency Docs
                </a>
            </li>
            <li class="chapter-item">
                <a href="https://github.com/ProjectLibertyLabs/gateway" class="nav-return">
                    GitHub
                </a>
            </li>
        </ol>`;
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString();
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);
