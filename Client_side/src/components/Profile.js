import React,{useEffect,useState,useContext} from 'react'
import {UserContext} from '../App'


const Profile = ()=>{
    const [myposts,setPost] = useState([])
    const {state,dispatch} = useContext(UserContext)
    const [image,setImage] = useState("")
    useEffect(()=>{
        fetch('/mypost',{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            setPost(result.mypost)
        })
    },[])

    useEffect(()=>{
        if(image)
        {
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
                console.log(data)
                fetch('/updateprofilepic',{
                    method:"put",
                    headers:{
                        "Content-Type":"application/json",
                        "Authorization":"Bearer "+localStorage.getItem("jwt")
                    },
                    body:JSON.stringify({
                        pic:data.url
                    })
                }).then(res=>res.json())
                .then(result=>{
                    console.log(result)
                    localStorage.setItem("user",JSON.stringify({...state,pic:result.pic}))
                    dispatch({type:"UPDATEPIC",payload:result.pic})
                     window.location.reload()
                })
                
               
            })
            .catch(err=>{
                console.log(err)
            })
        }
    },[image])
    const UpdateProfile = (image) =>{
        setImage(image)
       
    }
return (
    
    <div style={{maxWidth:"550px", margin:"0px auto"}}>
        <div style={{
             margin:"18px 0px",
             borderBottom:"1px solid grey"
        }}>

        
        <div style={{
            display:"flex",
            justifyContent:"space-around",
           
        }}>
            <div>
                <img style={{width:"160px",height:"160px",borderRadius:"80px"}}
                src={state?state.pic:"loading..."} 
                /> 
                 
            </div>
            <div>
                <h4>{state?state.name:"loading"}</h4>
                <h5>{state?state.email:"loading"}</h5>
                <div style={{display:"flex",justifyContent:"space-between",width:"108%"}}>
                    <h6> {myposts.length} posts </h6>
                    <h6> {state?state.followers.length:"loading..."} followers</h6>
                    <h6> {state?state.following.length:"loading..."} following</h6>
                </div>
                 
            </div>
        </div>
        
        
            <div className="file-field input-field" style={{margin:"10px"}}>
            <div className="btn #64b5f6 blue darken-1">
                <span>Update Profile Picture</span>
                <input type="file" onChange={(e)=>UpdateProfile(e.target.files[0])} />
            </div>
            <div className="file-path-wrapper">
                <input className="file-path validate" type="text" />

            </div>
            </div>
            </div>
        <div className="gallery">
            {
                myposts.map(item=>{
                    return(
                        <img key={item._id} className="item" src={item.photo} alt={item.title}/>
                    )
                })
            }
           
        </div>
            </div>
    
    )

}

export default Profile