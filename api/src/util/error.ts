export class PublicError extends Error {
  constructor(...message: unknown[]) {
    super(message.filter(Boolean).join(' '))
  }
}
