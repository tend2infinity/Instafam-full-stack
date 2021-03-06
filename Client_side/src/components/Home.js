import React,{useState,useEffect,useContext} from 'react'
import {UserContext} from '../App'
import {Link} from 'react-router-dom'
import M from 'materialize-css';

const Home = ()=>{
    const [data,setData] = useState([])
    const {state,dispatch} = useContext(UserContext)
    useEffect(()=>{
        fetch('/allpost' , {
            headers:{
                "Authorization":"Bearer " + localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result => {
            console.log(result)
            setData(result.posts)
        })
    },[])

    const likePost = (id)=>{
        fetch('/like',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })
        }).then(res=>res.json())
        .then(result=>{
            console.log(result)
            const newData = data.map(item=>{
                if(item._id==result._id){
                    return result
                }else{
                    return item
                }
            })
            setData(newData)
        }).catch(err=>{
            console.log(err)
        })
    }
    const dislikePost = (id)=>{
        fetch('/dislike',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })
        }).then(res=>res.json())
        .then(result=>{
            console.log(result)
            const newData = data.map(item=>{
                if(item._id==result._id){
                    return result
                }else{
                    return item
                }
            })
            setData(newData)
        }).catch(err=>{
            console.log(err)
        })
    }

    const aComment = (text,postId) =>{
        fetch('/comment',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
               postId,
               text
            })
        }).then(res=>res.json())
        .then(result=>{
            console.log(result)
            const newData = data.map(item=>{
                if(item._id==result._id){
                    return result
                }else{
                    return item
                }
            })
            setData(newData)
        }).catch(err=>{
            console.log(err)
        })
    }

    const deletePost = (postid)=>{
        fetch(`/deletepost/${postid}`,{
            method:"delete",
            headers:{
                Authorization:"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            console.log(result)
            const newData = data.filter(item=>{
                return item._id !== result._id
            })
            setData(newData)
            M.toast({html: 'Post deleted', classes:"#e53935 red darken-1"})
        })
    }
    const deleteComment = (...props) => {
       fetch(`deletecomment/${props[1]}/${props[0]}`,{
        method:"delete",
        headers:{
            Authorization:"Bearer "+localStorage.getItem("jwt")
        }
       }).then(res => res.json())
       .then(result => {
           const newData = data.map(item => {
               if (item._id == result._id){
                return result
               }
               else{
                return item
               }  
           })
           setData(newData)
           M.toast({html: 'Comment deleted', classes:"#e53935 red darken-1"})
       }).catch(err=>{
        console.log(err)
    })
    }

    return (
        <div className="home">
    {
        data.map(item=>{
            return(
                <div className="card home-card"  key={item._id}>
                <h5 style ={{padding:"10px"}}> <Link to ={item.postedBy._id !== state._id ? "/profile/"+item.postedBy._id : "/profile"}> {item.postedBy.name} </Link> {item.postedBy._id == state._id
                && <i className="material-icons" 
                style={{
                    float:"right"
                }}
                onClick = {()=>deletePost(item._id)}
                >delete</i>
                 } </h5>

                <div className="card-image" >
                    <img src={item.photo}/>
                </div>
                <div className="card-content">
                    
                    {item.likes.includes(state._id)
                    ?<div>
                    <i className="material-icons" style={{color:"red"}}
                    onClick={()=>{dislikePost(item._id)}} 
                    >favorite</i>
                    
                     </div>
                     :
                     <div>
                     <i className="material-icons" 
                     onClick={()=>{likePost(item._id)}}
                     >favorite_border</i>
                     </div>

                    }
                    <h6> {item.likes.length} likes  </h6>
                    <h6> {item.title} </h6>
                    <p> {item.body} </p>
                    {
                        item.comments.map(record=>{
                             return(
                                 <div>
                                    <h6 key={record._id}><span style={{fontWeight:"500"}}>{record.postedBy.name}</span> {record.text} 
                                    
                                    {record.postedBy._id == state._id
                                    && <i className="material-icons" 
                                    style={{
                                        float:"right"
                                    }}
                                    onClick = {()=>deleteComment(record._id, item._id)}
                                    >delete</i>
                                    } 
                                    </h6> 
                                 </div>    
                                
                             )
                        })
                    } 
                    <form onSubmit={(e)=>{
                        e.preventDefault()
                        aComment(e.target[0].value,item._id)
                    }}>
                    <input type="text" placeholder="add a comment" />

                    </form>
                   
                </div>
            </div>
            )
        })
    }      
    </div>
    )}

export default Home