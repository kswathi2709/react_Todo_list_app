import './App.css';
import Header from './Header';
import Content from './Content';
import Footer from './Footer';
import React, { useEffect, useState } from 'react'
import AddItem from './AddItem';
import SearchItem from './SearchItem';
import apiRequest from './apiRequest';

function App() {
  const API_URL=" http://localhost:3500/items"
  const [items, setItems] = useState([])
  const[newItem,setNewItem]= useState('');
  const [search,setSearch]=useState('');
  const [fetchError, setFetchError]=useState(null);
  const [isLoading,setIsLoading]=useState(true)
  
    
  //   [
  //   {
  //     id: 1,
  //     task: "Practice Coding",
  //     checked: true
  //   },
  //   {
  //     id: 2,
  //     task: "Do Course",
  //     checked: false
  //   },
  //   {
  //     id: 3,
  //     task: "See news",
  //     checked: false
  //   }
  // ]
  
  useEffect(()=>{
      const fetchItems=async()=>{
        try{
          const response= await fetch(API_URL) 
          if(!response.ok) throw Error("Data not received")
          console.log(response)
          const listItems= await response.json()
          console.log(listItems)
          setItems(listItems)
          setFetchError(null)
        }catch(err){
           setFetchError(err.message)
        }finally{
          setIsLoading(false)
        }
      }
    setTimeout(()=>{
      (async()=>fetchItems())()
    },1000) 
  },[])


  const addItem=async(task)=>{
     const id=items.length ? items[items.length-1].id+1:1
    const addNewItem={id, task, checked:false }
    const listItems=[...items,addNewItem]
    setItems(listItems)
    
    const postOptions={
      method:"POST",
      headers:{
        'Content-Type':'application/json'
      },
      body: JSON.stringify(addNewItem)
    }
    const result= await apiRequest(API_URL,postOptions)
    if(result) setFetchError(result)
  }


  const handleChecked =async (id) => {
    const newlist = items.map((item) => (
      item.id === id ? { ...item, checked: !item.checked } : item)
    )
    setItems(newlist)
    const myItem=newlist.filter((item)=> item.id===id)
    const updateOptions={
      method:"PATCH",
      headers:{
        'Content-Type':'application/json'
      },
      body: JSON.stringify({checked:myItem[0].checked})
    }
    const reqUrl=`${API_URL}/${id}`
    const result= await apiRequest(reqUrl,updateOptions)
    if(result) setFetchError(result)
   
  }

  const handleDelete =async (id) => {
    const newlist = items.filter((item) => (
      item.id !== id)
    )
    setItems(newlist)
   
     const deleteOptions={
      method:'DELETE'
     }
    const reqUrl=`${API_URL}/${id}`
    const result= await apiRequest(reqUrl,deleteOptions)
    if(result) setFetchError(result)
   

  }

  const handleSubmit=(e)=>{
    e.preventDefault()
    if(!newItem) return;
    console.log(newItem)
    addItem(newItem)
    setNewItem('')


  }

  return (
    <div className="App">
       
   <Header title = "To-do List"/>

   <AddItem newItem={newItem}
            setNewItem={setNewItem}
            handleSubmit={handleSubmit}  />

            <SearchItem
            search={search}
            setSearch={setSearch}
            />
    <main>
      {isLoading && <p> Loading items...</p>}
      {fetchError && <p> {`Error:${fetchError}`}</p>}
   {!isLoading && !fetchError && <Content items={items.filter(item=>((item.task).toLowerCase()).includes(search.toLowerCase()))}
            handleChecked={handleChecked}
            handleDelete={handleDelete}/>
    }
    </main>
   <Footer length={items.length}/>
   

    </div>
 

  );
}

export default App;
