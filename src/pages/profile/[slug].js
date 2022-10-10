import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

import Curriculum from './../../../public/Curriculum.svg'

import styles from './profile.module.scss'

export default function Profile(){
    return(
        <>
        <Head>
            <title>Página de Perfil</title>
        </Head>
        <div>
            <div className={styles.profilePageContainer}>
                <div className={styles.infoBlock}>

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