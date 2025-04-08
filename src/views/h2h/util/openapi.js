import { Configuration as TacasConfiguration } from "@/generated/tacacs/index.ts"
import { Configuration as AuthConfiguration } from "@/generated/authws/index.ts"
import { Configuration as CManagerConfiguration } from "@/generated/cmanager/index.ts"
import { Configuration as TerminalConfiguration } from "@/generated/terminal/index.ts"

// This Plugin inserts configurations to vue instance.
// In the future, we will added all openapi configuration in here.
// in the vue component, you can call with this.$<configuration_name>
const OpenApiConfigPlugin = {
  install(Vue, options) {
    Vue.prototype.$tacacsHttpConfig = new TacasConfiguration({
      basePath: "/api/v1/tacacs"
    })

    Vue.prototype.$authHttpConfig = new AuthConfiguration({
      basePath: "/api/v1/auth"
    })

    Vue.prototype.$cmanagerHttpConfig = new CManagerConfiguration({
      basePath: "/api/v1/cmanager"
    })

    Vue.prototype.$terminalHttpConfig = new TerminalConfiguration({
      basePath: "/api/v1/terminal"
    })
  }
}

export default OpenApiConfigPlugin;
