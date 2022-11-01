import styles from './backButton.module.scss'
import Link from 'next/link'

export default function BackButton({url}){
    return(

        <Link href={url}>
            <button className={styles.backButton}>
                Voltar
            </button>
        </Link>
        
    )
}