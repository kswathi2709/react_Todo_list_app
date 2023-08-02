
import { FaTrash } from 'react-icons/fa'

const Content = ({items, handleChecked,handleDelete}) => {

  return (

   <>
      {(items.length)?(
        <ul>
          {items.map((item) => (
            <li className='item' key={item.id}>
              <input type="checkbox" onChange={() => handleChecked(item.id)}
                checked={item.checked} />
              <label  style={(item.checked)? {textDecoration:"line-through"}:null}onDoubleClick={()=> handleChecked(item.id)}>{item.task}</label>
              <FaTrash role='button' tabIndex={0} onClick={() => {handleDelete(item.id) }} />
            </li>
          ))}
        </ul>):
        (<p> Your List is Empty!</p>)}
    </>

  )
}

export default Content