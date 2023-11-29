import '@/styles/globals.css'

import { SessionProvider } from "next-auth/react"
// import { ContextProvider } from '@/contexts/ContextProvider'

export default function App({
  Component, pageProps: { session, ...pageProps }
}) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps}/>
    </SessionProvider>
  )
}