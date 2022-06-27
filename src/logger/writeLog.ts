import dayjs from "dayjs";
import * as fs from "fs";
import path from "path";
import log from ".";

class WriteLog {
  private logFileStatus = process.env.LOG_FILE_STATUS;

  info(msg: string, obj: any = null) {
    log.info(obj, msg);
    this.logWriteToFile(msg, obj);
  }

  warn(msg: string, obj: any = null) {
    log.warn(obj, msg);
    this.logWriteToFile(msg, (obj = null));
  }

  error(msg: string, obj: any = null) {
    log.error(obj, msg);
    this.logWriteToFile(msg, obj);
  }

  private async logWriteToFile(msg: string, obj: any = null) {
    if (this.logFileStatus) {
      const msgData = `${msg}, >> OBJ >> ${JSON.stringify(obj, null, 2)}`;
      const fileName = `${dayjs().format("YYYY-MM-DDTHH-mm")}.txt`;
      const location = `./logs`;
      if (!fs.existsSync(location)) {
        fs.mkdirSync(location);
      }

      const filePath = path.join(location, fileName);
      fs.writeFile(filePath, msgData, { flag: "a+" }, (error) => {
        console.log(error);
      });
    }
  }
}

export const apiWriteLog = new WriteLog();
