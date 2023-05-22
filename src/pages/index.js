import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

import Router from 'next/router'

import { useUser } from '@auth0/nextjs-auth0';

import myLogo from './../../public/logo_interview.png'

import styles from './login.module.scss'

export default function Home() {

  const { user, error, isLoading } = useUser()

  if(user){
    Router.push('/profile')
  }

  return (
    <>
      <Head>
        <title>Página de Login</title>
      </Head>
      <div className={styles.backgroundLogin}>
        <div className={styles.orangeBlock}>
          <div className={styles.loginBlock}>
            <div className={styles.formLogin}>
              <Image src={myLogo} width="300" height="260"></Image>
              <div className={styles.buttonsLoginForm}>
                <Link href="/api/auth/login">
                  <button className={styles.buttonLogin}>
                    Entrar
                  </button>
                </Link>
                <Link href="/api/auth/login">
                  <button className={styles.buttonCreateAccount}>
                    Criar Conta
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
