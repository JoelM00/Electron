import React from 'react'
import Button from 'react-bootstrap/Button'
import Badge from 'react-bootstrap/Badge'
import Moment from 'react-moment'

const LogItem = ({removeItem, log: {_id, priority, user, text, created}}) => { //Desestruturacao. Podia usar uma variavel e aceder aos seus atributos
    const setVariant = () => {
        if (priority === 'high') {
            return 'danger'
        } else if (priority === 'moderate') {
            return 'warning'
        } else {
            return 'success'
        }
    }

    return (
        <tr>
            <td><Badge variant={setVariant()} className='p-2'>{priority.charAt(0).toUpperCase() + priority.slice(1)}</Badge></td>
            <td>{text}</td>
            <td>{user}</td>
            <td><Moment format='MMMM Do YYYY, h:mm:ss a'>{new Date(created)}</Moment></td>
            <td>
                <Button onClick={() => {removeItem(_id)}} variant="danger" size="sm">x</Button>
            </td>
        </tr>
    )
}

export default LogItem