import styles from './../login.module.scss'
import styles2 from './registration.module.scss'

import Head from 'next/head'
import Link from 'next/link'

import myLogo from './../../../public/logo.png'

import Image from 'next/image'

export default function Registration(){

    return(
        <>
            <Head>
                <title>Página de Cadastro</title>
            </Head>
            <div className={styles.backgroundLogin}>
                <div className={styles.orangeBlock}>
                    <div className={styles.loginBlock}>
                        <div className={styles.formLogin}>
                            <Image src={myLogo} width="100" height="80"></Image>
                            <input type="text" placeholder='NOME COMPLETO'></input>
                            <input type="email" placeholder='E-MAIL'></input>
                            <input type="email" placeholder='CONFIRMAR E-MAIL'></input>
                            <div className={styles2.passwordRegistration}>
                                <input type="password" placeholder='SENHA'></input>
                                <input type="password" placeholder='CONFIRMAR SENHA'></input>
                            </div>
                            <div className={styles.buttonsLoginForm}>
                                <Link href="/">
                                <button className={styles.buttonCreateAccount}>
                                    Voltar
                                </button>
                                </Link>
                                <button className={styles.buttonLogin}>
                                    Cadastrar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}