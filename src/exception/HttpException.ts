export class HttpException extends Error {
  public status: number;
  public message: string;

  constructor(staus: number, message: string) {
    super(message);
    this.status = staus;
    this.message = message;
  }
}
