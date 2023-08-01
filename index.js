import { Auth, Hub } from './customerPool'

const postAuthentication = () => {}

Hub.listen('auth', postAuthentication)
