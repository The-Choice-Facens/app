import Head from 'next/head'
import Image from 'next/image'

import styles from './edit.module.scss'

import myPerson from './../../../public/person.png'

import { useUser } from '@auth0/nextjs-auth0'; 

import BackButton from '../components/backButton'
import { useEffect, useState } from 'react';

import { supabase } from '../../../supabase'


export default function Edit(){

    const [userData, setUserData] = useState()

    const { user, error, isLoading } = useUser()

    const [refresh, setRefresh] = useState(true)

    useEffect(() =>{
        getInfos()
    },[user, refresh])

    async function getInfos(){
        if(user){
            const { data } = await supabase.from("candidates").select('*').eq("email", user.email);
            console.log(data[0])
            setUserData(data[0])
        }
    }

    async function saveEdit(){
        
        let dataInfo = {
            'nome': document.querySelector("#name").value == "" ? userData.name : document.querySelector("#name").value,
            'job': document.querySelector("#job").value == "" ? userData.job : document.querySelector("#job").value,
            'descricao': document.querySelector("#description").value == "" ? userData.description : document.querySelector("#description").value,
            'linkedin': document.querySelector("#linkedin").value == "" ? userData.linkedin : document.querySelector("#linkedin").value,
            'celular': document.querySelector("#cellphone").value == "" ? userData.cellphone : document.querySelector("#cellphone").value,
        }
        
        const { data, error } = await supabase
        .from('candidates')
        .update(dataInfo)
        .eq('email', user.email)

        setRefresh({...refresh})
        clearInputs()
        
    }

    function clearInputs(){
        let allInputs = document.querySelectorAll("input")

        allInputs.forEach((e) => {
            console.log(e)
            e.value = ""
        })
    }

    return(
        <>
        <Head>
            <title>Editar Perfil</title>
        </Head>

        <BackButton url='/profile'></BackButton>

        <div className={styles.editPageContainer}>

            <div className={styles.editInfoBlock}>

                <div className={styles.imageContainer}>
                    <img src={userData?.image} alt="" />
                </div>

                <div className={styles.infoContainer}>
                    <div>
                        <h3>Nome</h3>
                        <h2>{userData?.nome ? userData?.nome : user?.nome}</h2>
                        <input type="text" id='name' placeholder='Digite aqui'/>
                    </div>
                    <div>
                        <h3>Descrição</h3>
                        <h2>{userData?.descricao ? userData?.descricao : <span>Não definido</span>}</h2>
                        <input type="text" id="description"  placeholder='Digite aqui'/>
                    </div>
                    <div>
                        <h3>Celular</h3>
                        <h2>{userData?.celular ? userData?.celular : <span>Não definido</span>}</h2>
                        <input type="tel" id="cellphone"  placeholder='Digite aqui'/>
                    </div>
                    <div>
                        <h3>Job</h3>
                        <h2>{userData?.job ? userData?.job : <span>Não definido</span>}</h2>
                        <input type="text" id="job"  placeholder='Digite aqui'/>
                    </div>
                    <div>
                        <h3>LinkedIn</h3>
                        <a href={userData?.linkedin}><h2>{userData?.linkedin ? "Link" : <span>Não definido</span>}</h2></a>
                        <input type="text" id='linkedin'  placeholder='Digite aqui'/>
                    </div>
                </div>
                <button className={styles.editButton} onClick={saveEdit}>
                    Salvar
                </button>
            </div>

        </div>
        </>
    )
}

