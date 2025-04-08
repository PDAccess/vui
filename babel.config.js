const removeConsolePlugin = []
if(process.env.NODE_ENV === 'production') {
  removeConsolePlugin.push(["transform-remove-console", { "exclude": [ "error"] }])
}
module.exports = {
  presets: [
    '@vue/app'
  ],
  plugins: removeConsolePlugin
}
