const AUTH_KEY = 'progressio_autenticado'

const EMAIL_MOCK = 'usuario@progressio.com'
const SENHA_MOCK = '123456'

export function fazerLogin(
  email: string,
  senha: string,
): boolean {
  if (
    email === EMAIL_MOCK &&
    senha === SENHA_MOCK
  ) {
    localStorage.setItem(
      AUTH_KEY,
      'true',
    )

    return true
  }

  return false
}

export function estaAutenticado(): boolean {
  return (
    localStorage.getItem(
      AUTH_KEY,
    ) === 'true'
  )
}

export function fazerLogout(): void {
  localStorage.removeItem(
    AUTH_KEY,
  )
}