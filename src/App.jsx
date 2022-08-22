import React, { useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, TextField } from '@mui/material';
import { useCollection } from 'react-firebase-hooks/firestore';
import { addDoc, collection, deleteDoc, doc } from 'firebase/firestore';
import { db } from './firebase';

const collectionName = 'users'
const usersCollection = collection(db, collectionName)


const App = () => {  
  const [usersData, loading, error] = useCollection(usersCollection)
  const [users, setUsers] = useState([])
  const [name, setName] = useState('')
  const [surname, setSurname] = useState('')



  const columns = [
    { field: 'id', headerName: 'ID', width: 200 },
    { field: 'name', headerName: 'First name', width: 130 },
    { field: 'surname', headerName: 'Last name', width: 130 },
    { field: 'delete', headerName: 'Delete', renderCell: el => <DeleteButton id={el.id} />},
  ]



  const handleAddUser = async e => {
    e.preventDefault()

    const newUser = {
      name: name,
      surname: surname
    }

    await addDoc(usersCollection, newUser)

    setName('')
    setSurname('')
  }



  const handleUpdate = async id => {

    const updatedUser = {
      name: 'xxx',
      surname: 'xxx'
    }

    const docRef = doc(db, collectionName, id)
    await updateDoc(docRef, updatedUser);
  }



  useEffect(() => {
    if (usersData === undefined) return

    const newUsers = usersData.docs.map(doc => {
      const data = doc.data()
      const userId = doc.id
      return {
        'id': userId,
        'name': data.name,
        'surname': data.surname
      }
    })

    setUsers(newUsers)
  }, [usersData])



  return (
    <>
      {error && <strong>Error: {JSON.stringify(error)}</strong>}
      {loading && <span>Collection: Loading...</span>}
      <form onSubmit={handleAddUser}>
        <Box sx={{display: 'flex', alignItems: 'stretch', gap: '20px', flexWrap: 'wrap'}}>
          <TextField 
            id="name"
            label="First name"
            variant="outlined"
            value={name}
            onChange={e => setName(e.target.value)} />
          <TextField
            id="surname"
            label="Last Name"
            variant="outlined"
            value={surname}
            onChange={e => setSurname(e.target.value)} />
          <Button variant="outlined" type='submit' size='large'>Add</Button>
        </Box>
      </form>

      <Box sx={{height: 372}} mt={2}>
        <DataGrid
          rows={users}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick={true}
        />
      </Box>
    </>
  )
}



const DeleteButton = ({id}) => {

  const docRef = doc(db, collectionName, id)

  const handleDelete = async () => await deleteDoc(docRef)

  return (
    <Button
      onClick={handleDelete}
      variant='contained'
      color='error'
      size='small'
    >
      Delete
    </Button> 
  )
}



export default App