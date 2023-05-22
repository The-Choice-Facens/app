import Head from 'next/head'

import styles from "./candidates.module.scss"

import { useEffect, useState } from 'react';


import { useUser } from '@auth0/nextjs-auth0'; 

import { supabase } from '../../../supabase'

function Card(nome, result){

    return(
        <div>
            Candidato
        </div>
    )

}

export default function Candidates(){

    const [candidates, setCandidates] = useState()

    const { user, error, isLoading } = useUser()

    useEffect(() =>{
        getInterviews()
    },[user])

    async function getInterviews(){
        if(user){
            const { data } = await supabase.from("companies").select('*').eq("email", user.email);
            console.log(data)
            if(data){
                const { data } = await supabase.from("interviews").select('*')
                console.log(data)
            }
            
        }
    }

    return(
        <>
            <Head>
                <title>Entrevista</title>
            </Head>
            <div className={styles.candidatesContainer}>
                <div className={styles.candidatesContent}>
                    <h1>Lista de Candidatos</h1>
                </div>
            </div>
        </>
    )
}