/*!
 * Funky.js
 * Copyright(c) 2022 marshallovski
 * MIT Licensed
 * Last update: 19.08.2022
 */

const Funky = {
    params: {
        dev: false,
        rootElement: null,
        page: 'index' // default page is "index". it's also used if you dont setted "page" in Funky.init()
    },
    configured: false,
    utils: {
        log(text) {
            if (Funky.params.dev)
                return console.log(`[funkyjs]: ${text}`);
        },
        version: '0.0.1'
    },
    init(params) {
        if (typeof params !== 'object') {
            Funky.configured = false;
            throw new TypeError('[funkyjs]: `params` must be typeof Object');
        }

        Funky.params = params;
        Funky.configured = true;
        Funky.utils.log(`Started Funky.js v${Funky.utils.version}. Development mode enabled, please set \`dev\` to \`false\` in Funky.init() when deploying to production.`);

        Funky.Router(); // handling all links
        Funky.params.page = Funky.params.rootElement.getAttribute('data-page'); // set current page to home (see app.js)

        const mutationObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                Funky.Router();
            });
        });

        mutationObserver.observe(Funky.params.rootElement, { // listening to new links
            attributes: true,
            characterData: true,
            childList: true,
            subtree: true,
            attributeOldValue: true,
            characterDataOldValue: true
        });

    },
    createElement(elementProps) { // probably it's not needed
        const element = document.createElement(elementProps.tag.toLowerCase());

        if (elementProps.id) element.id = elementProps.id;
        if (elementProps.class) element.classList.add(...elementProps.class);
        if (elementProps.attr) element.setAttribute(...elementProps.attr.name, ...elementProps.attr.value);

        Funky.params.rootElement.appendChild(element);
    },
    Router() {
        if (!Funky.configured)
            throw new Error('[funkyjs]: Please configure Funky first by using Funky.init()');

        let linksCount = 0;

        document.querySelectorAll('a').forEach(element => {
            linksCount++;

            element.onclick = (event) => {
                event.preventDefault();

                if (element.getAttribute('data-page') === Funky.params.rootElement.getAttribute('data-page')) { // don't switching to another page, because the current page is the page we are switching to
                    Funky.utils.log(`Cancelled switching page request to "${element.getAttribute('data-page')}"`);
                    return null;
                } else { // if its another page
                    fetch(element.href)
                        .then(res => {
                            // checking for page status
                            if (res.status === 200 || res.status === 304) { // if page exists and no errors
                                Funky.params.rootElement.setAttribute('data-page', element.getAttribute('data-page') || 'index'); // changing current page to link's page
                                return res.text(); // returning page's HTML content
                            } else throw Error(`[funkyjs]: Error when switching page to "${element.getAttribute('data-page')}": ${res.status} (${res.statusText})`); // if some error happened
                        })
                        .then(res => {
                            Funky.utils.log(`Switching to "${element.getAttribute('data-page')}"`);
                            Funky.params.rootElement.innerHTML = new DOMParser().parseFromString(res, 'text/html').querySelector(`${Funky.params.rootElement.id ? `#${Funky.params.rootElement.id}` : `.${Funky.params.rootElement.class}`}`).innerHTML;
                        }
                        );
                }

                history.pushState({ page: element.getAttribute('data-page') }, '', element.href); // simulating navigating to another page in adressbar
            }
        });

        Funky.utils.log(`Found ${linksCount} links on page "${Funky.params.rootElement.getAttribute('data-page')}"`);
    }
};
