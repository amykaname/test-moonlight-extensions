import { ExtensionWebExports } from "@moonlight-mod/types";

// https://moonlight-mod.github.io/ext-dev/webpack/#patching
export const patches: ExtensionWebExports["patches"] = [
  {
    find: /window\.Notification/g,
    replace: [{
      match: /window\.Notification/g,
      replacement: 'Maxine.Notification'
    }, {
      match: /showNotification(?::function)?\((.*?)\){/,
      replacement: "showNotification:function($1){" +
        "let __temp = Maxine.handleShowNotification($1);" +
        "if (typeof __temp !== 'undefined') return __temp;",
    }]
  }
];

// https://moonlight-mod.github.io/ext-dev/webpack/#webpack-module-insertion
export const webpackModules: ExtensionWebExports["webpackModules"] = {
  entrypoint: {
    dependencies: [
      {
        ext: "richNotifications",
        id: "someLibrary"
      }
    ],
    entrypoint: true
  },

  someLibrary: {
    // Keep this object, even if it's empty! It's required for the module to be loaded.
  }
};
