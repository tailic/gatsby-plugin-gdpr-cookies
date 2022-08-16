const { validGATrackingId, getCookie } = require(`../helper`)

exports.addGoogleAnalytics = ({ trackingId }) => {
  return new Promise((resolve, reject) => {
    if (window.gatsbyPluginGDPRCookiesGoogleAnalyticsAdded) return resolve(true)

    const head = document.getElementsByTagName(`head`)[0]
    const script = document.createElement(`script`)
    script.type = `text/javascript`
    script.onload = () => {
      window.gatsbyPluginGDPRCookiesGoogleAnalyticsAdded = true
      resolve(true)
    }
    script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`

    head.appendChild(script)
  })
}

exports.initializeGoogleAnalytics = (options) => {
  if (
    !window.gatsbyPluginGDPRCookiesGoogleAnalyticsInitialized &&
    getCookie(options.cookieName) === `true` &&
    validGATrackingId(options)
  ) {
    window.dataLayer = window.dataLayer || []
    window.gtag = function () {
      window.dataLayer.push(arguments)
    }
    window.gtag(`js`, new Date())

    let gaAnonymize = options.anonymize
    let gaAllowAdFeatures = options.allowAdFeatures
    let gaPageViewOnLoad = options.sendPageViewOnLoad
    let gaDebugMode = options.debugMode

    gaAnonymize = gaAnonymize !== undefined ? gaAnonymize : true
    gaAllowAdFeatures =
      gaAllowAdFeatures !== undefined ? gaAllowAdFeatures : true
    gaPageViewOnLoad = gaPageViewOnLoad !== undefined ? gaPageViewOnLoad : true
    gaDebugMode = gaDebugMode !== undefined ? gaDebugMode : true

    const gaOptions = {
      anonymize_ip: gaAnonymize,
      allow_google_signals: gaAllowAdFeatures,
      send_page_view: gaPageViewOnLoad,
      debug_mode: gaDebugMode,
    }

    // Googel requires to remove the `debug_mode` option if you want to disable the debug mode
    if (gaDebugMode === false) {
      delete gaOptions.debug_mode
    }

    window.gtag(`config`, options.trackingId, gaOptions)

    window.gatsbyPluginGDPRCookiesGoogleAnalyticsInitialized = true
  }
}

exports.trackGoogleAnalytics = (options, location) => {
  if (
    getCookie(options.cookieName) === `true` &&
    validGATrackingId(options) &&
    typeof window.gtag === `function`
  ) {
    const pagePath = location
      ? location.pathname + location.search + location.hash
      : undefined
    window.gtag(`event`, `page_view`, { page_path: pagePath })
  }
}
