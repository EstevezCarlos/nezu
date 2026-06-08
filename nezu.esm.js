export function def(name, template) {
    const observedAttributes = [
        ...new Set(
            [...template.matchAll(/{{([^\s{}]+)}}/g)]
                .map(match => match[1])
        )
    ]

    customElements.define(name, class Component extends HTMLElement {
        static get observedAttributes() {
            return observedAttributes
        }

        constructor() {
            super()
            this.attachShadow({ mode: "open" })
        }

        connectedCallback() {
            this.render()
        }

        attributeChangedCallback(name, oldValue, newValue) {
            if (oldValue !== newValue) {
                this.render()
            }
        }

        render() {
            let html = template

            for (const attributeName of observedAttributes) {
                html = html.replaceAll(
                    `{{${attributeName}}}`,
                    this.getAttribute(attributeName) ?? ""
                )
            }

            this.shadowRoot.innerHTML = html
        }
    })
}

