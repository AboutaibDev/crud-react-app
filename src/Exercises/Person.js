import { useEffect, useState } from "react";
import Gif from './imgs/loading.gif';
import apiClient from './axios';
import {Button , Form , Card, Col,Row, Container} from 'react-bootstrap';

function Person(){
    const [listPerson ,setListPerson] = useState([]) // list of objects
    const [loading ,setLoading] = useState(false) // loading gif
    const [switchMode ,setSwitchMode] = useState([]) // list of boolean for switching to update mode
    const [addErr ,setAddErr] = useState(false) // add empty fields control
    const [updateErr ,setUpdateErr] = useState(false) // update empty fields control 

    let inForm = {firstName:'',lastName:''} // declaring an object with firstname and lastname

    // getting list with api and putting it in listPerson
    function getList(){
        apiClient.get('/people').then((response)=>{
            setLoading(false) // stoping the loading gif
            setListPerson(response.data.data)
            setSwitchMode(Array(listPerson.length).fill(false))
        })
    }

    // useEffect for the first component load so the list shows up
    useEffect(()=>{
        getList() 
    },[])

    // empty field control then posting the new person
    async function add(){
        if (!inForm.firstName || !inForm.lastName) {
            setAddErr(true)
        }else{
            setAddErr(false)
            setLoading(true) // loading gif activates until the process completes
            await apiClient.post('/people',{"data": inForm})
            getList() // calling getList() so the list updates in the interface
        }
    }

    // deleting an exisited person 
    async function del(Id){
        setLoading(true) // loading gif activates until the process completes
        await apiClient.delete(`/people/${Id}`)
        getList() // calling getList() so the list updates in the interface
    }

    // switching the selected person to update mode 
    function edit(index){
        let cloneSwitch = [...switchMode].fill(false)
        cloneSwitch[index] = true
        setSwitchMode(cloneSwitch)
    }

    // empty field control then updating the selected person
    async function update(Id){
        if (!inForm.firstName || !inForm.lastName) {
            setUpdateErr(true)
        }else{
            setUpdateErr(false)
            setLoading(true) // loading gif activates until the process completes
            await apiClient.put(`/people/${Id}`,{data: inForm})
            let cloneSwitch = [...switchMode].fill(false) // switching back everything from the update mode
            setSwitchMode(cloneSwitch)
            getList() // calling getList() so the list updates in the interface
        }
    }

    // canceling the update by switching back everything from the update mode
    function cancelUpdate() {
        let cloneSwitch = [...switchMode].fill(false)
        setSwitchMode(cloneSwitch)
    }
 
    // handeling the submit of the form
    function handleSubmit(e){
        e.preventDefault()
    }

    // reseting all inputs by reseting the form after adding a new person
    useEffect(()=>{
        document.forms[0].reset()
    },[listPerson])

    return(
        <Form onSubmit={handleSubmit}>
            {switchMode.includes(true) || (
            <div>
                <input type="text" className="p-1 rounded" onChange={(e)=>(inForm.firstName = e.target.value)} placeholder="First Name"/>
                <input type="text" className="p-1 rounded" onChange={(e)=>(inForm.lastName = e.target.value)} placeholder="Last Name"/> 
                <Button variant="primary" type="submit" onClick={add}>Add</Button>
                {!addErr || <p style={{color:'red'}}>Fill up all the fields</p>}
            </div>
            )}
            

            <Row>
                {
                listPerson == 0 ? <h3>The list is empty !</h3> : loading ? <Container className="d-flex justify-content-center "><img src={Gif} alt="loading"/></Container> : listPerson.map((person,index)=>(
                    <Col lg={3} className="mt-2">
                    {
                        !switchMode[index] ? 
                        <Card className="p-2" bg='light' key={index}>
                            <Card.Body>
                                <Card.Title>{person.firstName} {person.lastName}</Card.Title>
                            </Card.Body>
                            <Button variant='danger' onClick={()=>del(person.documentId)}>Delete</Button>
                            <Button variant='light' onClick={()=>edit(index)}>Edit</Button>
                        </Card> 
                        :
                        <Card className="p-2" bg="Info" key={index}>
                            <Card.Body>
                                <Card.Title >Update {person.firstName} {person.lastName} :</Card.Title>
                            </Card.Body>
                            <input className="p-2 rounded" type="text" onChange={(e)=>(inForm.firstName = e.target.value)} placeholder="First Name"/>
                            <input className="p-2 rounded" type="text" onChange={(e)=>(inForm.lastName = e.target.value)} placeholder="Last Name"/>
                            <Button variant="success" onClick={()=>update(person.documentId)}>Update</Button>
                            <Button variant="danger" onClick={cancelUpdate}>Cancel</Button>
                            {!updateErr || <p style={{color:'red'}}>Fill up all the fields</p>}
                        </Card>
                    }
                    </Col>
                ))}   
            </Row>
        </Form>
    );
}
export default Person;
