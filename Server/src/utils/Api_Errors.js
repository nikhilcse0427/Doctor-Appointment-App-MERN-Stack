class ApiError extends Error{
  constructor(statusCode, message="Something went wrong", errors=[]){
    super(message),
    this.statusCode = statusCode,
    this.success = false,
    Error.captureStackTrace(this, this.construcor)
  }
}

export default ApiError