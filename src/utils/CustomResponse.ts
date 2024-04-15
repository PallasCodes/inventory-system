export class CustomResponse {
  responseData: object
  message?: ResponseMessage | DefaultMessages
  error?: boolean

  constructor(
    responseData: object,
    message?: ResponseMessage | DefaultMessages,
    error = false,
  ) {
    this.responseData = responseData
    this.error = error
    if (Array.isArray(responseData) && responseData.length === 0) {
      this.message = new ResponseMessage(
        'No se encontraron registros',
        MessageComponent.TOAST,
        MessageType.INFO,
      )
    } else {
      this.message = message || new ResponseMessage()
    }
  }
}

export class ResponseMessage {
  message: string
  component: MessageComponent
  type: MessageType

  constructor(
    message = null,
    component: MessageComponent = MessageComponent.TOAST,
    type: MessageType = MessageType.SUCCESS,
  ) {
    this.message = message
    this.component = component
    this.type = type
  }
}

export enum DefaultMessages {
  EMPTY = 'empty',
}

export enum MessageComponent {
  DIALOG = 'dialog',
  TOAST = 'toast',
}

export enum MessageType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
  QUESTION = 'question',
}
