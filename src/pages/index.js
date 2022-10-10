import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

import myLogo from './../../public/logo.png'

import styles from './login.module.scss'

export default function Home() {
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
              <input type="text" placeholder='USUARIO'></input>
              <input type="password" placeholder='SENHA'></input>
              <div className={styles.buttonsLoginForm}>
                <Link href="/registration">
                  <button className={styles.buttonCreateAccount}>
                    Criar Conta
                  </button>
                </Link>
                <Link href="/profile/djasd">
                  <button className={styles.buttonLogin}>
                    Entrar
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
