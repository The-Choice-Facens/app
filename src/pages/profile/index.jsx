import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

import Curriculum from './../../../public/Curriculum.svg'

import { useUser } from '@auth0/nextjs-auth0';

import styles from './profile.module.scss'

import { useEffect, useState } from 'react';

import myPerson from './../../../public/person.png'

import { supabase } from '../../../supabase'

export default function Profile(){

    const { user, error, isLoading } = useUser()

    const [userData, setUserData] = useState()

    const [isCompany, setIsCompany] = useState(false)

    useEffect(() =>{
        getInfos()
        verifyCompany()
    },[user])

    async function getInfos(){
        if(user){
            const { data } = await supabase.from("candidates").select('*').eq("email", user.email);
            setUserData(data[0])
        }
    }

    async function verifyCompany(){
        if(user){
            const { data } = await supabase.from("companies").select('*').eq("email", user.email);
            if(data){
                setIsCompany(true)
            }
        }
    }


    return(
        <>
        <Head>
            <title>Página de Perfil</title>
        </Head>
        <div>
            <div className={styles.profilePageContainer}>
                
                <div className={styles.infoBlock}>
                    <div className={styles.profileImageContainer}>
                        <img src={userData?.image} alt="" />
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

                    <Link href={"/edit"}>
                        <button className={styles.editButton}>
                            Editar
                        </button>
                    </Link>
                </div>
                <div className={styles.featureBlock}>
                    <Link href='/interview'>
                        <div className={styles.interviewBlock}>
                            <button>Simulador de entrevistas</button>
                        </div>
                    </Link>
                    {
                    isCompany && <Link href='/candidates'>
                            <div className={styles.candidateBlock}>
                                <button>Lista de Candidatos</button>
                            </div>
                    </Link>
                    }
                </div>
            </div>
        </div>
        </>
    )
}