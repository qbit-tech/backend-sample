export interface FileDownloader {
  getLink(params: { 
    metadata: object; 
    filePath: string; 
    expired: number;
  }): Promise<any>;
  
  getFile(params: { 
    metadata: object; 
    filePath: string; 
  }): Promise<any>;
  delFile(params: { 
    metadata: object; 
    filePath: string; 
  }): Promise<any>;
  isFileExist(params: { 
    metadata: object; 
    filePath: string; 
  }): Promise<boolean>;
}