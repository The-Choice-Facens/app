import Image from 'next/image'

import styles from './interview.module.scss'

import BackButton from '../components/backButton'
import { useEffect, useState } from 'react'

import SendButton from './../../../public/sendButton.svg'

import { useUser } from '@auth0/nextjs-auth0';

export default function Interview() {

    const [techs, setTechs] = useState([])
    const [selectedTechs, setSelectedTechs] = useState([])
    const [interviewTime, setInterviewTime] = useState(false)
    const [messages, setMessages] = useState([])
    const [valueInputed, setValueInputed] = useState("")

    const { user, error, isLoading } = useUser()
    

    useEffect(() => {
    
        fetch('https://uleaqepl.directus.app/items/techs')
        .then(result => result.json())
        .then(data => {
            setTechs(data.data)
        })

    },[])

    function handleChange(e){

        if(selectedTechs.includes(e.target.value)){
            setSelectedTechs(selectedTechs.filter(tech => tech != e.target.value))
        }else{
            setSelectedTechs([...selectedTechs, e.target.value])
        }
    }

    function doInterview(){
        setInterviewTime(true)
        
        fetch('https://uleaqepl.directus.app/items/questions')
        .then(result => result.json())
        .then(data => {
            setInterviewTime(true)
            setMessages([
                {
                    'interviewer': true,
                    'message': `Olá ${user.name}, bem vindo a sua entrevista`
                },
                {
                    'interviewer': true,
                    'message': `A vaga busca pessoas com Skills em: ${selectedTechs.join(', ')}, por isso vamos te fazer algumas perguntas técnicas.`
                }
                ])
        })
    }

    function sendMessage(){
        setMessages([
            ...messages,
            {
                'interviewer': false,
                'message': valueInputed
            }
        ])
        setValueInputed("")
    }

    if(interviewTime){
        return(
            <div className={styles.interviewDoingContainer}>
                <BackButton url='/profile'></BackButton>

                <div className={styles.messagesContainer}>
                    {
                        messages && messages.map((message, idx) => {
                            return(
                                <p key={idx} 
                                className={ `message ${message.interviewer ? 'interviewer' : 'candidate'}`}>
                                    {message.message}
                                </p>
                            )
                        })
                    }
                </div>

                <div className={styles.inputMessageContainer}>
                    <input value={valueInputed} onChange={(e) => {setValueInputed(e.target.value)}} type="text"></input>
                    <button onClick={sendMessage}>
                        <Image src={SendButton} width="50" height="50"></Image>
                    </button>
                </div>

                
            </div>
        )
    }else{
        return(
            <div className={styles.interviewContainer}>
                <BackButton url='/profile'></BackButton>
                    <section className={styles.interviewContent}>
                        <h1>Escolha as tecnologias!</h1>

                        <ul>

                            {
                                techs && techs.map(tech =>{
                                    return(
                                        <label className={styles.techContent} key={tech}>
                                                <input 
                                                type='checkbox' 
                                                id={tech.name} 
                                                value={tech.name} 
                                                onChange={(e) => handleChange(e)}></input>
                                                <span className={styles.checkmark}></span>
                                                <li>{tech.name}</li>
                                        </label>
                                    )
                                })
                            }

                        </ul>

                        <button className={styles.goInterviewButton} onClick={doInterview}>
                            Fazer entrevista
                        </button>

                    </section>
            </div>
        )
    }   
}