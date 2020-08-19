import React,{useState,useEffect} from 'react'
import {useHistory } from 'react-router-dom';
import M from 'materialize-css';

const Createpost = ()=>{
    const history = useHistory()
    const [title,setTitle] = useState("")
    const [body,setBody] = useState("")
    const [image,setImage] = useState("")
    const [url,setUrl] = useState("")
    useEffect(()=>{
        if(url){
            fetch("/createpost",{
                method:"post",
                headers:{
                    "Content-Type":"application/json" ,
                    "Authorization":"Bearer "+localStorage.getItem("jwt")
                },
                body:JSON.stringify({
                    title,
                    body,
                    snap : url ,
                }) 
                }).then(res=>res.json())
                .then(data=>{
                    console.log(data)
                    if(data.error)
                    {
                        M.toast({html: data.error, classes:"#e53935 red darken-1"})
                    }
                    else{
                        M.toast({html:"Created Post successfully" , classes:"#43a047 green darken-1"})
                        history.push('/')
                    }
                }).catch(err=>{
                    console.log(err)
                })

        }
    },[url])

    const postDetails = ()=>{
        const data = new FormData()
        data.append("file",image)
        data.append("upload_preset","Instafam")
        data.append("cloud_name","abcd1234huy")
        fetch("https://api.cloudinary.com/v1_1/abcd1234huy/image/upload",{
            method:"post",
            body:data
        })
        .then(res=>res.json())
        .then(data=>{
            setUrl(data.url)
        })
        .catch(err=>{
            console.log(err)
        })
       
      }
    
    return(
        <div className="card input-filled"
        style={{
            margin:"50px auto",
            maxWidth:"500px",
            padding:"20px",
            textAlign:"center"
        }}
        >
            <input type="text" 
            placeholder="title"
            value={title}
            onChange={(e)=>setTitle(e.target.value)}
            />

            <input type="text" 
            placeholder="body"
            value={body}
            onChange={(e)=>setBody(e.target.value)}
            
            />
            <div className="file-field input-field">
            <div className="btn #64b5f6 blue darken-1">
                <span>Upload Image</span>
                <input type="file" onChange={(e)=>setImage(e.target.files[0])} />
            </div>
            <div className="file-path-wrapper">
                <input className="file-path validate" type="text" />

            </div>
            </div>
            <button className="btn waves-effect waves-light #64b5f6 blue darken-1" 
            onClick={()=>postDetails()}
            >
                Submit Post
            </button>
        </div>
    )
}


export default Createpost