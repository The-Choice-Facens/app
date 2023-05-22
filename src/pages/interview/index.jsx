import Image from 'next/image'

import styles from './interview.module.scss'

import Head from 'next/head'

import BackButton from '../components/backButton'
import { useEffect, useState } from 'react'

import SendButton from './../../../public/sendButton.svg'

import { useUser } from '@auth0/nextjs-auth0';

import { supabase } from '../../../supabase'

export default function Interview() {

    const [techs, setTechs] = useState([])
    const [selectedTech, setSelectedTech] = useState("")
    const [interviewTime, setInterviewTime] = useState(false)
    const [messages, setMessages] = useState([])
    const [valueInputed, setValueInputed] = useState("")
    const [questionsToDo, setQuestionsToDo] = useState([])
    const [result, setResult] = useState(0)
    const [candidate, setCandidate] = useState()

    const { user, error, isLoading } = useUser()
    
    useEffect(() => {
        getTechs();
    }, []);

    useEffect(() => {
        getCandidate();
    }, [user])

    async function getCandidate(){
        if(user){
            const { data } = await supabase.from("candidates").select("*").eq("email", user.email)
            setCandidate(data[0])
        }
    }
  
    async function getTechs() {
        const { data } = await supabase.from("techs").select('*');
        setTechs(data);
    }

    async function doInterview(){
        setInterviewTime(true)
        const tech = techs.filter(tech => tech.name == selectedTech)
        const { data } = await supabase.from("questions").select('*').eq('tech', tech[0].id);

        data.forEach(question => {

            setQuestionsToDo(questionsToDo => [...questionsToDo,
                {
                    'id': question.id,
                    'question': question.question,
                    'tech': {
                        'name': selectedTech,
                        'id': question.id
                    },
                    'options': {
                        'right': question.right,
                        'wrong1': question.wrong1,
                        'wrong2': question.wrong2,
                        'wrong3': question.wrong3,
                    },
                    'alreadyDone': false
                }
            ])

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
                'message': `A vaga busca pessoas com Skills em: ${selectedTech}. Por isso vamos te fazer algumas perguntas técnicas também.`,
                'type': 'conversation'
            },
            {
                'interviewer': true,
                'message': `Mas primeiro, me conta um pouco sobre você.`,
                'type': 'conversation'
            }
        ])

    }

    function sendMessage(input){
        

        setMessages(messages => [
            ...messages,
            {
                'interviewer': false,
                'message': input ? input : valueInputed,
                'type': 'candidate'
            },{
                'interviewer': true,
                'message': "...",
                'type': 'waiting'
            }
        ])

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
            verifyStatusOfConversation(input ? input : valueInputed)
            setValueInputed("")
        }, 2000)
        
    }

    async function verifyStatusOfConversation(inputedMessage){
        let interviewerMessages = messages.filter(message => message.interviewer == true)

        let lastMessage = interviewerMessages[interviewerMessages.length - 1]
        let lastCandidateMessage = inputedMessage

        const questionMessages = jsonOfAQuestion(questionsToDo[0])

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
                },
                ...questionMessages
            ])
            setAlreadyDone(questionsToDo[0].id)
        }

        if(lastMessage.type == 'question' || lastMessage.type == 'question-option'){

            let pastQuestion = questionsToDo.filter(question => question.id == lastMessage.questionId)

            let nextQuestion = questionsToDo.filter(question => question.alreadyDone == false)

            console.log(pastQuestion[0].options.right)
            console.log(lastCandidateMessage)
            let correct = lastCandidateMessage.includes(pastQuestion[0].options.right)

            if(correct){
                setResult((r) => r + 1)
            }

            if(nextQuestion.length == 0){
                setMessages(messages => [
                    ...messages,
                    {
                        'interviewer': true,
                        'message': `${correct ? "Parabéns, a resposta correta é:" : "A resposta correta é:"}`,
                        'type': 'conversation'
                    },
                    {
                        'interviewer': true,
                        'message': `${pastQuestion[0].options.right}`,
                        'type': 'answer'
                    },
                    {
                        'interviewer': true,
                        'message': `Obrigado por participar da entrevista!`,
                        'type': 'conversation',
                    },
                    {
                        'interviewer': true,
                        'message': `Sua nota foi: ${correct ? result + 1 : result}/10`,
                        'type': 'conversation',
                    }
                ])

                const tech = techs.filter(tech => tech.name == selectedTech)
                const { data, error } = await supabase
                .from('interviews')
                .insert([
                { 
                    'candidate': candidate.id, 
                    'result': correct ? result + 1 : result,
                    'tech': tech[0].id },
                ])


            }else{

                setAlreadyDone(nextQuestion[0].id)

                const questionMessages = jsonOfAQuestion(nextQuestion[0])

                setMessages(messages =>[
                    ...messages,
                    {
                        'interviewer': true,
                        'message': `${correct ? "Parabéns, a resposta correta é:" : "A resposta correta é:"}`,
                        'type': 'conversation'
                    },
                    {
                        'interviewer': true,
                        'message': `${pastQuestion[0].options.right}`,
                        'type': 'answer'
                    },
                    ...questionMessages
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

    function jsonOfAQuestion(question){
        const answers = shuffleArray([question.options.right, question.options.wrong1, question.options.wrong2, question.options.wrong3])
        const letters = ["A", "B", "C", "D"]

        const questions = answers.map((answer, idx) => {
            return {
                'interviewer': true,
                'message': `${letters[idx]} - ${answer}`,
                'type': 'question-option',
                'questionId': question.id
            }
        })

        return [
            {
                'interviewer': true,
                'message': `Pergunta: ${question.question}`,
                'type': 'question',
                'questionId': question.id
            },
            ...questions
        ]
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

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
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
                                    className={ `message ${message.interviewer ? 'interviewer' : 'candidate'} ${message.type == 'question-option' ? 'option' : ''} ${message.type == 'answer' ? 'answer' : ''}`}
                                    onClick={() => {
                                        if(message.type == 'question-option'){

                                            sendMessage(message.message);

                                        }
                                    }}
                                    >
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
                        onKeyUp={(e) => e.key === "Enter" ? sendMessage(null) : null}
                        id="input-user"
                        ></input>
                        <button onClick={() => sendMessage(null)}>
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
                                                    type='radio' 
                                                    id={tech.id} 
                                                    value={tech.name} 
                                                    name="techs"
                                                    onChange={(e) => setSelectedTech(e.target.value)}></input>
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