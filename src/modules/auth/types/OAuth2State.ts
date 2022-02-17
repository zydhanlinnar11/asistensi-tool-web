export default interface OAuth2State {
  state: string
  redirectUrl: string
  expiredOn: Date
}
