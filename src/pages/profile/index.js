import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

import Curriculum from './../../../public/Curriculum.svg'

import { useUser } from '@auth0/nextjs-auth0';

import styles from './profile.module.scss'

export default function Profile(){

    const { user, error, isLoading } = useUser()

    console.log(user)

    return(
        <>
        <Head>
            <title>Página de Perfil</title>
        </Head>
        <div>
            <div className={styles.profilePageContainer}>
                
                <div className={styles.infoBlock}>
                    <div className={styles.profileImageContainer}>

                    </div>
                    <div className={styles.devInfo}>
                        <h1>{ user?.name }</h1>
                        <h2>{ user?.email }</h2>
                    </div>
                    
                    <Link href='/api/auth/logout'>
                        <button className={styles.logoutButton}>
                            Sair
                        </button>
                    </Link>

                    <Link href='/edit'>
                        <button className={styles.editButton}>
                            Editar
                        </button>
                    </Link>
                </div>
                <div className={styles.featureBlock}>
                    <Link href='/curriculum'>
                        <div className={styles.curriculumBlock}>
                            <Image src={Curriculum}></Image>
                            <button>Gerador de Currículo</button>
                        </div>
                    </Link>
                    <Link href='/interview'>
                        <div className={styles.interviewBlock}>
                            <Image src={Curriculum}></Image>
                            <button>Simulador de entrevistas</button>
                        </div>
                    </Link>
                </div>
                
            </div>
        </div>
        </>
    )
}