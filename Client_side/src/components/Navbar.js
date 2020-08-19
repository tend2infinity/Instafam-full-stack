import React, { useContext,useRef,useEffect,useState } from 'react';
import {Link, useHistory } from 'react-router-dom';
import { UserContext } from '../App';
import M from 'materialize-css'


const Navbar = () => {
  const searchModal = useRef(null)
  const {state,dispatch} = useContext(UserContext)
  const [userData,setuserData]=useState([])
  const [search,setSearch] = useState('')
  const history = useHistory()
  useEffect(()=>{
    M.Modal.init(searchModal.current)
  },[])
  const renderList = () =>{
    if(state){
      return [
        <li key="1"><i data-target="modal1" className="large material-icons modal-trigger" style={{color:"black"}}>search</i></li>,
        <li key="2"><Link className="navbaroptions" to="/profile">Profile</Link></li>,
        <li key="3"><Link className="navbaroptions" to="/create">Create Post</Link></li>,
        <li key="4"><Link className="navbaroptions" to="/allfollowpost">My following posts</Link></li>,
        <li key="5"><button 
        className="btn #e53935 red darken-1"
        onClick={()=>{
          localStorage.clear()
          dispatch({type:"CLEAR"})
          history.push('/signin')
          window.location.reload()
        }}
        >  Logout
        </button></li>
      ]
    }else{
      return[
        <li key="6"><Link className="navbaroptions" to="/signin">Signin</Link></li>,
      <li key="7"><Link className="navbaroptions" to="/signup">Signup</Link></li>
      ]
      
    }
  }

  const fetchUsers = (query) =>{
    setSearch(query)
    fetch('/search-users',{
      method:"post",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        query
      })
    }).then(res=>res.json())
    .then(results=>{
      setuserData(results.user)
    })
  }
    return (     
  <nav>
  <div className="nav-wrapper white" >
    <Link style={{
      padding:"0px 0px 0px 20px"
  }} to={state?"/":"/signin"} className="brand-logo left">Instafam</Link>
    <ul id="nav-mobile" className="right">
      {renderList()}
    </ul>
  </div>
  <div id="modal1" class="modal" ref={searchModal}  style={{color:"black"}}>
    <div className="modal-content" >
    <input
        type='text'
        placeholder='Search Users'
        value={search}
        onChange={(e)=>fetchUsers(e.target.value)}
        />
         <ul className="collection">
           {userData.map(item=>{
             return  <Link to={item._id !== state._id ? "/profile/"+ item._id : '/profile'} 
             onClick={()=>{ M.Modal.getInstance(searchModal.current).close()
              setSearch('')
            }}> <li className="collection-item">{item.email}</li>
              </Link>
           })}
      </ul>
    
    </div>
    <div className="modal-footer">
      <button className="modal-close waves-effect waves-green btn-flat" onClick={()=>setSearch('')}>Close</button>
    </div>
  </div>
          
</nav>
    )

}

export default Navbar