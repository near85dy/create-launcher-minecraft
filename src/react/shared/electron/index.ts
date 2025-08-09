export namespace Electron {
  export const sendData = async (event: string, data: unknown) => {
    return await window.electronAPI.sendMessage(event, data);
  };

  export const getData = async (event: string) => {
    return await window.electronAPI.sendMessage(event, "");
  };
}
