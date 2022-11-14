

export default function handler(req, res) {

  const requestMethod = req.method

  const email = req.query.email;

  if(requestMethod == 'POST'){

    const body = req.body;

    const email = req.body.id
    console.log(email)

    let options = {
        'method': 'PATCH',
        'body': JSON.stringify(req.body),
        'headers': {
            'Content-Type': 'application/json'
        },
    }

    fetch("https://uleaqepl.directus.app/items/usuarios/" + email + "?access_token=" + process.env.DIRECTUS_TOKEN, options)
    .then(result => result.json())
    .then(data => {
      res.status(200).json(data)
    })
    

  }else{

    fetch("https://uleaqepl.directus.app/items/usuarios/" + email + "?access_token=" + process.env.DIRECTUS_TOKEN)
    .then(response => response.json())
    .then(data =>{
      if(data.errors){
        res.status(200).json({ name: "erro" })

        let data = {
          'id': email
        }

        let options = {
            'method': 'POST',
            'body': JSON.stringify(data),
            'headers': {
                'Content-Type': 'application/json'
            },
        }

        fetch("https://uleaqepl.directus.app/items/usuarios?access_token=" + process.env.DIRECTUS_TOKEN, options)
        .then(result => result.json())
        .then(data => console.log(data))

      }else{
        res.status(200).json(data)
      }
    })


  }
  
    
}