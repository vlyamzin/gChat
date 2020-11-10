export class Platform {
  /**
   * @function isOSX
   * @description Check if platform is mac os
   * @public
   * @returns {boolean}
   */
  public static isOSX(): boolean {
    return process.platform === 'darwin';
  }

  /**
   * @function isWin
   * @description Check if platform is windows
   * @public
   * @returns {boolean}
   */
  public static isWin(): boolean {
    return process.platform === 'win32';
  }

  /**
   * @function isLinux
   * @description Check if platform is linux
   * @public
   * @returns {boolean}
   */
  public static isLinux(): boolean {
    return process.platform === 'linux';
  }
}
