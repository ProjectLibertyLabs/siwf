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
        // MOD: Update innerHTML to have the correct contents
        this.innerHTML = `
        <div class="sidebar-contents">
          <a id="logo" href="https://projectlibertylabs.github.io/gateway/">
              Sign In With Frequency
          </a>
          <div id="toc">
            <ol class="chapter"><li class="chapter-item affix "><a href="index.html">Introduction</a></li><li class="chapter-item "><a href="QuickStart.html">Quick Start</a></li><li class="chapter-item "><a href="Actions/Actions.html">Actions</a><a class="toggle"><div>❱</div></a></li><li><ol class="section"><li class="chapter-item "><a href="Actions/Start.html">Start Login</a></li><li class="chapter-item "><a href="Actions/Response.html">Login Response</a></li></ol></li><li class="chapter-item "><a href="Reference.html">Reference</a><a class="toggle"><div>❱</div></a></li><li><ol class="section"><li class="chapter-item "><a href="SignatureGeneration.html">Signature Generation</a><a class="toggle"><div>❱</div></a></li><li><ol class="section"><li class="chapter-item "><a href="Generate.html">Generator</a></li></ol></li><li class="chapter-item "><a href="Credentials.html">Credentials</a></li><li class="chapter-item "><a href="Delegations.html">Delegations</a></li><li class="chapter-item "><a href="Payloads.html">Payloads</a></li><li class="chapter-item "><a href="DataStructures/All.html">Data Structures</a></li></ol></li><li class="chapter-item "><a href="SDK/Overview.html">SIWF SDK</a><a class="toggle"><div>❱</div></a></li><li><ol class="section"><li class="chapter-item "><a href="SDK/Android.html">Android</a></li><li class="chapter-item "><a href="SDK/iOS.html">iOS</a></li><li class="chapter-item "><a href="SDK/Web.html">Web</a></li></ol></li></ol>
          </div>
          <div class="spacer"></div>
          <ol class="chapter pt-2">
                <li class="chapter-item">
                  <a href="https://github.com/ProjectLibertyLabs/siwf" title="Git repository" aria-label="Git repository">
                      <i id="git-repository-button" class="fa fa-github"></i> GitHub
                  </a>
                  </li>
          </ol>
        </div>`;
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString().split("#")[0].split("?")[0];
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
        // MOD: Always do this as otherwise it breaks the content scrolling
        if (true || sidebarScrollTop) {
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
