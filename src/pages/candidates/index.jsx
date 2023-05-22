import Head from 'next/head'

import styles from "./candidates.module.scss"

import { useEffect, useState } from 'react';

import BackButton from '../components/backButton'

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

    const [interviews, setInterviews] = useState()

    const { user, error, isLoading } = useUser()

    useEffect(() =>{
        getInterviews()
    },[user])

    async function getInterviews(){
        if(user){
            const { data } = await supabase.from("companies").select('*').eq("email", user.email);
            if(data){
                const { data } = await supabase.from("interviews").select('*, candidates(*), tech(*)')
                setInterviews(data)
                console.log(data)
            }
            
        }
    }

    return(
        <>
            <Head>
                <title>Entrevista</title>
            </Head>
            <BackButton url='/profile'></BackButton>
            <div className={styles.candidatesContainer}>
                <div className={styles.candidatesContent}>
                    <h1>Lista de Candidatos</h1>
                    <div className={styles.cardList}>
                        {
                            interviews && interviews.map(interview => {
                                return(
                                    <div key={interview.id} className={styles.cardCandidate}>
                                        <div>
                                            <img src={interview.candidates.image} alt="" />
                                        </div>
                                        <div>
                                            <h2>{interview.candidates.nome}</h2>
                                            <p>Tecnologia: {interview.tech.name}</p>
                                            <p>Cargo atual: {interview.candidates.job}</p>
                                            <p>Resultado: {interview.result}</p>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </>
    )
}