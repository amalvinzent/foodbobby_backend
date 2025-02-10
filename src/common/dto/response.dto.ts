export class ResponseDto<T> {
  statusCode: number
  message: string
  data?: T

  constructor(statusCode: number, message: string, data?: T) {
    this.statusCode = statusCode
    this.message = message
    this.data = data
  }

  static success<T>(data: T, message: string = 'Success'): ResponseDto<T> {
    return new ResponseDto(200, message, data)
  }
}
