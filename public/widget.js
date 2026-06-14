/**
 * ShahojAI Chat Widget
 * Embed this on your website to add a customer support chat
 */

(function () {
  const WIDGET_ID = 'shahojAI-widget-root'
  const WIDGET_IFRAME_ID = 'shahojAI-widget-iframe'

  // Check if widget is already loaded
  if (document.getElementById(WIDGET_ID)) {
    console.log('ShahojAI widget is already loaded')
    return
  }

  // Get organization ID from script src or data attribute
  function getOrganizationId() {
    const script = document.currentScript || document.querySelector('script[src*="widget.js"]')
    if (!script) return null

    // Try to get from data attribute
    const dataOrgId = script.getAttribute('data-org-id')
    if (dataOrgId) return dataOrgId

    // Try to parse from src URL
    const url = new URL(script.src)
    return url.searchParams.get('org_id')
  }

  const organizationId = getOrganizationId()

  if (!organizationId) {
    console.error('ShahojAI: organization ID is required. Add data-org-id to script tag.')
    return
  }

  // Create widget root
  const root = document.createElement('div')
  root.id = WIDGET_ID
  root.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 400px;
    height: 600px;
    z-index: 99999;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  `

  // Create iframe for widget
  const iframe = document.createElement('iframe')
  iframe.id = WIDGET_IFRAME_ID
  iframe.style.cssText = `
    width: 100%;
    height: 100%;
    border: none;
    border-radius: 12px;
    box-shadow: 0 5px 40px rgba(0, 0, 0, 0.16);
  `

  const widgetUrl = new URL(window.location.origin)
  widgetUrl.pathname = '/(embed)/widget'
  widgetUrl.searchParams.set('org_id', organizationId)

  iframe.src = widgetUrl.toString()
  iframe.allow = 'microphone; camera'

  root.appendChild(iframe)
  document.body.appendChild(root)

  console.log('ShahojAI widget loaded successfully')
})()
