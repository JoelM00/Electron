import React, {useState, useEffect} from 'react'
import Container from 'react-bootstrap/Container'
import Table from 'react-bootstrap/Table'
import Alert from 'react-bootstrap/Alert'
import LogItem from './LogItem'
import AddLogItem from './AddLogItem'
import {ipcRenderer} from 'electron'

const App = () => {

	const [logs, setLogs] = useState([])

	const [alert,setAlert] = useState({
		show: false,
		message: '',
		variant: 'success'
	})

	useEffect(() => {
		ipcRenderer.send('logs:load')

		ipcRenderer.on('logs:get', (e,logs) => {
			setLogs(JSON.parse(logs))
		})

		ipcRenderer.on('logs:clear', () => {
			setLogs([])
			showAlert('Logs Cleared')
		})
	},[])

	function addItem(item) {
		if (item.text != '' && item.user != '' && item.priority != '') {
			// item._id = Math.floor(Math.random() * 90000) + 10000
			// item.created = new Date().toString()
			// setLogs([...logs,item])

			ipcRenderer.send('logs:add',item)

			showAlert('Log Added')
		} else {
			showAlert('Please enter all fields!','danger')
		}
	}

	function removeItem(_id) {
		//setLogs(logs.filter((item) => item._id != _id))
		
		ipcRenderer.send('logs:remove',_id)

		showAlert('Log Removed')
	}

	function showAlert(message, variant = 'success', seconds = 3000) {
		setAlert({
			show: true,
			message: message,
			variant: variant,
		})
		setTimeout(() => {
			setAlert({
				show: false,
				message: '',
				variant: 'success'
			})
		},seconds)
	}

	return (
		<Container>
			<AddLogItem addItem={addItem}/>
			{alert.show && <Alert variant={alert.variant}>{alert.message}</Alert>}
			<Table>
				<thead>
					<tr>
						<th>Priority</th>
						<th>Log Text</th>
						<th>User</th>
						<th>Created</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{ logs.map((log) => (
						<LogItem removeItem={removeItem} key={log._id} log={log}></LogItem>
					)) }
				</tbody>
			</Table>
		</Container>
	)
}

export default App
