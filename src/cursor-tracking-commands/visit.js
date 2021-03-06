let cursorCss

before(() => {
  cy.readFile('src/css/cursor.css', {
    log: false,
  }).then((css) => {
    cursorCss = css
  })
})

export default function ({}, commandFn, ...args) {
  return commandFn(...args).then(window => {
    const cursorElement = window.document.createElement('div')

    const onMouseMove = (event) => {
      cursorElement.style.left = `${ event.pageX }px`
      cursorElement.style.top = `${ event.pageY }px`
    }

    const onClick = () => {
      cursorElement.classList.remove('cypress__cursor--click')
      void cursorElement.offsetWidth // Prevent browser from batching remove and add class commands -> force repaint so css animation runs again
      cursorElement.classList.add('cypress__cursor--click')
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('click', onClick)

    cursorElement.setAttribute('class', 'cypress__cursor')

    Cypress.$('body').append(cursorElement)
    Cypress.$('body').append(`<style>${cursorCss}</style>`)

    return Cypress.Promise.resolve(window)
  })
}
