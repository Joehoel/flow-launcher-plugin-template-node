import { accessSync } from "fs";
import { join } from "path";
import { cwd } from "process";
import { Logger } from "winston";
import { PLUGIN_MANIFEST } from "./constants";
import logger from "./logger";

type JSONRPCMethods =
  | "Flow.Launcher.ChangeQuery"
  | "Flow.Launcher.RestartApp"
  | "Flow.Launcher.SaveAppAllSettings"
  | "Flow.Launcher.CheckForNewUpdate"
  | "Flow.Launcher.ShellRun"
  | "Flow.Launcher.CloseApp"
  | "Flow.Launcher.HideApp"
  | "Flow.Launcher.ShowApp"
  | "Flow.Launcher.ShowMsg"
  | "Flow.Launcher.GetTranslation"
  | "Flow.Launcher.OpenSettingDialog"
  | "Flow.Launcher.GetAllPlugins"
  | "Flow.Launcher.StartLoadingBar"
  | "Flow.Launcher.StopLoadingBar"
  | "Flow.Launcher.ReloadAllPluginData"
  | "Flow.Launcher.CopyToClipboard"
  | "query";

type Methods<T> = JSONRPCMethods | T;

type MethodsObj<T> = {
  [key in Methods<T> extends string
    ? Methods<T>
    : // eslint-disable-next-line @typescript-eslint/ban-types
      JSONRPCMethods | (string & {})]: () => void;
};

type ParametersAllowedTypes =
  | string
  | number
  | boolean
  | Record<string, unknown>
  | ParametersAllowedTypes[];

type Method<T> = keyof MethodsObj<T>;
type Parameters = ParametersAllowedTypes[];

interface Data<TMethods, TSettings> {
  method: Method<TMethods>;
  parameters: Parameters;
  settings: TSettings;
}

export interface JSONRPCResponse<TMethods> {
  title: string;
  subtitle?: string;
  method?: Method<TMethods>;
  params?: Parameters;
  dontHideAfterAction?: boolean;
  iconPath?: string;
  score?: number;
}

interface IFlow<TMethods, TSettings> {
  settings: TSettings;
  on: (method: Method<TMethods>, callbackFn: () => void) => void;
  showResult: (...result: JSONRPCResponse<TMethods>[]) => void;
  run: () => void;
}
export class Flow<TMethods, TSettings = Record<string, string>>
  implements IFlow<TMethods, TSettings>
{
  private methods = {} as MethodsObj<TMethods>;
  private defaultIconPath: string | undefined;
  private readonly data: Data<TMethods, TSettings> = JSON.parse(process.argv[2]);
  public logger: Logger;

  /**
   * Creates an instance of Flow.
   *
   * @constructor
   * @param {?string} [defaultIconPath] Sets the default icon path to be displayed in all results.
   */
  constructor(defaultIconPath?: string) {
    this.defaultIconPath = defaultIconPath;
    this.showResult = this.showResult.bind(this);
    this.run = this.run.bind(this);
    this.on = this.on.bind(this);

    this.logger = logger;

    this.logger.info({ hello: "world" });
  }

  /**
   * @readonly
   * @type {TSettings}
   */
  get settings() {
    return this.data.settings;
  }

  /**
   * Registers a method and the function that will run when this method is sent from Flow.
   *
   * @public
   * @param {keyof MethodsObj<TMethods>} method
   * @param {() => void} callbackFn
   */
  public on(method: keyof MethodsObj<TMethods>, callbackFn: (params: Parameters) => void) {
    this.methods[method] = callbackFn.bind(this, this.data.parameters);
  }

  /**
   * Sends the data to be displayed in Flow Launcher.
   *
   * @public
   * @param {...JSONRPCResponse<TMethods>[]} resultsArray Array with all the results objects.
   */
  public showResult(...resultsArray: JSONRPCResponse<TMethods>[]) {
    const result = resultsArray.map(r => {
      return {
        Title: r.title,
        Subtitle: r.subtitle,
        JsonRPCAction: {
          method: r.method,
          parameters: r.params || [],
          dontHideAfterAction: r.dontHideAfterAction || false,
        },
        IcoPath: r.iconPath || this.defaultIconPath,
        score: r.score || 0,
      };
    });

    return console.log(JSON.stringify({ result }));
  }

  /**
   * Runs the function for the current method. Should be called at the end of your script, or after all the `on()` functions have been called.
   *
   * @public
   */
  public run() {
    this.data.method in this.methods && this.methods[this.data.method]();
  }
}
