export const useGoogleSigninUrl = (
  redirectUrl = document.location.origin + document.location.pathname
) =>
  `https://accounts.google.com/o/oauth2/v2/auth?scope=openid&response_type=code&client_id=${
    process.env.GOOGLE_CLIENT_ID
  }&redirect_uri=${encodeURIComponent(redirectUrl)}`
