import Image from 'next/image'

import styles from './interview.module.scss'

import Head from 'next/head'

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
    const [questionsToDo, setQuestionsToDo] = useState([])

    const { user, error, isLoading } = useUser()
    

    useEffect(() => {
    
        fetch('https://uleaqepl.directus.app/items/techs')
        .then(result => result.json())
        .then(data => {
            setTechs(data.data)
        })

    },[])

    function handleChange(e){

        console.log(e.target.id)

        if(selectedTechs.includes({'id': e.target.id, 'name': e.target.value})){
            setSelectedTechs(selectedTechs.filter(tech => tech != {'id': e.target.id, 'name': e.target.value}))
        }else{
            setSelectedTechs([...selectedTechs, {'id': e.target.id, 'name': e.target.value}])
        }
    }

    function doInterview(){
        setInterviewTime(true)
        
        fetch('https://uleaqepl.directus.app/items/questions')
        .then(result => result.json())
        .then(data => {
            
            selectedTechs.forEach(selectedTech => {
                data.data.forEach(question => {
                    if(selectedTech.id == question.tech){

                        setQuestionsToDo(questionsToDo => [...questionsToDo,
                            {
                                'id': question.id,
                                'question': question.question,
                                'tech': {
                                    'name': selectedTech.name,
                                    'id': selectedTech.id
                                },
                                'hasOptions': question.wrong_answer_1 ? true : false,
                                'options': {
                                    'right': question.right_answer_4,
                                    'wrong1': question.wrong_answer_1,
                                    'wrong2': question.wrong_answer_2,
                                    'wrong3': question.wrong_answer_3,
                                },
                                'answer': question.answer,
                                'alreadyDone': false
                            }
                        ])

                    }
                })
            })

            setInterviewTime(true)
            setMessages([
                {
                    'interviewer': true,
                    'message': `Olá ${user.name}, bem vindo \r\n a sua entrevista`,
                    'type': 'conversation'
                },
                {
                    'interviewer': true,
                    'message': `A vaga busca pessoas com Skills em: ${selectedTechs.map(tech => tech.name).join(', ')}. Por isso vamos te fazer algumas perguntas técnicas também.`,
                    'type': 'conversation'
                },
                {
                    'interviewer': true,
                    'message': `Mas primeiro, me conta um pouco sobre você.`,
                    'type': 'conversation'
                }
                ])
        })
    }

    function sendMessage(){


        setMessages(messages => [
            ...messages,
            {
                'interviewer': false,
                'message': valueInputed,
                'type': 'candidate'
            }
        ])
        setMessages(messages => [
            ...messages,
            {
                'interviewer': true,
                'message': "...",
                'type': 'waiting'
            }
        ])

        setValueInputed("")

        setTimeout(function(){
            document.querySelector(".messageContainer").scrollTo({
                top: document.querySelector(".messageContainer").scrollHeight,
                left: 0,
                behavior: 'smooth'
            })
        }, 300)

        setTimeout(function(){
            setMessages(messages => {
                let newMessage = messages.slice(0, messages.length - 1)
                return newMessage
            })
            verifyStatusOfConversation()
        }, 2000)
        
    }

    function verifyStatusOfConversation(){
        let interviewerMessages = messages.filter(message => message.interviewer == true)

        let lastMessage = interviewerMessages[interviewerMessages.length - 1]

        if(interviewerMessages.length == 3){

            setMessages(messages => [
                ...messages,
                {
                    'interviewer': true,
                    'message': 'Muito legal! Nesta etapa é muito importante você contar um pouco da sua história, mas sem entrar nos detalhes.',
                    'type': 'conversation'
                },
                {
                    'interviewer': true,
                    'message': 'Também é bem interessante você falar como se interessou por tecnologia!',
                    'type': 'conversation'
                }
            ])

            if(questionsToDo[0].hasOptions){
                setMessages(messages =>[
                    ...messages,
                    {
                        'interviewer': true,
                        'message': `Vamos para a parte Técnica? A primeira pergunta é sobre ${questionsToDo[0].tech.name}. ${questionsToDo[0].question}`,
                        'type': 'question',
                        'questionId': questionsToDo[0].id
                    },
                    {
                        'interviewer': true,
                        'message': `A - ${questionsToDo[0].options.right}`,
                        'type': 'question-option',
                        'questionId': questionsToDo[0].id
                    }
                    ,
                    {
                        'interviewer': true,
                        'message': `B - ${questionsToDo[0].options.wrong1}`,
                        'type': 'question-option',
                        'questionId': questionsToDo[0].id
                    }
                    ,
                    {
                        'interviewer': true,
                        'message': `C - ${questionsToDo[0].options.wrong2}`,
                        'type': 'question-option',
                        'questionId': questionsToDo[0].id
                    }
                    ,
                    {
                        'interviewer': true,
                        'message': `D - ${questionsToDo[0].options.wrong3}`,
                        'type': 'question-option',
                        'questionId': questionsToDo[0].id
                    }
                ])
            }else{
                setMessages(messages =>[
                    ...messages,
                    {
                        'interviewer': true,
                        'message': `Vamos para a parte Técnica? A primeira pergunta é sobre ${questionsToDo[0].tech.name}. ${questionsToDo[0].question}`,
                        'type': 'question',
                        'questionId': questionsToDo[0].id
                    }
                ])
            }

            setAlreadyDone(questionsToDo[0].id)

        }else if(lastMessage.type == 'question' || lastMessage.type == 'question-option'){

            let pastQuestion = questionsToDo.filter(question => question.id == lastMessage.questionId)

            let nextQuestion = questionsToDo.filter(question => question.alreadyDone == false)

            if(nextQuestion.length != 0){
                setAlreadyDone(nextQuestion[0].id)

                if(nextQuestion[0].hasOptions){
                    setMessages(messages =>[
                        ...messages,
                        {
                            'interviewer': true,
                            'message': `${pastQuestion[0].answer ? 
                            "Obrigado! Uma resposta boa também seria essa:" :
                            "A resposta correta é:"}`,
                            'type': 'conversation'
                        },
                        {
                            'interviewer': true,
                            'message': `${pastQuestion[0].answer ? pastQuestion[0].answer : pastQuestion[0].options.right}`,
                            'type': 'answer'
                        },
                        {
                            'interviewer': true,
                            'message': `Próxima pergunta: ${nextQuestion[0].question}`,
                            'type': 'question',
                            'questionId': nextQuestion[0].id
                        },
                        {
                            'interviewer': true,
                            'message': `A - ${nextQuestion[0].options.right}`,
                            'type': 'question-option',
                            'questionId': nextQuestion[0].id
                        }
                        ,
                        {
                            'interviewer': true,
                            'message': `B - ${nextQuestion[0].options.wrong1}`,
                            'type': 'question-option',
                            'questionId': nextQuestion[0].id
                        }
                        ,
                        {
                            'interviewer': true,
                            'message': `C - ${nextQuestion[0].options.wrong2}`,
                            'type': 'question-option',
                            'questionId': nextQuestion[0].id
                        }
                        ,
                        {
                            'interviewer': true,
                            'message': `D - ${nextQuestion[0].options.wrong3}`,
                            'type': 'question-option',
                            'questionId': nextQuestion[0].id
                        }
                    ])
                }else{
                    setMessages(messages => [
                        ...messages,
                        {
                            'interviewer': true,
                            'message': 'Obrigado! Uma resposta boa também seria essa:',
                            'type': 'conversation'
                        },
                        {
                            'interviewer': true,
                            'message': `${pastQuestion[0].answer ? pastQuestion[0].answer : pastQuestion[0].options.right}`,
                            'type': 'answer'
                        },
                        {
                            'interviewer': true,
                            'message': `Próxima pergunta: ${nextQuestion[0].question}`,
                            'type': 'question',
                            'questionId': nextQuestion[0].id
                        }
                    ])
                }

            }else{
                setMessages(messages => [
                    ...messages,
                    {
                        'interviewer': true,
                        'message': 'Obrigado! Uma resposta boa também seria essa:',
                        'type': 'conversation'
                    },
                    {
                        'interviewer': true,
                        'message': `${pastQuestion[0].answer ? pastQuestion[0].answer : pastQuestion[0].options.right}`,
                        'type': 'answer'
                    },
                    {
                        'interviewer': true,
                        'message': `Obrigado por participar da entrevista!`,
                        'type': 'conversation',
                    }
                ])
            }
        }

        setTimeout(function(){
            document.querySelector(".messageContainer").scrollTo({
                top: document.querySelector(".messageContainer").scrollHeight,
                left: 0,
                behavior: 'smooth'
            })
        },500)


    }

    function setAlreadyDone(id){
        setQuestionsToDo(questionsToDo => {
            return questionsToDo.map((question, idx) => {
                if(question.id == id){
                    question.alreadyDone = true
                }
                return question
            })
        })
    }

    if(interviewTime){
        return(
            <>
                <Head>
                    <title>Entrevista</title>
                </Head>
                <div className={styles.interviewDoingContainer}>
                    <BackButton url='/profile'></BackButton>

                    <div className={`${styles.messagesContainer} messageContainer`}>
                        {
                            messages && messages.map((message, idx) => {
                                return(
                                    <p key={idx} 
                                    className={ `message ${message.interviewer ? 'interviewer' : 'candidate'} ${message.type == 'question-option' ? 'option' : ''} ${message.type == 'answer' ? 'answer' : ''}`}>
                                        {message.message}
                                    </p>
                                )
                            })
                        }
                    </div>

                    <div className={styles.inputMessageContainer}>
                        <input value={valueInputed} 
                        onChange={(e) => {setValueInputed(e.target.value)}} 
                        type="text"
                        onKeyUp={(e) => e.key === "Enter" ? sendMessage() : null}
                        ></input>
                        <button onClick={sendMessage}>
                            <Image src={SendButton} width="50" height="50"></Image>
                        </button>
                    </div>

                    
                </div>
            </>
        )
    }else{
        return(
            <>
                <Head>
                    <title>Entrevista</title>
                </Head>
                <div className={styles.interviewContainer}>
                    <BackButton url='/profile'></BackButton>
                        <section className={styles.interviewContent}>
                            <h1>Escolha as tecnologias!</h1>

                            <ul>

                                {
                                    techs && techs.map(tech =>{
                                        return(
                                            <label className={styles.techContent} key={tech.name}>
                                                    <input 
                                                    type='checkbox' 
                                                    id={tech.id} 
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
            </>
        )
    }   
}