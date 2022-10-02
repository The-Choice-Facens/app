import Head from 'next/head'
import Image from 'next/image'

import myLogo from './../../public/logo.png'

import styles from './login.module.scss'

export default function Home() {
  return (
    <div className={styles.backgroundLogin}>
      <div className={styles.orangeBlock}>
        <div className={styles.loginBlock}>
          <div className={styles.formLogin}>
            <Image src={myLogo} width="300" height="260"></Image>
            <input type="text" placeholder='USUARIO'></input>
            <input type="password" placeholder='SENHA'></input>
            <div className={styles.buttonsLoginForm}>
              <button className={styles.buttonCreateAccount}>
                Criar Conta
              </button>
              <button className={styles.buttonLogin}>
                Entrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
